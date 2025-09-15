# frozen_string_literal: true

class ApplicationPolicy
  class Scope
    include(Pundit::Authorization)
    include(CanConcern)

    attr_reader :current_user, :scope

    def initialize(current_user, scope)
      @current_user = current_user
      @scope = scope
    end

    def resolve
      raise NotImplementedError, "#{self.class}#resolve"
    end

    private

    def admin?
      current_user? && current_user.admin?
    end

    def current_user?
      !!current_user
    end

    def scope?
      !!scope
    end
  end

  include(Pundit::Authorization)
  include(CanConcern)

  attr_reader :current_user, :record

  def initialize(current_user, record)
    @current_user = current_user
    @record = record
  end

  def index?
    raise(NotImplementedError, "#{self.class}#index?")
  end

  def show?
    raise(NotImplementedError, "#{self.class}#show?")
  end

  def new?
    create?
  end

  def create?
    raise(NotImplementedError, "#{self.class}#create?")
  end

  def edit?
    update?
  end

  def update?
    raise(NotImplementedError, "#{self.class}#update?")
  end

  def destroy?
    raise NotImplementedError, "#{self.class}#destroy?"
  end

  private

  def admin?
    current_user? && current_user.admin?
  end

  def current_user?
    !!current_user
  end

  def record?
    !!record
  end
end
