# frozen_string_literal: true

namespace :delivery do
  desc "Create disabled delivery channels without modifying existing rates"
  task install: :environment do
    DeliveryChannel::KEYS.each do |key|
      DeliveryChannel.find_or_create_by!(key: key) do |channel|
        channel.show_recipient = !key.in?(%i[messages push])
        channel.show_visibility = !key.in?(%i[messages push])
      end
    end
    puts "Delivery channels installed. Configure connections and rates before enabling them."
  end
end
