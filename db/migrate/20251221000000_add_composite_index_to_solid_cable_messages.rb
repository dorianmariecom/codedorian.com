# frozen_string_literal: true

class AddCompositeIndexToSolidCableMessages < ActiveRecord::Migration[8.1]
  def change
    # Add composite index to optimize the TrimJob query:
    # SELECT "solid_cable_messages"."id" FROM "solid_cable_messages"
    # WHERE "solid_cable_messages"."created_at" < $1
    # LIMIT $2 FOR UPDATE SKIP LOCKED
    #
    # The composite index on (created_at, id) allows PostgreSQL to
    # efficiently scan records ordered by created_at while also
    # having the id readily available in the index, reducing heap
    # access overhead when using FOR UPDATE SKIP LOCKED.
    add_index :solid_cable_messages,
              %i[created_at id],
              name: "index_solid_cable_messages_on_created_at_and_id"
  end
end