# frozen_string_literal: true

class ExamplesController < ApplicationController
  before_action { authorize(:example) }
  before_action(:load_examples)
  skip_after_action(:verify_policy_scoped)

  def index
  end

  def show
    @example =
      @examples.detect { |example| example["name"].parameterize == params[:id] }

    render(:not_found) if @example.nil?
  end

  private

  def load_examples
    @examples = JSON.parse(Rails.root.join("config/examples.json").read)
  end
end
