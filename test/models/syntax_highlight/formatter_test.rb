# frozen_string_literal: true

require "test_helper"

module SyntaxHighlight
  class FormatterTest < ActiveSupport::TestCase
    test "formats code input with syntax classes" do
      input = <<~CODE
        if User.active and true
          Message.new("hello") # greet
        end
      CODE

      highlighted = SyntaxHighlight::Formatter.format(input, language: :code)

      assert_includes(highlighted, %(<span class="syntax-keyword">if</span>))
      assert_includes(highlighted, %(<span class="syntax-typeName">User</span>))
      assert_includes(highlighted, %(<span class="syntax-operator">and</span>))
      assert_includes(highlighted, %(<span class="syntax-atom">true</span>))
      assert_includes(
        highlighted,
        %(<span class="syntax-string">&quot;hello&quot;</span>)
      )
      assert_includes(
        highlighted,
        %(<span class="syntax-comment"># greet</span>)
      )
    end

    test "formats json input and distinguishes keys from values" do
      input = <<~JSON
        {
          "name": "dorian",
          "active": true,
          "age": 32,
          "meta": null
        }
      JSON

      highlighted = SyntaxHighlight::Formatter.format(input, language: :json)

      assert_includes(
        highlighted,
        %(<span class="syntax-propertyName">&quot;name&quot;</span>)
      )
      assert_includes(
        highlighted,
        %(<span class="syntax-string">&quot;dorian&quot;</span>)
      )
      assert_includes(highlighted, %(<span class="syntax-atom">true</span>))
      assert_includes(highlighted, %(<span class="syntax-number">32</span>))
      assert_includes(highlighted, %(<span class="syntax-atom">null</span>))
    end

    test "escapes unsafe html inside token text" do
      input = "\"<script>alert(1)</script>\""

      highlighted = SyntaxHighlight::Formatter.format(input, language: :json)

      assert_includes(
        highlighted,
        %(<span class="syntax-string">&quot;&lt;script&gt;alert(1)&lt;/script&gt;&quot;</span>)
      )
    end

    test "raises for unsupported languages" do
      error =
        assert_raises(ArgumentError) do
          SyntaxHighlight::Formatter.format("x", language: :yaml)
        end

      assert_match(/unsupported language/, error.message)
    end
  end
end
