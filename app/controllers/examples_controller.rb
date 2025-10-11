# frozen_string_literal: true

class ExamplesController < ApplicationController
  before_action { authorize(:example) }
  before_action(:load_examples)
  before_action { add_breadcrumb(key: "examples.index", path: :examples) }
  skip_after_action(:verify_policy_scoped)

  def index
  end

  def show
    @example =
      @examples.detect { |example| example["name"].parameterize == params[:id] }

    @exmaple ? add_breadcrumb(text: @example["name"]) : render(:not_found)
  end

  private

  def load_examples
    @examples = JSON.parse(Rails.root.join("config/examples.json").read)
  end
end
