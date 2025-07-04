# frozen_string_literal: true

class DocsController < ApplicationController
  before_action { authorize :doc }
  before_action :load_docs
  before_action :load_examples
  skip_after_action :verify_policy_scoped

  def index
  end

  def show
    if params[:doc_id].present?
      @class = @docs.detect { |parent| parent["name"] == params[:doc_id] }

      if @class && params[:doc_type] == "instance_functions"
        functions = @class["instance_functions"] || []
      elsif @class && params[:doc_type] == "class_functions"
        functions = @class["class_functions"] || []
      else
        return render :not_found
      end

      @doc = functions&.detect { |function| function["name"] == params[:id] }
    else
      @doc = @docs.detect { |parent| parent["name"] == params[:id] }
    end
    render :not_found unless @doc
  end

  private

  def load_docs
    @docs = YAML.safe_load_file(Rails.root.join("config/documentation.yml"))
  end

  def load_examples
    @examples = Rails.root.join("config/examples.md").read
  end
end
