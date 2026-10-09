# frozen_string_literal: true

namespace :mcp do
  desc "Regenerate the explicit MCP endpoint catalog from application routes"
  task catalog: :environment do
    endpoints = McpApi::Catalog.generate
    Rails
      .root
      .join("config/mcp_endpoints.json")
      .write("#{JSON.pretty_generate(endpoints)}\n")
  end
end
