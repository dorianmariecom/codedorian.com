# frozen_string_literal: true

class PopulateDeliveryInputs < ActiveRecord::Migration[8.1]
  def up
    self.class.programs.each do |key, input|
      execute(
        "UPDATE delivery_channels SET delivery_input = #{connection.quote(input)} " \
          "WHERE key = #{connection.quote(key)} AND delivery_input IS NULL"
      )
    end
  end

  def down
  end

  def self.programs
    common = <<~'CODE'
      rejected = (code, retryable = false) => {
        {
          status: :rejected,
          error_code: code,
          retryable: retryable
        }
      }

      accepted = (id) => {
        if id.blank?
          return(
            { status: :uncertain }
          )
        else
          return(
            {
              status: :accepted,
              provider_id: id.to_string
            }
          )
        end
      }

      truncate = (value, limit) => {
        if value.length > limit
          value.slice(0, limit - 3) + "..."
        else
          value
        end
      }

      compact_text = (value, limit) => {
        if value.length <= limit
          return(value)
        end

        url = delivery.url

        if url.blank?
          url = if delivery.visibility == :public
            delivery.public_url
          else
            delivery.private_url
          end
        end

        if !url.starts_with?("https://") or url.length >= limit / 2
          return(nothing)
        end

        truncate(value, limit - url.length - 2) + "\n\n" + url
      }

      text = [delivery.subject, delivery.body_text].select(
        (value) => {
          value.present?
        }
      ).join("\n\n")

      idempotency_key = Cryptography.sha256("delivery-{delivery.id}")

      request = (method, url, options = {}, parse_json = true) => {
        options = {
          open_timeout: 10,
          read_timeout: 30,
          write_timeout: 30
        }.merge(options)

        if !delivery.recipient_verified?
          return({ status: :canceled })
        end

        response = Http.fetch(method, url, options)

        if response.method != method
          return({ status: :uncertain })
        end

        status = response.code

        data = Json.parse(response.body)

        provider = if connection.present?
          connection.provider
        else
          ""
        end

        if [:facebook, :messenger, :instagram].include?(provider)
          and data.is_a?(Dictionary)
          and data[:error].is_a?(Dictionary)
          if status >= 200 and status < 300
            or status >= 400 and status < 500 and status != 408
            return(
              rejected(
                "{provider}_{data[:error].code}",
                status == 429 or data[:error][:is_transient] == true
              )
            )
          end
        end

        if status == 429
          return(rejected(:http_429, true))
        end

        if provider == :github
          and status == 403
          and (
          response.headers["x-ratelimit-remaining"] == "0"
            or response.headers["retry-after"].present?
        )
          return(rejected(:http_403, true))
        end

        if status >= 400 and status < 500 and status != 408
          return(rejected("http_{status}"))
        end

        if status < 200 or status >= 300 or parse_json and data.nothing?
          return(
            { status: :uncertain }
          )
        end

        {
          status: :ok,
          data: data,
          headers: response.headers
        }
      }

      json_request = (url, data, headers = {}) => {
        request(
          :post,
          url,
          {
            body: Json.generate(data),
            headers: { "Content-Type": "application/json" }.merge(headers)
          }
        )
      }
    CODE
    {
      "messages" => <<~CODE,
        message = Message.create!(
          from: delivery.service.user,
          to: delivery.user,
          subject: delivery.subject,
          body: if delivery.body_html.present?
            delivery.body_html
          else
            Html.escape(delivery.body_text).to_string
          end
        )

        {
          status: :delivered,
          provider_id: message.id.to_string
        }
      CODE
      "push" => <<~CODE,
        user = delivery.user

        if user.devices.empty?
          return(
            {
              status: :rejected,
              error_code: :no_push_devices,
              retryable: false
            }
          )
        end

        if !user.devices.any?(
          (device) => {
            device.push_configured?
          }
        )
          return(
            {
              status: :rejected,
              error_code: :push_not_configured,
              retryable: false
            }
          )
        end

        body = delivery.body_text

        if body.length > 2_000
          body = body.slice(0, 1_997) + "..."
        end

        Notification.create!(
          from: delivery.service.user,
          to: user,
          subject: delivery.subject,
          body: body,
          path: delivery.private_url_path,
          sound: :default,
          thread_id: "subscription-{delivery.subscription_id}"
        )

        { status: :accepted }
      CODE
      "webhook" => common + <<~CODE,
        response = request(
          :post,
          delivery.recipient,
          {
            body: Json.generate(
              {
                id: delivery.id,
                event_key: delivery.event_key,
                subject: delivery.subject,
                body_text: delivery.body_text,
                body_html: delivery.body_html,
                url: delivery.url,
                locale: delivery.locale
              }
            ),
            headers: {
              "Content-Type": "application/json",
              "Idempotency-Key": idempotency_key
            }
          },
          false
        )

        if response.status != :ok
          return(response)
        end

        { status: :accepted }
      CODE
      "facebook" => common + <<~CODE,
        if delivery.visibility != :public
          return(rejected(:facebook_public_only))
        end

        if delivery.recipient.present?
          return(rejected(:invalid_recipient))
        end

        content = compact_text(text, 4_000)

        if content.nothing?
          return(rejected(:content_too_long_without_link))
        end

        response = json_request(
          "https://graph.facebook.com/v26.0/"
            + "{connection.sender}/feed",
          { message: content, link: delivery.url }.compact,
          {
            "Authorization": "Bearer {connection.access_token}"
          }
        )

        if response.status != :ok
          return(response)
        end

        accepted(response.data[:id])
      CODE
      "messenger" => common + <<~CODE,
        content = compact_text(text, 2_000)

        if content.nothing?
          return(rejected(:content_too_long_without_link))
        end

        payload = {
          recipient: { id: delivery.recipient },
          message: { text: content }
        }

        payload.messaging_type = "RESPONSE"

        response = json_request(
          "https://graph.facebook.com/v26.0/"
            + "{Url.encode(connection.sender)}/messages",
          payload,
          {
            "Authorization": "Bearer {connection.access_token}"
          }
        )

        if response.status != :ok
          return(response)
        end

        accepted(response.data[:message_id])
      CODE
      "instagram" => common + <<~CODE,
        content = compact_text(text, 1_000)

        if content.nothing?
          return(rejected(:content_too_long_without_link))
        end

        payload = {
          recipient: { id: delivery.recipient },
          message: { text: content }
        }

        response = json_request(
          "https://graph.instagram.com/v26.0/"
            + "{Url.encode(connection.sender)}/messages",
          payload,
          {
            "Authorization": "Bearer {connection.access_token}"
          }
        )

        if response.status != :ok
          return(response)
        end

        accepted(response.data[:message_id])
      CODE
      "telegram" => common + <<~'CODE',
        if !connection.access_token.match?(Regex.new("\A[0-9]+:[a-zA-Z0-9_-]+\z"))
          return(rejected(:invalid_telegram_token))
        end

        content = compact_text(text, 4_096)

        if content.nothing?
          return(rejected(:content_too_long_without_link))
        end

        response = json_request(
          "https://api.telegram.org/bot"
            + "{connection.access_token}/sendMessage",
          {
            chat_id: delivery.recipient,
            text: content,
            link_preview_options: { is_disabled: true }
          }
        )

        if response.status != :ok
          return(response)
        end

        if response.data.ok != true
          code = (response.data[:error_code] or :rejected).to_string

          return(rejected("telegram_{code}", code == "429"))
        end

        accepted(response.data.result.message_id)
      CODE
      "viber" => common + <<~CODE,
        content = compact_text(text, 7_000)

        if content.nothing?
          return(rejected(:content_too_long_without_link))
        end

        response = json_request(
          "https://chatapi.viber.com/pa/send_message",
          {
            receiver: delivery.recipient,
            type: :text,
            text: content,
            sender: { name: connection.sender }
          },
          {
            "X-Viber-Auth-Token": connection.access_token
          }
        )

        if response.status != :ok
          return(response)
        end

        if response.data.status != 0
          return(rejected("viber_{response.data.status}", response.data.status == 12))
        end

        accepted(response.data[:message_token])
      CODE
      "sms" => common + <<~CODE,
        target = delivery.recipient

        if [:whatsapp, :rcs].include?(delivery.channel)
          target = "{delivery.channel}:{target}"
        end

        payload = {
          "To": target,
          "MessagingServiceSid": delivery_channel.messaging_service_sid
        }

        if delivery.channel == :whatsapp
          content = compact_text(delivery.body_text, 1_000)

          if content.nothing?
            return(rejected(:content_too_long_without_link))
          end

          payload.ContentSid = if delivery.locale == :fr
            delivery_channel.content_sid_fr
          else
            delivery_channel.content_sid_en
          end

          payload.ContentVariables = Json.generate(
            { "1": delivery.subject, "2": content }
          )
        else
          content = compact_text(text, 1_500)

          if content.nothing?
            return(rejected(:content_too_long_without_link))
          end

          payload.Body = content
        end

        if delivery_channel.callback_base_url.present?
          payload.StatusCallback = "{delivery_channel.callback_base_url}"
            + "/delivery_callbacks/twilio/{delivery.id}"
        end

        response = request(
          :post,
          "https://api.twilio.com/2010-04-01/Accounts/"
            + "{Url.encode(connection.account_sid)}/Messages.json",
          {
            data: payload,
            username: connection.account_sid,
            password: connection.auth_token
          }
        )

        if response.status != :ok
          return(response)
        end

        accepted(response.data[:sid])
      CODE
      "whatsapp" => common + <<~CODE,
        target = delivery.recipient

        if [:whatsapp, :rcs].include?(delivery.channel)
          target = "{delivery.channel}:{target}"
        end

        payload = {
          "To": target,
          "MessagingServiceSid": delivery_channel.messaging_service_sid
        }

        if delivery.channel == :whatsapp
          content = compact_text(delivery.body_text, 1_000)

          if content.nothing?
            return(rejected(:content_too_long_without_link))
          end

          payload.ContentSid = if delivery.locale == :fr
            delivery_channel.content_sid_fr
          else
            delivery_channel.content_sid_en
          end

          payload.ContentVariables = Json.generate(
            { "1": delivery.subject, "2": content }
          )
        else
          content = compact_text(text, 1_500)

          if content.nothing?
            return(rejected(:content_too_long_without_link))
          end

          payload.Body = content
        end

        if delivery_channel.callback_base_url.present?
          payload.StatusCallback = "{delivery_channel.callback_base_url}"
            + "/delivery_callbacks/twilio/{delivery.id}"
        end

        response = request(
          :post,
          "https://api.twilio.com/2010-04-01/Accounts/"
            + "{Url.encode(connection.account_sid)}/Messages.json",
          {
            data: payload,
            username: connection.account_sid,
            password: connection.auth_token
          }
        )

        if response.status != :ok
          return(response)
        end

        accepted(response.data[:sid])
      CODE
      "rcs" => common + <<~CODE,
        target = delivery.recipient

        if [:whatsapp, :rcs].include?(delivery.channel)
          target = "{delivery.channel}:{target}"
        end

        payload = {
          "To": target,
          "MessagingServiceSid": delivery_channel.messaging_service_sid
        }

        if delivery.channel == :whatsapp
          content = compact_text(delivery.body_text, 1_000)

          if content.nothing?
            return(rejected(:content_too_long_without_link))
          end

          payload.ContentSid = if delivery.locale == :fr
            delivery_channel.content_sid_fr
          else
            delivery_channel.content_sid_en
          end

          payload.ContentVariables = Json.generate(
            { "1": delivery.subject, "2": content }
          )
        else
          content = compact_text(text, 1_500)

          if content.nothing?
            return(rejected(:content_too_long_without_link))
          end

          payload.Body = content
        end

        if delivery_channel.callback_base_url.present?
          payload.StatusCallback = "{delivery_channel.callback_base_url}"
            + "/delivery_callbacks/twilio/{delivery.id}"
        end

        response = request(
          :post,
          "https://api.twilio.com/2010-04-01/Accounts/"
            + "{Url.encode(connection.account_sid)}/Messages.json",
          {
            data: payload,
            username: connection.account_sid,
            password: connection.auth_token
          }
        )

        if response.status != :ok
          return(response)
        end

        accepted(response.data[:sid])
      CODE
      "apple" => common + <<~CODE,
        base_url = connection.base_url.delete_suffix("/")

        content = compact_text(text, 4_000)

        if content.nothing?
          return(rejected(:content_too_long_without_link))
        end

        response = json_request(
          "{base_url}/messages-api/1/messages",
          {
            messages: [
              {
                channel: "APPLE_MB",
                sender: connection.sender,
                destinations: [{ to: delivery.recipient }],
                content: { body: { type: "TEXT", text: content } }
              }
            ]
          },
          {
            "Authorization": "App {connection.api_key}"
          }
        )

        if response.status != :ok
          return(response)
        end

        accepted(response.data.messages.first.messageId)
      CODE
      "mastodon" => common + <<~CODE,
        base_url = connection.base_url.delete_suffix("/")

        content = compact_text(text, 400)

        if content.nothing?
          return(rejected(:content_too_long_without_link))
        end

        if delivery.visibility != :public
          content = delivery.recipient.split.join(" ") + " " + content
        end

        response = json_request(
          "{base_url}/api/v1/statuses",
          {
            status: content,
            visibility: if delivery.visibility == :public
              :public
            else
              :direct
            end
          },
          {
            "Authorization": "Bearer {connection.access_token}",
            "Idempotency-Key": idempotency_key
          }
        )

        if response.status != :ok
          return(response)
        end

        accepted(response.data[:id])
      CODE
      "github" => common + <<~'CODE',
        if !delivery.recipient
          .match?(Regex.new("\A[a-zA-Z0-9](?:[a-zA-Z0-9-]\{0,38})/[a-zA-Z0-9_.-]\{1,100}\z"))
          return(rejected(:invalid_github_recipient))
        end

        if [".", ".."].include?(delivery.recipient.split("/").last)
          return(rejected(:invalid_github_recipient))
        end

        headers = {
          "Authorization": "Bearer {connection.access_token}",
          "Accept": "application/vnd.github+json",
          "X-GitHub-Api-Version": "2026-03-10",
          "User-Agent": "codedorian.com"
        }

        response = request(
          :get,
          "https://api.github.com/repos/{delivery.recipient}",
          { headers: headers }
        )

        if response.status != :ok
          return(response)
        end

        if response.data.private != (delivery.visibility != :public)
          return(rejected(:github_repository_visibility_mismatch))
        end

        response = json_request(
          "https://api.github.com/repos/{delivery.recipient}"
            + "/issues",
          {
            title: delivery.subject,
            body: delivery.body_text
          },
          headers
        )

        if response.status != :ok
          return(response)
        end

        if !response.data[:id].is_a?(Integer) or response.data[:id] <= 0
          return(
            { status: :uncertain }
          )
        end

        accepted(response.data[:id])
      CODE
      "x" => common + <<~'CODE',
        recipient = delivery.recipient.to_string

        public = delivery.visibility == :public

        numeric = recipient.match?(Regex.new("\A[0-9]+\z"))

        username = recipient.match?(Regex.new("\A@[a-zA-Z0-9_]\{1,15}\z"))

        hashtag = recipient.match?(Regex.new("\A#[\p\{L}\p\{N}_]+\z"))

        if !(numeric or username or public and (recipient.blank? or hashtag))
          return(rejected(:invalid_x_recipient))
        end

        headers = {
          "Authorization": "Bearer {connection.access_token}"
        }

        if public
          limit = 280

          if recipient.present? and !numeric
            limit = limit - recipient.length - 1
          end

          content = compact_text(text, limit)

          if content.nothing?
            return(rejected(:content_too_long_without_link))
          end

          if recipient.present? and !numeric
            content = recipient + " " + content
          end

          endpoint = "https://api.x.com/2/tweets"
        else
          recipient = recipient

          if !numeric
            response = request(
              :get,
              "https://api.x.com/2/users/by/username/"
                + "{recipient.delete_prefix("@")}",
              { headers: headers }
            )

            if response.status != :ok
              return(response)
            end

            recipient = response.data.data.id

            if !recipient.to_string.match?(Regex.new("\A[0-9]+\z"))
              return(rejected(:x_user_not_found))
            end
          end

          content = compact_text(text, 10_000)

          if content.nothing?
            return(rejected(:content_too_long_without_link))
          end

          endpoint = "https://api.x.com/2/dm_conversations/with/"
            + "{recipient}/messages"
        end

        response = json_request(
          endpoint,
          { text: content },
          headers
        )

        if response.status != :ok
          return(response)
        end

        accepted(
          if public
            response.data.data.id
          else
            response.data.data.dm_event_id
          end
        )
      CODE
      "slack" => common + <<~'CODE',
        recipient = delivery.recipient

        headers = {
          "Authorization": "Bearer {connection.access_token}"
        }

        if !recipient.match?(Regex.new("\A[CDGUW][A-Z0-9]+\z"))
          if !recipient.match?(Regex.new("\A[@#][^\s@#<>]+\z"))
            return(rejected(:invalid_slack_recipient))
          end

          name = recipient.delete_prefix("@").delete_prefix("#").downcase

          channel = recipient.starts_with?("#")

          method = if channel
            "conversations.list"
          else
            "users.list"
          end

          entries = []

          cursor = ""

          seen = []

          while true
            query = { limit: 200 }

            if channel
              query = query.merge(
                {
                  types: "public_channel,private_channel",
                  exclude_archived: true
                }
              )
            end

            if cursor.present?
              query.cursor = cursor
            end

            response = request(
              :get,
              "https://slack.com/api/{method}",
              { headers: headers, query: query }
            )

            if response.status != :ok
              return(response)
            end

            if response.data.ok != true
              return(rejected((response.data[:error] or :slack_lookup_failed)))
            end

            values = if channel
              response.data.channels
            else
              response.data.members
            end

            if !values.is_a?(List)
              return(rejected(:slack_recipient_lookup_failed, true))
            end

            entries = entries + values

            cursor = (response.data[:response_metadata] or {})[:next_cursor]

            if cursor.blank?
              break
            end

            if seen.include?(cursor)
              return(rejected(:slack_recipient_lookup_failed, true))
            end

            seen.push(cursor)
          end

          if channel
            found = entries.detect(
              (entry) => {
                entry.name.to_string.downcase == name
              }
            )

            if found.nothing?
              return(rejected(:channel_not_found))
            end

            recipient = found.id
          else
            entries = entries.reject(
              (entry) => {
                entry[:deleted] or entry[:is_bot]
              }
            )

            matches = entries.select(
              (entry) => {
                entry.name.to_string.downcase == name
              }
            )

            if matches.empty?
              matches = entries.select(
                (entry) => {
                  (entry[:profile] or {})[:display_name].to_string.downcase == name
                }
              )
            end

            if matches.empty?
              return(rejected(:user_not_found))
            end

            if matches.length != 1
              return(rejected(:ambiguous_slack_user))
            end

            response = request(
              :post,
              "https://slack.com/api/conversations.open",
              {
                headers: headers,
                data: { users: matches.first.id }
              }
            )

            if response.status != :ok
              return(response)
            end

            if response.data.ok != true
              return(rejected((response.data[:error] or :slack_lookup_failed)))
            end

            recipient = response.data.channel.id
          end
        end

        content = compact_text(text, 4_000)

        if content.nothing?
          return(rejected(:content_too_long_without_link))
        end

        response = json_request(
          "https://slack.com/api/chat.postMessage",
          {
            channel: recipient,
            text: content,
            unfurl_links: false,
            unfurl_media: false
          },
          headers
        )

        if response.status != :ok
          return(response)
        end

        if response.data.ok != true
          return(rejected((response.data[:error] or :slack_rejected)))
        end

        accepted(response.data.ts)
      CODE
      "reddit" => common + <<~CODE,
        if delivery.visibility == :public
          return(rejected(:reddit_public_unavailable))
        end

        if !delivery.recipient_verified?
          return(rejected(:recipient_unverified))
        end

        credentials = Connection.reddit

        recipient = delivery.recipient.delete_prefix("u/").delete_prefix("@")

        response = request(
          :post,
          "https://oauth.reddit.com/api/compose",
          {
            headers: {
              "Authorization": "Bearer {credentials.access_token}",
              "User-Agent": "web:codedorian.com:1.0 (by /u/"
                + "{credentials.username})"
            },
            data: {
              api_type: :json,
              to: recipient,
              subject: truncate(delivery.subject, 100),
              text: delivery.body_text
            }
          }
        )

        if response.status != :ok
          return(response)
        end

        if !response.data[:json].is_a?(Dictionary)
          or !response.data[:json][:errors].is_a?(List)
          return(
            { status: :uncertain }
          )
        end

        if response.data.json.errors.present?
          code = response.data.json.errors.first.first.to_string

          return(rejected("reddit_{code.downcase}", code == "RATELIMIT"))
        end

        { status: :accepted }
      CODE
      "email" => common + <<~'CODE'
        message_id = "delivery-{delivery.id}@codedorian.com"

        message = {
          from: connection.smtp_from,
          to: delivery.recipient,
          subject: delivery.subject,
          body_text: delivery.body_text,
          body_html: delivery.body_html
        }

        provider = connection.provider

        if provider == :smtp
          smtp = Smtp.new(
            {
              address: connection.smtp_address,
              port: connection.smtp_port,
              user_name: connection.smtp_user_name,
              password: connection.smtp_password,
              authentication: connection.smtp_authentication
            }
          )

          if !delivery.recipient_verified?
            return({ status: :canceled })
          end

          smtp.send(message)
          return({ status: :accepted })
        end

        if [connection.smtp_from, delivery.recipient].any?((value) => { value.match?(Regex.new("[\r\n]")) })
          return(rejected(:invalid_email_header))
        end

        sender = { email: connection.smtp_from.strip }
        if connection.smtp_from.include?("<")
          sender.email = connection.smtp_from.split("<").last.strip.delete_suffix(">").strip
          sender.name = connection.smtp_from.split("<").first.strip.delete_prefix('"').delete_suffix('"')
        end

        encode_header = (value) => {
          words = []
          index = 0
          while index < value.length
            words.push("=?UTF-8?B?{Base64.strict_encode(value.slice(index, 11))}?=")
            index = index + 11
          end
          words.join("\r\n ")
        }

        encode_message = () => {
          from = sender.email
          if sender[:name].present?
            from = encode_header(sender.name) + " <{sender.email}>"
          end
          boundary = "delivery-{delivery.id}"
          mime_headers = [
            "Date: {Time.now.rfc2822}",
            "From: {from}",
            "To: {delivery.recipient}",
            "Subject: {encode_header(delivery.subject)}",
            "Message-ID: <{message_id}>",
            "MIME-Version: 1.0",
            'Content-Type: multipart/alternative; boundary="{boundary}"'
          ]
          parts = [{ type: "text/plain", body: delivery.body_text }]
          if delivery.body_html.present?
            parts.push({ type: "text/html", body: delivery.body_html })
          end
          body = parts.map((part) => {
            [
              "--{boundary}",
              "Content-Type: {part.type}; charset=UTF-8",
              "Content-Transfer-Encoding: base64",
              "",
              Base64.encode(part.body).split("\n").join("\r\n")
            ].join("\r\n")
          }).join("\r\n")
          mime_headers.join("\r\n") + "\r\n\r\n" + body + "\r\n--{boundary}--\r\n"
        }

        headers = {
          "Authorization": "Bearer {connection.access_token}"
        }

        if [:gmail, :google_workspace].include?(provider)
          raw =
            Base64.urlsafe_encode(encode_message()).delete_suffix("=")
              .delete_suffix("=")

          response = json_request(
            "https://gmail.googleapis.com/gmail/v1/users/me/mes"
              + "sages/send",
            { raw: raw },
            headers
          )

          if response.status != :ok
            return(response)
          end

          return(accepted(response.data[:id]))
        end

        if provider == :outlook
          response = request(
            :post,
            "https://graph.microsoft.com/v1.0/me/sendMail",
            {
              body: Base64.strict_encode(encode_message()),
              headers: headers.merge(
                { "Content-Type": "text/plain" }
              )
            },
            false
          )

          if response.status != :ok
            return(response)
          end

          return(
            { status: :accepted }
          )
        end

        if provider == :sendgrid
          content = [
            {
              type: "text/plain",
              value: delivery.body_text
            }
          ]

          if delivery.body_html.present?
            content.push(
              {
                type: "text/html",
                value: delivery.body_html
              }
            )
          end

          response = request(
            :post,
            "https://api.sendgrid.com/v3/mail/send",
            {
              body: Json.generate(
                {
                  personalizations: [{ to: [{ email: delivery.recipient }] }],
                  from: sender,
                  subject: delivery.subject,
                  content: content
                }
              ),
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer {connection.api_key}"
              }
            },
            false
          )

          if response.status != :ok
            return(response)
          end

          return(
            {
              status: :accepted,
              provider_id: response.headers["x-message-id"]
            }
          )
        end

        if provider == :resend
          response = json_request(
            "https://api.resend.com/emails",
            {
              from: connection.smtp_from,
              to: [delivery.recipient],
              subject: delivery.subject,
              text: delivery.body_text,
              html: delivery.body_html
            }.compact,
            {
              "Authorization": "Bearer {connection.api_key}",
              "Idempotency-Key": idempotency_key
            }
          )

          if response.status != :ok
            return(response)
          end

          return(accepted(response.data[:id]))
        end

        if provider == :mailgun
          host = if connection.mailgun_region == :eu
            "api.eu.mailgun.net"
          else
            "api.mailgun.net"
          end

          response = request(
            :post,
            "https://{host}/v3/"
              + "{Url.encode(connection.mailgun_domain)}/messages",
            {
              data: {
                from: connection.smtp_from,
                to: delivery.recipient,
                subject: delivery.subject,
                text: delivery.body_text,
                html: delivery.body_html
              }.compact,
              username: :api,
              password: connection.api_key
            }
          )

          if response.status != :ok
            return(response)
          end

          return(accepted(response.data[:id]))
        end

        if provider == :mailchimp
          response = json_request(
            "https://mandrillapp.com/api/1.0/messages/send.json",
            {
              key: connection.api_key,
              message: {
                from_email: sender.email,
                from_name: sender.name,
                to: [{ email: delivery.recipient, type: :to }],
                subject: delivery.subject,
                text: delivery.body_text,
                html: delivery.body_html
              }.compact
            }
          )

          if response.status != :ok
            return(response)
          end

          data = response.data

          if data.is_a?(Dictionary) and data.status == :error
            return(rejected(:mailchimp_rejected))
          end

          if !data.is_a?(List) or data.length != 1 or !data.first.is_a?(Dictionary)
            return(
              { status: :uncertain }
            )
          end

          if ![:sent, :queued, :scheduled].include?(data.first.status)
            return(rejected("mailchimp_{data.first.status}"))
          end

          return(accepted(data.first[:_id]))
        end

        if provider == :aws_ses
          hmac_sha256 = (key, value, format = :hex) => {
            if key.bytesize > 64
              key = Cryptography.sha256(key, format: :digest)
            end

            key = key + 0.character * (64 - key.bytesize)
            inner = key.bytes.map((byte) => { (byte ^ 54).character }).join
            outer = key.bytes.map((byte) => { (byte ^ 92).character }).join
            digest = Cryptography.sha256(inner + value, format: :digest)
            Cryptography.sha256(outer + digest, format: format)
          }

          region = connection.aws_region

          domain = if region.starts_with?("cn-")
            "amazonaws.com.cn"
          else
            "amazonaws.com"
          end

          host = "email.{region}.{domain}"

          path = "/v2/email/outbound-emails"

          payload = Json.generate(
            {
              FromEmailAddress: connection.smtp_from,
              Destination: { ToAddresses: [delivery.recipient] },
              Content: {
                Raw: {
                  Data: Base64.strict_encode(encode_message())
                }
              }
            }
          )

          timestamp = Time.now.utc.format("%Y%m%dT%H%M%SZ")

          date = timestamp.slice(0, 8)

          scope = "{date}/{region}/ses/aws4_request"

          headers = {
            "content-type": "application/json",
            host: host,
            "x-amz-date": timestamp
          }

          if connection.aws_session_token.present?
            headers["x-amz-security-token"] = connection.aws_session_token
          end

          signed_headers = headers.keys.join(";")

          canonical_headers = headers.map(
            (key, value) => {
              "{key}:{value.strip}\n"
            }
          ).join

          canonical_request = [
            "POST",
            path,
            "",
            canonical_headers,
            signed_headers,
            Cryptography.sha256(payload)
          ].join("\n")

          string_to_sign = [
            "AWS4-HMAC-SHA256",
            timestamp,
            scope,
            Cryptography.sha256(canonical_request)
          ].join("\n")

          date_key = hmac_sha256("AWS4{connection.aws_secret_access_key}", date, :digest)

          region_key = hmac_sha256(date_key, region, :digest)

          service_key = hmac_sha256(region_key, :ses, :digest)

          signing_key =
            hmac_sha256(service_key, :aws4_request, :digest)

          signature = hmac_sha256(signing_key, string_to_sign)

          headers = headers.reject(
            (key, value) => {
              key == :host
            }
          )

          headers.Authorization = "AWS4-HMAC-SHA256 Credential="
            + "{connection.aws_access_key_id}/{scope}, "
            + "SignedHeaders={signed_headers}, Signature="
            + "{signature}"

          response = request(
            :post,
            "https://{host}{path}",
            { body: payload, headers: headers }
          )

          if response.status != :ok
            return(response)
          end

          return(accepted(response.data["MessageId"]))
        end

        rejected(:unsupported_provider)
      CODE
    }
  end
end
