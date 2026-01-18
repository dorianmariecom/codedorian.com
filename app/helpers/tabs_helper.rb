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
        title: t("helpers.tabs.home"),
        image: ios ? "house.fill" : :home,
        path: root_path,
        default: true
      },
      {
        title: t("helpers.tabs.form"),
        image: ios ? :checklist : :assignment,
        path: form_path,
        default: false
      },
      {
        title: t("helpers.tabs.programs"),
        image: ios ? "laptopcomputer" : :computer,
        path: polymorphic_path([current_user_or_guest, :programs]),
        default: false
      },
      (
        if registered?
          {
            title: t("helpers.tabs.messages"),
            image: ios ? "message.fill" : :chat,
            path: polymorphic_path([current_user, :messages]),
            default: false
          }
        end
      ),
      (
        if registered?
          {
            title: t("helpers.tabs.account"),
            image: ios ? "person.crop.circle.fill" : :account_circle,
            path: polymorphic_path(current_user),
            default: false
          }
        end
      ),
      (
        if guest?
          {
            title: t("helpers.tabs.register"),
            image: ios ? "person.badge.plus" : :person_add,
            path: new_user_path,
            default: false
          }
        end
      ),
      (
        if guest?
          {
            title: t("helpers.tabs.log_in"),
            image: ios ? "person.crop.circle.fill" : :login,
            path: new_login_path,
            default: false
          }
        end
      )
    ].compact
  end
end
