# frozen_string_literal: true

module TabsHelper
  def ios_tabs
    tabs(device: :ios)
  end

  def android_tabs
    tabs(device: :android)
  end

  def tabs(device: :ios)
    ios = device == :ios

    [
      {
        title: t("helpers.application.tabs.home"),
        image: ios ? "house.fill" : :home,
        path: root_path,
        default: true
      },
      {
        title: t("helpers.application.tabs.programs"),
        image: ios ? "laptopcomputer" : :computer,
        path: polymorphic_path([current_user_or_guest, :programs]),
        default: false
      },
      (
        unless admin?
          {
            title: t("helpers.application.tabs.examples"),
            image: ios ? :document : :code,
            path: examples_path
          }
        end
      ),
      (
        if registered?
          {
            title: t("helpers.application.tabs.messages"),
            image: ios ? "message.fill" : :chat,
            path: polymorphic_path([current_user, :messages]),
            default: false
          }
        end
      ),
      (
        if registered?
          {
            title: t("helpers.application.tabs.account"),
            image: ios ? "person.crop.circle.fill" : :account_circle,
            path: polymorphic_path(current_user),
            default: false
          }
        end
      ),
      (
        if guest?
          {
            title: t("helpers.application.tabs.register"),
            image: ios ? "person.badge.plus" : :person_add,
            path: new_user_path,
            default: false
          }
        end
      ),
      (
        if guest?
          {
            title: t("helpers.application.tabs.log_in"),
            image: ios ? "person.crop.circle.fill" : :login,
            path: new_session_path,
            default: false
          }
        end
      ),
      (
        if admin?
          {
            title: t("helpers.application.tabs.admin"),
            image: ios ? :suitcase : :work,
            path: admin_path,
            default: false
          }
        end
      )
    ].compact
  end
end
