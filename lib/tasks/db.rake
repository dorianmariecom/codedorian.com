# frozen_string_literal: true

namespace :db do
  # Override the default db:drop task to terminate all active connections first
  # This is necessary because Solid Queue and other processes maintain persistent
  # database connections that prevent the database from being dropped.
  task drop: :load_config do
    ActiveRecord::Tasks::DatabaseTasks.for_each(databases) do |database|
      terminate_connections(database)
    end

    # Call the original drop task
    ActiveRecord::Tasks::DatabaseTasks.drop_current
  end

  # Enhances db:drop:_unsafe to also terminate connections
  task "drop:_unsafe" => :load_config do
    ActiveRecord::Tasks::DatabaseTasks.for_each(databases) do |database|
      terminate_connections(database)
    end

    ActiveRecord::Tasks::DatabaseTasks.drop_current
  end

  private

  def databases
    ActiveRecord::Tasks::DatabaseTasks.setup_initial_database_yaml
    ActiveRecord::Base.configurations.configs_for(env_name: Rails.env)
  end

  def terminate_connections(config)
    return unless config.adapter == "postgresql"

    db_name = config.database
    return unless db_name

    # Connect to the default 'postgres' database to terminate connections to the target database
    ActiveRecord::Base.establish_connection(
      adapter: "postgresql",
      database: "postgres"
    )

    # Terminate all connections to the target database except our own
    sql = <<~SQL
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = '#{ActiveRecord::Base.connection.quote_string(db_name)}'
        AND pid <> pg_backend_pid();
    SQL

    begin
      ActiveRecord::Base.connection.execute(sql)
      puts "Terminated active connections to database '#{db_name}'"
    rescue ActiveRecord::StatementInvalid => e
      # Database might not exist yet, which is fine
      puts "Note: Could not terminate connections to '#{db_name}': #{e.message}"
    ensure
      # Re-establish connection to the original database configuration
      ActiveRecord::Base.establish_connection(config.configuration_hash.symbolize_keys)
    end
  end
end