# frozen_string_literal: true

class AddGinIndexOnLogsContext < ActiveRecord::Migration[8.1]
  disable_ddl_transaction!

  def change
    add_index(
      :logs,
      :context,
      using: :gin,
      opclass: :jsonb_path_ops,
      algorithm: :concurrently
    )
  end
end
