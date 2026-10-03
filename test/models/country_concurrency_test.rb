# frozen_string_literal: true

require "test_helper"
require "timeout"

class CountryConcurrencyTest < ActiveSupport::TestCase
  self.use_transactional_tests = false

  test "concurrent synchronization of the same IP creates one country" do
    synchronize_countries(%w[203.0.113.80 203.0.113.80])

    assert_equal 1,
                 Country
                   .where_user(users(:other_user))
                   .where(ip_address: "203.0.113.80")
                   .count
    assert_equal 1, Country.where_user(users(:other_user)).primary.count
  end

  test "concurrent synchronization of different IPs keeps one primary country" do
    synchronize_countries(%w[203.0.113.81 203.0.113.82])

    assert_equal 2,
                 Country
                   .where_user(users(:other_user))
                   .where(ip_address: %w[203.0.113.81 203.0.113.82])
                   .count
    assert_equal 1, Country.where_user(users(:other_user)).primary.count
  end

  private

  def synchronize_countries(addresses)
    user_id = users(:other_user).id
    ready = Queue.new
    start = Queue.new
    threads =
      addresses.map do |ip_address|
        Thread.new do
          ActiveRecord::Base.connection_pool.with_connection do
            user = User.find(user_id)
            Current.with(user:) do
              ready.push(true)
              start.pop
              Country.sync_from_ipinfo!(
                user:,
                ip_address:,
                payload: {
                  country: "FR"
                }
              )
            end
          end
        ensure
          Current.reset
        end
      end
    Timeout.timeout(15) do
      addresses.size.times { ready.pop }
      addresses.size.times { start.push(true) }
      threads.each(&:value)
    end
  ensure
    threads&.each do |thread|
      thread.kill if thread.alive?
      thread.join
    end
  end
end
