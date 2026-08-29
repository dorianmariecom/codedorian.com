# frozen_string_literal: true

class AddAdvancedDataLinks < ActiveRecord::Migration[8.1]
  DATA_PATH_INPUT = '"{locale_prefix}/users/{Current.user.id}/data"'

  def up
    Link.where(kind: %w[navigation menu], position: 3..).update_all(
      "position = position + 1"
    )
    Link.where(kind: "tabs", position: 1..).update_all(
      "position = position + 1"
    )

    now = Time.current
    Link.insert_all!(
      [
        data_link("navigation", 3),
        data_link("menu", 3),
        data_link("tabs", 1)
      ].map { |attributes| attributes.merge(created_at: now, updated_at: now) }
    )
  end

  def down
    Link.where(
      kind: %w[navigation menu tabs],
      path_input: DATA_PATH_INPUT,
      title_en: "data"
    ).delete_all

    Link.where(kind: %w[navigation menu], position: 4..).update_all(
      "position = position - 1"
    )
    Link.where(kind: "tabs", position: 2..).update_all(
      "position = position - 1"
    )
  end

  private

  def data_link(kind, position)
    {
      kind: kind,
      title_en: "data",
      title_fr: "données",
      path_input: DATA_PATH_INPUT,
      verb: "get",
      visibility_input: "Current.user&.advanced?",
      image_ios: "externaldrive.fill",
      image_android: "storage",
      position: position,
      default: false
    }
  end
end
