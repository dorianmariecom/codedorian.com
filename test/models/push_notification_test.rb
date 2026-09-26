# frozen_string_literal: true

require "test_helper"

class PushNotificationTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  setup do
    Current.user = users(:admin)
    ApplicationPushNotification.enabled = true
  end

  teardown do
    ApplicationPushNotification.enabled = false
    Current.reset
  end

  test "the code API queues both Apple gateways with optional data" do
    assert_enqueued_jobs 2, only: ApplicationPushNotificationJob do
      assert_equal true, Code.evaluate("Notification.create()").as_json
    end
    notifications =
      enqueued_jobs.map do |job|
        ActiveJob::Arguments.deserialize(job[:args])[1]
      end
    assert_equal [
      "codedorian - test/production",
      "codedorian - test/development"
    ],
                 notifications.pluck(:application)
    assert_equal({ "path" => "" }, notifications.first.fetch(:data))
    assert_equal "push", enqueued_jobs.first.fetch(:queue)
  end

  test "Apple payload and route survive job serialization without Current" do
    production =
      stub_request(
        :post,
        "https://api.push.apple.com/3/device/#{devices(:device).token}"
      )
        .with do |request|
          payload = JSON.parse(request.body)
          assert_equal(
            { "title" => "Hello", "body" => "World" },
            payload.dig("aps", "alert")
          )
          assert_equal "default", payload.dig("aps", "sound")
          assert_equal "inbox", payload.dig("aps", "category")
          assert_equal "thread", payload.dig("aps", "thread-id")
          assert_equal "/custom", payload.fetch("path")
          assert_equal "value", payload.fetch("extra")
          assert_equal "com.codedorian.test",
                       request.headers.fetch("Apns-Topic")
          true
        end
        .to_return(status: 200)
    sandbox =
      stub_request(
        :post,
        "https://api.sandbox.push.apple.com/3/device/#{devices(:device).token}"
      ).to_return(status: 200)
    result =
      Code.evaluate(
        'Notification.create!(subject: "Hello", body: "World", path: "/inbox", sound: "default", category: "inbox", thread_id: "thread", data: {path: "/custom", extra: "value"})'
      )
    assert_kind_of Code::Object::Notification, result
    Current.reset
    perform_enqueued_jobs
    assert_requested production
    assert_requested sandbox
  end

  test "Google payload preserves root notification sound collapse key and data" do
    stub_request(:post, "https://www.googleapis.com/oauth2/v4/token").to_return(
      status: 200,
      body: {
        access_token: "test-token",
        expires_in: 3600,
        token_type: "Bearer"
      }.to_json,
      headers: {
        "Content-Type" => "application/json"
      }
    )
    request =
      stub_request(
        :post,
        "https://fcm.googleapis.com/v1/projects/test-project/messages:send"
      )
        .with do |http_request|
          message = JSON.parse(http_request.body).fetch("message")
          assert_equal devices(:other_device).token, message.fetch("token")
          assert_equal(
            { "title" => "Hello", "body" => "World" },
            message.fetch("notification")
          )
          assert_equal(
            { "path" => "/inbox", "count" => "2" },
            message.fetch("data")
          )
          assert_equal "collapse", message.dig("android", "collapse_key")
          assert_equal "86400s", message.dig("android", "ttl")
          assert_equal(
            { "sound" => "default", "default_sound" => true },
            message.dig("android", "notification")
          )
          assert_nil message.dig("android", "priority")
          true
        end
        .to_return(status: 200, body: "{}")
    assert_enqueued_jobs 1 do
      Code.evaluate(
        "Notification.create!(to: User.find!(\"#{users(:other_user).id}\"), subject: \"Hello\", body: \"World\", path: \"/inbox\", sound: \"default\", collapse_key: \"collapse\", data: {count: 2})"
      )
    end
    perform_enqueued_jobs
    assert_requested request
  end

  test "recipient devices remain policy scoped" do
    Current.user = users(:other_user)
    assert_no_enqueued_jobs do
      assert_raises(ActiveRecord::RecordNotFound) do
        Code::Object::Notification.code_create(to: users(:admin).to_code)
      end
    end
    assert_enqueued_jobs 1 do
      Code.evaluate("Notification.create()")
    end
  end

  test "invalid tokens leave devices registered and do not prevent the other gateway" do
    production =
      stub_request(
        :post,
        "https://api.push.apple.com/3/device/#{devices(:device).token}"
      ).to_return(status: 400, body: { reason: "BadDeviceToken" }.to_json)
    sandbox =
      stub_request(
        :post,
        "https://api.sandbox.push.apple.com/3/device/#{devices(:device).token}"
      ).to_return(status: 200)
    Code.evaluate('Notification.create(subject: "Hello")')
    assert_no_difference "Device.count" do
      perform_enqueued_jobs
    end
    assert devices(:device).reload.verified?
    assert_requested production
    assert_requested sandbox
  end

  test "deleted devices are discarded before delivery" do
    Code.evaluate('Notification.create(subject: "Hello")')
    devices(:device).destroy!
    perform_enqueued_jobs
    assert_not_requested :post, %r{https://api.*push.apple.com/}
  end

  test "transient provider failures retry on the push queue" do
    stub_request(
      :post,
      "https://api.push.apple.com/3/device/#{devices(:device).token}"
    ).to_return(status: 503, body: { reason: "ServiceUnavailable" }.to_json)
    notification =
      ApplicationPushNotification.new(
        application: "codedorian - test/production",
        title: "Hello"
      )
    assert_enqueued_with(job: ApplicationPushNotificationJob, queue: "push") do
      ApplicationPushNotificationJob.set(queue: :push).perform_now(
        ApplicationPushNotification.name,
        notification.as_json,
        devices(:device)
      )
    end
  end

  test "aborted enqueues preserve the code API error contract" do
    callback = -> { throw :abort }
    ApplicationPushNotificationJob.set_callback(:enqueue, :before, callback)
    assert_equal false, Code.evaluate("Notification.create()").as_json
    error =
      assert_raises(Code::Error) { Code.evaluate("Notification.create!()") }
    assert_match "notification not saved", error.message
  ensure
    ApplicationPushNotificationJob.skip_callback(:enqueue, :before, callback)
  end

  test "Solid Queue inserts roll back with the notification transaction" do
    adapter = ApplicationPushNotificationJob.queue_adapter
    ApplicationPushNotificationJob.queue_adapter = :solid_queue
    assert_no_difference "SolidQueue::Job.count" do
      ApplicationRecord.transaction do
        assert_equal true, Code.evaluate("Notification.create()").as_json
        raise ActiveRecord::Rollback
      end
    end
  ensure
    ApplicationPushNotificationJob.queue_adapter = adapter
  end
end
