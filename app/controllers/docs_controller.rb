class DocsController < ApplicationController
  before_action { authorize :doc }
  skip_after_action :verify_policy_scoped

  def index
    @docs = yaml
  end

  def show
    if params[:doc_id].present?
      @class = yaml.detect { |parent| parent["name"] == params[:doc_id] }

      if @class && params[:doc_type] == "instance_functions"
        functions = @class["instance_functions"] || []
      elsif @class && params[:doc_type] == "class_functions"
        functions = @class["class_functions"] || []
      else
        return render :not_found
      end

      @doc = functions&.detect { |function| function["name"] == params[:id] }

      return render :not_found unless @doc
    else
      @doc = yaml.detect { |parent| parent["name"] == params[:id] }

      return render :not_found unless @doc
    end
  end

  private

  def yaml
    YAML.safe_load_file(Rails.root.join("config/documentation.yml"))
  end
end
