# frozen_string_literal: true

require "erb"
require "set"
require "strscan"

module SyntaxHighlight
  class Formatter
    SUPPORTED_LANGUAGES = %w[code json].freeze

    class << self
      def format(input, language:)
        new(language: language).format(input)
      end
    end

    def initialize(language:)
      @language = language.to_s

      return if SUPPORTED_LANGUAGES.include?(@language)

      raise(ArgumentError, "unsupported language: #{@language.inspect}")
    end

    def format(input)
      scanner =
        case @language
        when "code"
          CodeScanner.new(input.to_s)
        when "json"
          JsonScanner.new(input.to_s)
        end

      scanner.to_html
    end

    class ScannerBase
      def initialize(input)
        @scanner = StringScanner.new(input)
        @tokens = []
      end

      def to_html
        tokenize
        @tokens.map { |token| format_token(token) }.join
      end

      private

      def emit(type, value)
        @tokens << [type, value]
      end

      def text(value)
        emit(nil, value)
      end

      def scan_and_emit(type, *patterns)
        patterns.each do |pattern|
          next unless (value = @scanner.scan(pattern))

          emit(type, value)
          return true
        end

        false
      end

      def format_token(token)
        type, value = token
        escaped = ERB::Util.html_escape(value)
        return escaped unless type

        %(<span class="syntax-#{type}">#{escaped}</span>)
      end
    end

    class CodeScanner < ScannerBase
      KEYWORDS = %w[
        if
        unless
        elsif
        elsunless
        else
        while
        until
        loop
        do
        begin
        end
        rescue
      ].to_set.freeze
      OPERATOR_WORDS = %w[and or not].to_set.freeze
      ATOMS = %w[true false nothing].to_set.freeze

      SYMBOL = /:[^\s,=:{}\[\]().'"|&<>*][^\s,=:{}\[\]().'"|&<>*]*/
      IDENTIFIER = /[A-Za-z_][A-Za-z0-9_]*[!?]?/
      HEX_NUMBER = /0[xX][0-9A-Fa-f](?:_?[0-9A-Fa-f])*/
      OCTAL_NUMBER = /0[oO][0-7](?:_?[0-7])*/
      BINARY_NUMBER = /0[bB][01](?:_?[01])*/
      FLOAT_NUMBER =
        /[0-9](?:_?[0-9])*\.[0-9](?:_?[0-9])*(?:[eE][0-9](?:_?[0-9])*)?/
      INTEGER_NUMBER = /[0-9](?:_?[0-9])*(?:[eE][0-9](?:_?[0-9])*)?/
      OPERATORS =
        %r{(?:\|\|=|&&=|>>=|<<=|\+=|-=|\*=|/=|%=|&=|\|=|\^=|===|==|!=|<=>|=~|~=|!~|>=|<=|>>|<<|\*\*|\.\.\.|\.\.|::|&\.|\|\||&&|[+\-*/%&|^~!<>?:=.×÷])}
      DELIMITERS = /[(){}\[\],]/

      private

      def tokenize
        until @scanner.eos?
          if (value = @scanner.scan(/\s+/))
            text(value)
            next
          end

          next if scan_and_emit("comment", %r{/\*.*?\*/}m, %r{//[^\n]*}, /#[^\n]*/)
          next if scan_and_emit("string", /"(?:\\.|[^"\\])*"/, /'(?:\\.|[^'\\])*'/)
          next if scan_and_emit("number", HEX_NUMBER, OCTAL_NUMBER, BINARY_NUMBER, FLOAT_NUMBER, INTEGER_NUMBER)

          if (value = @scanner.scan(SYMBOL))
            emit("atom", value)
          elsif (value = @scanner.scan(IDENTIFIER))
            emit(identifier_token(value), value)
          elsif (value = @scanner.scan(OPERATORS))
            emit(operator_token(value), value)
          elsif (value = @scanner.scan(DELIMITERS))
            emit(value == "," ? "separator" : "bracket", value)
          else
            text(@scanner.getch)
          end
        end
      end

      def identifier_token(value)
        return "operator" if OPERATOR_WORDS.include?(value)
        return "keyword" if KEYWORDS.include?(value)
        return "atom" if ATOMS.include?(value)
        return "typeName" if value.match?(/\A[A-Z]/)

        "variableName"
      end

      def operator_token(value)
        return "punctuation" if %w[. &. ::].include?(value)

        "operator"
      end
    end

    class JsonScanner < ScannerBase
      NUMBER = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/
      LITERAL = /(?:true|false|null)\b/
      STRING = /"(?:\\.|[^"\\])*"/

      private

      def tokenize
        stack = []

        until @scanner.eos?
          context = stack.last

          if (value = @scanner.scan(/\s+/))
            text(value)
          elsif (value = @scanner.scan(/[{}\[\]]/))
            if value == "{"
              stack << { type: :object, expects_key: true }
            elsif value == "["
              stack << { type: :array }
            else
              stack.pop
            end
            emit("bracket", value)
          elsif (value = @scanner.scan(":"))
            emit("punctuation", value)
          elsif (value = @scanner.scan(","))
            context[:expects_key] = true if context&.dig(:type) == :object
            emit("separator", value)
          elsif (value = @scanner.scan(STRING))
            if context&.dig(:type) == :object && context[:expects_key]
              context[:expects_key] = false
              emit("propertyName", value)
            else
              emit("string", value)
            end
          elsif (value = @scanner.scan(NUMBER))
            emit("number", value)
          elsif (value = @scanner.scan(LITERAL))
            emit("atom", value)
          else
            text(@scanner.getch)
          end
        end
      end
    end
  end
end
