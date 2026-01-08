# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_01_07_120000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "action_text_rich_texts", force: :cascade do |t|
    t.text "body"
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.datetime "updated_at", null: false
    t.index %w[record_type record_id name],
            name: "index_action_text_rich_texts_uniqueness",
            unique: true
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.datetime "updated_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index %w[record_type record_id name blob_id],
            name: "index_active_storage_attachments_uniqueness",
            unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.datetime "updated_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "variation_digest", null: false
    t.index %w[blob_id variation_digest],
            name: "index_active_storage_variant_records_uniqueness",
            unique: true
  end

  create_table "addresses", force: :cascade do |t|
    t.string "address"
    t.jsonb "autocomplete"
    t.datetime "created_at", null: false
    t.boolean "primary", default: false, null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.boolean "verified", default: false, null: false
    t.index %w[user_id verified primary],
            name: "index_addresses_on_user_id_and_verified_and_primary"
    t.index ["user_id"], name: "index_addresses_on_user_id"
  end

  create_table "attachments", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_attachments_on_user_id"
  end

  create_table "configurations", force: :cascade do |t|
    t.jsonb "content", default: {}, null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_configurations_on_name", unique: true
  end

  create_table "country_code_ip_addresses", force: :cascade do |t|
    t.string "country_code"
    t.datetime "created_at", null: false
    t.string "ip_address", null: false
    t.datetime "updated_at", null: false
    t.index ["ip_address"],
            name: "index_country_code_ip_addresses_on_ip_address",
            unique: true
  end

  create_table "data", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.jsonb "key"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.jsonb "value"
    t.index ["user_id"], name: "index_data_on_user_id"
  end

  create_table "devices", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "platform"
    t.boolean "primary", default: false, null: false
    t.string "token"
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.boolean "verified", default: false, null: false
    t.index %w[token user_id],
            name: "index_devices_on_token_and_user_id",
            unique: true
    t.index %w[user_id verified primary],
            name: "index_devices_on_user_id_and_verified_and_primary"
    t.index ["user_id"], name: "index_devices_on_user_id"
  end

  create_table "email_addresses", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email_address"
    t.boolean "primary", default: false, null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.boolean "verified", default: false, null: false
    t.index %w[user_id verified primary],
            name: "index_email_addresses_on_user_id_and_verified_and_primary"
    t.index ["user_id"], name: "index_email_addresses_on_user_id"
  end

  create_table "example_schedules", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "example_id", null: false
    t.string "interval"
    t.datetime "starts_at"
    t.datetime "updated_at", null: false
    t.index ["example_id"], name: "index_example_schedules_on_example_id"
  end

  create_table "examples", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "input"
    t.string "locale", default: "en", null: false
    t.string "name"
    t.bigint "position", default: 0, null: false
    t.datetime "updated_at", null: false
  end

  create_table "guests", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "handles", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "handle"
    t.boolean "primary", default: false, null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.boolean "verified", default: false, null: false
    t.index %w[user_id verified primary],
            name: "index_handles_on_user_id_and_verified_and_primary"
    t.index ["user_id"], name: "index_handles_on_user_id"
  end

  create_table "job_contexts", force: :cascade do |t|
    t.string "active_job_id", null: false
    t.jsonb "context"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active_job_id"], name: "index_job_contexts_on_active_job_id"
    t.index ["context"], name: "index_job_contexts_on_context", using: :gin
  end

  create_table "logs", force: :cascade do |t|
    t.jsonb "context"
    t.datetime "created_at", null: false
    t.text "message"
    t.datetime "updated_at", null: false
  end

  create_table "messages", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "from_user_id", null: false
    t.bigint "program_id"
    t.boolean "read", default: false, null: false
    t.bigint "repl_program_id"
    t.bigint "to_user_id", null: false
    t.datetime "updated_at", null: false
    t.index ["from_user_id"], name: "index_messages_on_from_user_id"
    t.index ["program_id"], name: "index_messages_on_program_id"
    t.index ["repl_program_id"], name: "index_messages_on_repl_program_id"
    t.index ["to_user_id"], name: "index_messages_on_to_user_id"
  end

  create_table "names", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "family_name"
    t.string "given_name"
    t.boolean "primary", default: false, null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.boolean "verified", default: false, null: false
    t.index %w[user_id verified primary],
            name: "index_names_on_user_id_and_verified_and_primary"
    t.index ["user_id"], name: "index_names_on_user_id"
  end

  create_table "passwords", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "hint", default: "", null: false
    t.string "password_digest"
    t.boolean "primary", default: false, null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.boolean "verified", default: false, null: false
    t.index %w[user_id verified primary],
            name: "index_passwords_on_user_id_and_verified_and_primary"
    t.index ["user_id"], name: "index_passwords_on_user_id"
  end

  create_table "phone_numbers", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "phone_number", null: false
    t.boolean "primary", default: false, null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.boolean "verified", default: false, null: false
    t.index %w[user_id verified primary],
            name: "index_phone_numbers_on_user_id_and_verified_and_primary"
    t.index ["user_id"], name: "index_phone_numbers_on_user_id"
  end

  create_table "program_executions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "error"
    t.text "error_backtrace"
    t.text "error_class"
    t.text "error_message"
    t.text "input"
    t.text "output"
    t.bigint "program_id", null: false
    t.text "result"
    t.string "status", default: "initialized"
    t.datetime "updated_at", null: false
    t.index ["program_id"], name: "index_program_executions_on_program_id"
  end

  create_table "program_prompt_schedules", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "interval"
    t.bigint "program_prompt_id", null: false
    t.datetime "starts_at"
    t.datetime "updated_at", null: false
    t.index ["program_prompt_id"],
            name: "index_program_prompt_schedules_on_program_prompt_id"
  end

  create_table "program_prompts", force: :cascade do |t|
    t.text "backtrace"
    t.datetime "created_at", null: false
    t.text "error_backtrace"
    t.text "error_class"
    t.text "error_message"
    t.text "input"
    t.text "name"
    t.jsonb "output"
    t.bigint "program_id"
    t.string "status", default: "initialized"
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["program_id"], name: "index_program_prompts_on_program_id"
    t.index ["user_id"], name: "index_program_prompts_on_user_id"
  end

  create_table "program_schedules", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "interval"
    t.bigint "program_id", null: false
    t.datetime "starts_at"
    t.datetime "updated_at", null: false
    t.index ["program_id"], name: "index_program_schedules_on_program_id"
  end

  create_table "programs", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "input"
    t.string "name"
    t.boolean "scheduled", default: false, null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["user_id"], name: "index_programs_on_user_id"
  end

  create_table "repl_executions", force: :cascade do |t|
    t.text "context"
    t.datetime "created_at", null: false
    t.text "error"
    t.text "error_backtrace"
    t.text "error_class"
    t.text "error_message"
    t.text "input"
    t.text "output"
    t.bigint "repl_program_id", null: false
    t.text "result"
    t.string "status", default: "initialized"
    t.datetime "updated_at", null: false
    t.index ["repl_program_id"],
            name: "index_repl_executions_on_repl_program_id"
  end

  create_table "repl_programs", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "input"
    t.bigint "repl_session_id", null: false
    t.datetime "updated_at", null: false
    t.index ["repl_session_id"], name: "index_repl_programs_on_repl_session_id"
  end

  create_table "repl_prompts", force: :cascade do |t|
    t.text "backtrace"
    t.datetime "created_at", null: false
    t.text "error_backtrace"
    t.text "error_class"
    t.text "error_message"
    t.text "input"
    t.jsonb "output"
    t.bigint "repl_program_id"
    t.bigint "repl_session_id"
    t.string "status", default: "initialized"
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["repl_program_id"], name: "index_repl_prompts_on_repl_program_id"
    t.index ["repl_session_id"], name: "index_repl_prompts_on_repl_session_id"
    t.index ["user_id"], name: "index_repl_prompts_on_user_id"
  end

  create_table "repl_sessions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_repl_sessions_on_user_id"
  end

  create_table "rpush_apps", force: :cascade do |t|
    t.string "access_token"
    t.datetime "access_token_expiration"
    t.text "apn_key"
    t.string "apn_key_id"
    t.string "auth_key"
    t.string "bundle_id"
    t.text "certificate"
    t.string "client_id"
    t.string "client_secret"
    t.integer "connections", default: 1, null: false
    t.datetime "created_at", null: false
    t.string "environment"
    t.boolean "feedback_enabled", default: true
    t.string "firebase_project_id"
    t.text "json_key"
    t.string "name", null: false
    t.string "password"
    t.string "team_id"
    t.string "type", null: false
    t.datetime "updated_at", null: false
  end

  create_table "rpush_feedback", force: :cascade do |t|
    t.integer "app_id"
    t.datetime "created_at", null: false
    t.string "device_token"
    t.datetime "failed_at", precision: nil, null: false
    t.datetime "updated_at", null: false
    t.index ["device_token"], name: "index_rpush_feedback_on_device_token"
  end

  create_table "rpush_notifications", force: :cascade do |t|
    t.text "alert"
    t.boolean "alert_is_json", default: false, null: false
    t.integer "app_id", null: false
    t.integer "badge"
    t.string "category"
    t.string "collapse_key"
    t.boolean "content_available", default: false, null: false
    t.datetime "created_at", null: false
    t.text "data"
    t.boolean "delay_while_idle", default: false, null: false
    t.datetime "deliver_after", precision: nil
    t.boolean "delivered", default: false, null: false
    t.datetime "delivered_at", precision: nil
    t.string "device_token"
    t.boolean "dry_run", default: false, null: false
    t.integer "error_code"
    t.text "error_description"
    t.integer "expiry", default: 86_400
    t.string "external_device_id"
    t.datetime "fail_after", precision: nil
    t.boolean "failed", default: false, null: false
    t.datetime "failed_at", precision: nil
    t.boolean "mutable_content", default: false, null: false
    t.text "notification"
    t.integer "priority"
    t.boolean "processing", default: false, null: false
    t.text "registration_ids"
    t.integer "retries", default: 0
    t.string "sound"
    t.boolean "sound_is_json", default: false
    t.string "thread_id"
    t.string "type", null: false
    t.datetime "updated_at", null: false
    t.string "uri"
    t.text "url_args"
    t.index %w[delivered failed processing deliver_after created_at],
            name: "index_rpush_notifications_multi",
            where: "((NOT delivered) AND (NOT failed))"
  end

  create_table "solid_cable_messages", force: :cascade do |t|
    t.binary "channel", null: false
    t.bigint "channel_hash"
    t.datetime "created_at", null: false
    t.binary "payload", null: false
    t.index ["channel"], name: "index_solid_cable_messages_on_channel"
    t.index ["channel_hash"], name: "index_solid_cable_messages_on_channel_hash"
    t.index %w[created_at id],
            name: "index_solid_cable_messages_on_created_at_and_id"
    t.index ["created_at"], name: "index_solid_cable_messages_on_created_at"
  end

  create_table "solid_cache_entries", force: :cascade do |t|
    t.integer "byte_size", null: false
    t.datetime "created_at", null: false
    t.binary "key", null: false
    t.bigint "key_hash", null: false
    t.binary "value", null: false
    t.index ["byte_size"], name: "index_solid_cache_entries_on_byte_size"
    t.index %w[key_hash byte_size],
            name: "index_solid_cache_entries_on_key_hash_and_byte_size"
    t.index ["key_hash"],
            name: "index_solid_cache_entries_on_key_hash",
            unique: true
  end

  create_table "solid_errors", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "exception_class", null: false
    t.string "fingerprint", limit: 64, null: false
    t.text "message", null: false
    t.datetime "resolved_at"
    t.text "severity", null: false
    t.text "source"
    t.datetime "updated_at", null: false
    t.index ["fingerprint"],
            name: "index_solid_errors_on_fingerprint",
            unique: true
    t.index ["resolved_at"], name: "index_solid_errors_on_resolved_at"
  end

  create_table "solid_errors_occurrences", force: :cascade do |t|
    t.text "backtrace"
    t.json "context"
    t.datetime "created_at", null: false
    t.bigint "error_id", null: false
    t.datetime "updated_at", null: false
    t.index ["error_id"], name: "index_solid_errors_occurrences_on_error_id"
  end

  create_table "solid_queue_blocked_executions", force: :cascade do |t|
    t.string "concurrency_key", null: false
    t.datetime "created_at", null: false
    t.datetime "expires_at", null: false
    t.bigint "job_id", null: false
    t.integer "priority", default: 0, null: false
    t.string "queue_name", null: false
    t.datetime "updated_at"
    t.index %w[concurrency_key priority job_id],
            name: "index_solid_queue_blocked_executions_for_release"
    t.index %w[expires_at concurrency_key],
            name: "index_solid_queue_blocked_executions_for_maintenance"
    t.index ["job_id"],
            name: "index_solid_queue_blocked_executions_on_job_id",
            unique: true
  end

  create_table "solid_queue_claimed_executions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "job_id", null: false
    t.bigint "process_id"
    t.datetime "updated_at"
    t.index ["job_id"],
            name: "index_solid_queue_claimed_executions_on_job_id",
            unique: true
    t.index %w[process_id job_id],
            name:
              "index_solid_queue_claimed_executions_on_process_id_and_job_id"
  end

  create_table "solid_queue_failed_executions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "error"
    t.bigint "job_id", null: false
    t.datetime "updated_at"
    t.index ["job_id"],
            name: "index_solid_queue_failed_executions_on_job_id",
            unique: true
  end

  create_table "solid_queue_jobs", force: :cascade do |t|
    t.string "active_job_id"
    t.text "arguments"
    t.string "class_name", null: false
    t.string "concurrency_key"
    t.datetime "created_at", null: false
    t.datetime "finished_at"
    t.integer "priority", default: 0, null: false
    t.string "queue_name", null: false
    t.datetime "scheduled_at"
    t.datetime "updated_at", null: false
    t.index ["active_job_id"], name: "index_solid_queue_jobs_on_active_job_id"
    t.index ["class_name"], name: "index_solid_queue_jobs_on_class_name"
    t.index ["finished_at"], name: "index_solid_queue_jobs_on_finished_at"
    t.index %w[queue_name finished_at],
            name: "index_solid_queue_jobs_for_filtering"
    t.index %w[scheduled_at finished_at],
            name: "index_solid_queue_jobs_for_alerting"
  end

  create_table "solid_queue_pauses", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "queue_name", null: false
    t.datetime "updated_at"
    t.index ["queue_name"],
            name: "index_solid_queue_pauses_on_queue_name",
            unique: true
  end

  create_table "solid_queue_processes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "hostname"
    t.string "kind", null: false
    t.datetime "last_heartbeat_at", null: false
    t.text "metadata"
    t.string "name", null: false
    t.integer "pid", null: false
    t.bigint "supervisor_id"
    t.datetime "updated_at"
    t.index ["last_heartbeat_at"],
            name: "index_solid_queue_processes_on_last_heartbeat_at"
    t.index %w[name supervisor_id],
            name: "index_solid_queue_processes_on_name_and_supervisor_id",
            unique: true
    t.index ["supervisor_id"],
            name: "index_solid_queue_processes_on_supervisor_id"
  end

  create_table "solid_queue_ready_executions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "job_id", null: false
    t.integer "priority", default: 0, null: false
    t.string "queue_name", null: false
    t.datetime "updated_at"
    t.index ["job_id"],
            name: "index_solid_queue_ready_executions_on_job_id",
            unique: true
    t.index %w[priority job_id], name: "index_solid_queue_poll_all"
    t.index %w[queue_name priority job_id],
            name: "index_solid_queue_poll_by_queue"
  end

  create_table "solid_queue_recurring_executions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "job_id", null: false
    t.datetime "run_at", null: false
    t.string "task_key", null: false
    t.datetime "updated_at"
    t.index ["job_id"],
            name: "index_solid_queue_recurring_executions_on_job_id",
            unique: true
    t.index %w[task_key run_at],
            name:
              "index_solid_queue_recurring_executions_on_task_key_and_run_at",
            unique: true
  end

  create_table "solid_queue_recurring_tasks", force: :cascade do |t|
    t.text "arguments"
    t.string "class_name"
    t.string "command", limit: 2048
    t.datetime "created_at", null: false
    t.text "description"
    t.string "key", null: false
    t.integer "priority", default: 0
    t.string "queue_name"
    t.string "schedule", null: false
    t.boolean "static", default: true, null: false
    t.datetime "updated_at", null: false
    t.index ["key"],
            name: "index_solid_queue_recurring_tasks_on_key",
            unique: true
    t.index ["static"], name: "index_solid_queue_recurring_tasks_on_static"
  end

  create_table "solid_queue_scheduled_executions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "job_id", null: false
    t.integer "priority", default: 0, null: false
    t.string "queue_name", null: false
    t.datetime "scheduled_at", null: false
    t.datetime "updated_at"
    t.index ["job_id"],
            name: "index_solid_queue_scheduled_executions_on_job_id",
            unique: true
    t.index %w[scheduled_at priority job_id],
            name: "index_solid_queue_dispatch_all"
  end

  create_table "solid_queue_semaphores", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "expires_at", null: false
    t.string "key", null: false
    t.datetime "updated_at", null: false
    t.integer "value", default: 1, null: false
    t.index ["expires_at"], name: "index_solid_queue_semaphores_on_expires_at"
    t.index %w[key value], name: "index_solid_queue_semaphores_on_key_and_value"
    t.index ["key"], name: "index_solid_queue_semaphores_on_key", unique: true
  end

  create_table "time_zones", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.boolean "primary", default: false, null: false
    t.string "time_zone"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.boolean "verified", default: false, null: false
    t.index %w[user_id verified primary],
            name: "index_time_zones_on_user_id_and_verified_and_primary"
    t.index ["user_id"], name: "index_time_zones_on_user_id"
  end

  create_table "tokens", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.boolean "primary", default: false, null: false
    t.string "token", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.boolean "verified", default: false, null: false
    t.index %w[user_id verified primary],
            name: "index_tokens_on_user_id_and_verified_and_primary"
    t.index ["user_id"], name: "index_tokens_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.boolean "admin", default: false, null: false
    t.datetime "created_at", null: false
    t.text "description"
    t.string "locale"
    t.datetime "updated_at", null: false
    t.boolean "verified", default: false, null: false
    t.index ["description"], name: "index_users_on_description"
  end

  create_table "versions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "event", null: false
    t.bigint "item_id", null: false
    t.string "item_type", null: false
    t.jsonb "object"
    t.jsonb "object_changes"
    t.datetime "updated_at", null: false
    t.bigint "whodunnit"
    t.index ["event"], name: "index_versions_on_event"
    t.index ["item_id"], name: "index_versions_on_item_id"
    t.index %w[item_type item_id], name: "index_versions_on_item"
    t.index ["item_type"], name: "index_versions_on_item_type"
    t.index ["whodunnit"], name: "index_versions_on_whodunnit"
  end

  add_foreign_key "active_storage_attachments",
                  "active_storage_blobs",
                  column: "blob_id"
  add_foreign_key "active_storage_variant_records",
                  "active_storage_blobs",
                  column: "blob_id"
  add_foreign_key "attachments", "users"
  add_foreign_key "data", "users"
  add_foreign_key "devices", "users"
  add_foreign_key "email_addresses", "users"
  add_foreign_key "example_schedules", "examples"
  add_foreign_key "handles", "users"
  add_foreign_key "messages", "users", column: "from_user_id"
  add_foreign_key "messages", "users", column: "to_user_id"
  add_foreign_key "names", "users"
  add_foreign_key "passwords", "users"
  add_foreign_key "phone_numbers", "users"
  add_foreign_key "program_executions", "programs"
  add_foreign_key "program_prompt_schedules", "program_prompts"
  add_foreign_key "program_prompts", "users"
  add_foreign_key "programs", "users"
  add_foreign_key "repl_executions", "repl_programs"
  add_foreign_key "repl_programs", "repl_sessions"
  add_foreign_key "repl_prompts", "repl_sessions"
  add_foreign_key "repl_sessions", "users"
  add_foreign_key "solid_errors_occurrences", "solid_errors", column: "error_id"
  add_foreign_key "solid_queue_blocked_executions",
                  "solid_queue_jobs",
                  column: "job_id",
                  on_delete: :cascade
  add_foreign_key "solid_queue_claimed_executions",
                  "solid_queue_jobs",
                  column: "job_id",
                  on_delete: :cascade
  add_foreign_key "solid_queue_failed_executions",
                  "solid_queue_jobs",
                  column: "job_id",
                  on_delete: :cascade
  add_foreign_key "solid_queue_ready_executions",
                  "solid_queue_jobs",
                  column: "job_id",
                  on_delete: :cascade
  add_foreign_key "solid_queue_recurring_executions",
                  "solid_queue_jobs",
                  column: "job_id",
                  on_delete: :cascade
  add_foreign_key "solid_queue_scheduled_executions",
                  "solid_queue_jobs",
                  column: "job_id",
                  on_delete: :cascade
  add_foreign_key "time_zones", "users"
  add_foreign_key "tokens", "users"
end
