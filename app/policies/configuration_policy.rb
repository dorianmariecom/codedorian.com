# frozen_string_literal: true

class ConfigurationPolicy < ApplicationPolicy
  def ios_v2?
    true
  end

  def android_v2?
    true
  end
end
