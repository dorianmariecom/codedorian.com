# frozen_string_literal: true

class ApplicationPolicy
  class Scope
    include(Pundit::Authorization)
    include(CanConcern)

    attr_reader :current_user, :current_guest, :scope

    def initialize(current_user, scope)
      @current_user = current_user
      @current_guest = Current.guest
      @scope = scope
    end

    def resolve
      raise(NotImplementedError, "#{self.class}#resolve")
    end

    private

    def admin?
      current_user? && current_user.admin?
    end

    def current_user?
      !!current_user
    end

    def current_guest?
      !!current_guest
    end

    def scope?
      !!scope
    end
  end

  include(Pundit::Authorization)
  include(CanConcern)

  attr_reader :current_user, :current_guest, :record

  def initialize(current_user, record)
    @current_user = current_user
    @current_guest = Current.guest
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
    raise(NotImplementedError, "#{self.class}#destroy?")
  end

  private

  def admin?
    current_user? && current_user.admin?
  end

  def current_user?
    !!current_user
  end

  def current_guest?
    !!current_guest
  end

  def record?
    !!record
  end

  def user
    record? && record.respond_to?(:user) && record.user
  end

  def user?
    !!user
  end

  def owner?
    user? && current_user? && user == current_user
  end
end
