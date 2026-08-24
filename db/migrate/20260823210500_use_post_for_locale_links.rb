# frozen_string_literal: true

class UsePostForLocaleLinks < ActiveRecord::Migration[8.0]
  def up
    Link.where(
      kind: %w[navigation menu],
      path_input: "Current.locale == :fr ? en_url : fr_url"
    ).update_all(path_input: "switch_locale_url", verb: "post")
  end

  def down
    Link.where(
      kind: %w[navigation menu],
      path_input: "switch_locale_url"
    ).update_all(
      path_input: "Current.locale == :fr ? en_url : fr_url",
      verb: "get"
    )
  end
end
