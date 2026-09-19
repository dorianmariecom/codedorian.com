# frozen_string_literal: true

class Code
  class Object
    class ProgramExecution < Dictionary
      def record!
        Pundit.policy_scope!(::Current.user, ::ProgramExecution).find(
          code_get("id").to_s
        )
      end

      def initialize(*, **)
        super
        return if code_get("id").to_s.blank?

        super(record!.attributes, *, **)
      end

      def self.call(**args)
        case args.fetch(:operator, nil).to_code.to_s
        when "all"
          sig(args)
          code_all
        when "where"
          sig(args) { Dictionary }
          code_where(args.fetch(:arguments, []).to_code.code_first)
        when "find"
          sig(args) { String | Integer }
          code_find(args.fetch(:arguments, []).to_code.code_first)
        when "find!"
          sig(args) { String | Integer }
          code_find!(args.fetch(:arguments, []).to_code.code_first)
        else
          super
        end
      end

      def self.code_all
        Pundit.policy_scope!(::Current.user, ::ProgramExecution).to_code
      end

      def self.code_where(value)
        attributes = value.to_code.as_json
        unless (attributes.keys - ::ProgramExecution.column_names).empty?
          raise ::Code::Error, "invalid_record_attributes"
        end

        Pundit
          .policy_scope!(::Current.user, ::ProgramExecution)
          .where(attributes)
          .to_code
      end

      def self.code_find(value)
        id = value.to_code.to_s
        Pundit
          .policy_scope!(::Current.user, ::ProgramExecution)
          .find_by(id: id)
          .to_code
      end

      def self.code_find!(value)
        id = value.to_code.to_s
        Pundit
          .policy_scope!(::Current.user, ::ProgramExecution)
          .find(id)
          .to_code
      end

      def call(**args)
        operator = args.fetch(:operator, nil).to_code.to_s

        case operator
        when "versions"
          sig(args)
          code_versions
        when "program"
          sig(args)
          code_program
        when "user"
          sig(args)
          code_user
        else
          super
        end
      end

      def code_versions
        Pundit
          .policy_scope!(::Current.user, ::Version)
          .where(id: record!.versions.select(:id))
          .to_code
      end

      def id = code_get("id").to_s.to_i
      def program_execution! = policy_scope(::ProgramExecution).find(id)

      def code_program
        policy_scope(::Program).find(program_execution!.program.id).to_code
      end

      def code_user
        policy_scope(::User).find(program_execution!.user.id).to_code
      end

      include(::Pundit::Authorization)

      def current_user = ::Current.user
    end
  end
end
