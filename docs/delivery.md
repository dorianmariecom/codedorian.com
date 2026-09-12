# Program delivery

Services generate content; plans contain base pricing and schedules; subscriptions select reusable destinations. Each selection has its own monthly rate snapshot. Connections store credentials encrypted with a key derived from the application's `secret_key_base`; keep that key stable across deployments. Credentials are excluded from JSON responses and PaperTrail history.

## Setup

Run `bin/rails db:migrate` and `bin/rails delivery:install`. The installer creates disabled channel records and does not change existing rates. Open `/delivery_connections` for sending accounts, `/delivery_channels` for rates and availability, and `/delivery_destinations` for recipients. Admins manage these records; subscribers can select destinations provisioned for their account.

Set a nonnegative monthly rate in cents and its currency before enabling a channel. Zero is an explicit free rate. Selected destination currencies must match the plan currency. Multiple destinations on the same channel are supported. The billing page itemizes the base price and selections; changing selections requires reviewing and confirming the new total. Additions wait for Stripe's successful pending-update confirmation. Removals stop queued deliveries immediately and lower the next renewal without refunding the current month. An already sending provider request may finish.

Connections currently accept provider credentials directly. For social providers, supply a **user-authorized** access token with the relevant sending permissions. An app-only token does not grant permission to publish as a user. Expired/revoked tokens cause a failed delivery; update the connection and retry from delivery history. Connection secrets are never prefilled into HTML forms.

| Channel | Connection credentials | Channel settings / destination |
| --- | --- | --- |
| Email | `from`, `smtp_settings` (`address`, `port`, `user_name`, `password`, `authentication`) | Recipient email |
| Push | Existing Rpush configuration | Subscriber's registered devices |
| Messages | None | Subscriber's Code Dorian inbox |
| SMS | Twilio `account_sid`, `auth_token` | `messaging_service_sid`; international phone number |
| WhatsApp | Twilio credentials | Messaging service plus approved `content_sid_en` and `content_sid_fr`; template variables 1 = subject, 2 = body |
| RCS | Twilio credentials | RCS messaging service; recipient uses the explicit `rcs:` transport internally, disabling automatic SMS fallback |
| Apple Messages for Business | Infobip `base_url`, `api_key`, `sender` | Existing Apple business conversation recipient ID from approved onboarding |
| Slack | `access_token` | Slack conversation ID; the connected account needs access to that conversation |
| X | User `access_token` | Numeric user ID for DMs; public destination posts to the connected account |
| Mastodon | `base_url`, `access_token` | `@user@instance` for private mentions; public destination posts to connected account |
| Reddit | User `access_token` | Subreddit for posts; username for private messages only after approved API capability is verified |

Code Dorian operates phone/email/Apple senders through admin-owned connections. Slack/X/Mastodon/Reddit destinations require connections owned by the subscriber. New external channels need provider onboarding, credentials, rates, and a controlled live delivery before activation. Reddit private messaging is deliberately gated separately; an old documented endpoint alone is not evidence of usable access.

Provider references: [Twilio RCS](https://www.twilio.com/docs/rcs/send-an-rcs-message), [WhatsApp templates](https://www.twilio.com/docs/whatsapp/api), [Infobip Apple messaging](https://www.infobip.com/developers/blog/messages-api-reach-clients-seamlessly-over-apple-mfb-and-rcs), [Slack](https://docs.slack.dev/reference/methods/chat.postmessage), [X posts](https://docs.x.com/x-api/posts/create-post), [X DMs](https://docs.x.com/x-api/direct-messages/manage/introduction), [Mastodon](https://docs.joinmastodon.org/methods/statuses/), [Reddit access](https://support.reddithelp.com/hc/en-us/articles/14945211791892-Developer-Platform-Accessing-Reddit-Data).

## Program interface

All services support selectable delivery. Convert sending steps to:

```ruby
Current.subscription.deliver(
  key: "calendar:{event_id}:{reminder_time}",
  subject: subject,
  body_text: body_text,
  body_html: body_html
)
```

This is Code language syntax. The Ruby equivalent is `subscription.deliver(key: ..., subject: ..., body_text: ..., body_html: ..., url: ...)`. HTML and URL are optional. Use a stable business event key, not a new timestamp on every retry. Keys longer than 255 characters are hashed; keys over 4096 characters are rejected.

Delivery records snapshot content and recipient information. Repeating the same subscription/event/destination does not send again. Each destination is processed separately. Long text uses an excerpt and a content link; private links require account access. Public links are signed and only resolve for destinations explicitly configured as public. Disabling a destination or making it private revokes access to its public content links.

`DispatchPendingDeliveriesJob` recovers pending outbox records every minute. Explicit rate-limit rejections retry up to five attempts with exponential delays. Transport timeouts, ambiguous server failures, and interrupted workers become `uncertain`; they are never automatically resent. An admin must check the provider and reconcile the outcome before retrying. Accepted means the provider accepted the request, not that a person read it.

Twilio receipts use `/delivery_callbacks/twilio/:id`. Set the channel's `callback_base_url` to the canonical HTTPS application origin. Signatures and account IDs are checked; duplicate receipts cannot regress terminal states. Other adapters report acceptance; their eventual delivery/read receipts are not claimed as confirmed.
