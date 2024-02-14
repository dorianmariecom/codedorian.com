class User < ApplicationRecord
  TIME_ZONES =
    ActiveSupport::TimeZone.all.map(&:tzinfo).map(&:canonical_identifier)

  has_many :email_addresses, dependent: :destroy
  has_many :phone_numbers, dependent: :destroy
  has_many :passwords, dependent: :destroy

  scope(
    :where_email_address,
    ->(email_address) do
      joins(:email_addresses).where(
        email_addresses: {
          email_address: email_address
        }
      ).or(
        joins(:email_addresses).where(
          email_addresses: {
            smtp_user_name: email_address
          }
        )
      )
    end
  )

  accepts_nested_attributes_for(
    :email_addresses,
    reject_if: :all_blank,
    allow_destroy: true
  )
  accepts_nested_attributes_for(
    :phone_numbers,
    reject_if: :all_blank,
    allow_destroy: true
  )
  accepts_nested_attributes_for(
    :passwords,
    reject_if: :all_blank,
    allow_destroy: true
  )

  validates :time_zone, inclusion: { in: TIME_ZONES, allow_blank: true }

  def to_s
    name.presence || "User##{id}"
  end
end
