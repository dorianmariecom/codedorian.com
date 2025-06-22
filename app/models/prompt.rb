# frozen_string_literal: true

class Prompt
  PROMPT_1 = <<~PROMPT
    i created a programming language named "code", your goal is to
    generate a json object with the input of the program corresponding
    to the name of the program
  PROMPT

  PROMPT_2 = <<~PROMPT
    here are some examples
  PROMPT

  PROMPT_3 = <<~PROMPT
    here is the documentation
  PROMPT

  PROMPT_4 = <<~PROMPT
    here is the user provided name of the program
  PROMPT

  PROMPT_5 = <<~PROMPT
    reply with just the input in code like the input fields in the documentation
    or the inside of the examples

    you output the program input related to the program name
  PROMPT

  def self.generate(name: nil)
    name = name.to_s.strip

    uri = URI("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions")

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request =
      Net::HTTP::Post.new(
        uri.path,
        {
          "Content-Type" => "application/json",
          "Authorization" => "Bearer #{Config.google.gemini.api_key}"
        }
      )

    request.body = {
      model: "gemini-2.5-pro",
      response_format: {
        type: :json_schema,
        json_schema: {
          name: :input,
          strict: true,
          schema: {
            type: :object,
            properties: {
              input: {
                type: :string
              }
            },
            required: [:input],
            additionalProperties: false
          }
        }
      },
      messages: [
        { role: "system", content: PROMPT_1 },
        { role: "system", content: PROMPT_2 },
        {
          role: "system",
          content: Rails.root.join("config/examples.md").read
        },
        { role: "system", content: PROMPT_3 },
        {
          role: "system",
          content:
            YAML.safe_load_file(
              Rails.root.join("config/documentation.yml")
            ).to_json
        },
        { role: "system", content: PROMPT_4 },
        { role: "user", content: name },
        { role: "system", content: PROMPT_5 }
      ]
    }.to_json

    response = http.request(request)
    json = JSON.parse(response.body)

    { input: JSON.parse(json.dig("choices", 0, "message", "content"))["input"].to_s }
  end
end
