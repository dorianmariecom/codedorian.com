# frozen_string_literal: true

class Code
  class Object
    class Meetup < Object
      class Event < Object
        attr_reader :raw, :id, :title, :time, :group

        def initialize(id:, title:, time:, group:)
          @raw = Dictionary.new(id:, title:, time:, group:)
          @id = id
          @title = title
          @time = time
          @group = group
        end

        def self.name
          "Meetup::Group::Event"
        end

        def call(**args)
          operator = args.fetch(:operator, nil)

          case operator.to_s
          when "id"
            sig(args)
            code_id
          when "title"
            sig(args)
            code_title
          when "time"
            sig(args)
            code_time
          when "group"
            sig(args)
            code_group
          else
            super
          end
        end

        def code_id
          Integer.new(id)
        end

        def code_time
          Time.new(time)
        end

        def code_title
          String.new(code_title)
        end

        def group
          Group.new(code_group)
        end

        def to_s
          raw.to_s
        end

        def inspect
          raw.inspect
        end
      end
    end
  end
end