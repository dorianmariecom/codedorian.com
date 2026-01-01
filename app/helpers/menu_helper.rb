# frozen_string_literal: true

module MenuHelper
  def ios_menu
    menu(platform: :ios)
  end

  def android_menu
    menu(platform: :android)
  end

  def menu(platform:)
    ios = platform == :ios

    [
      (
        if registered?
          {
            title: t("helpers.application.menu.account"),
            image: ios ? "person.crop.circle.fill" : :account_circle,
            path: polymorphic_path(current_user)
          }
        end
      ),
      (
        if guest?
          {
            title: t("helpers.application.menu.register"),
            image: ios ? "person.badge.plus" : :person_add,
            path: new_user_path
          }
        end
      ),
      (
        if guest?
          {
            title: t("helpers.application.menu.log_in"),
            image: ios ? "person.crop.circle.fill" : :login,
            path: new_session_path
          }
        end
      ),
      {
        title: t("helpers.application.menu.home"),
        image: ios ? "house.fill" : :home,
        path: root_path
      },
      {
        title: t("helpers.application.menu.programs"),
        image: ios ? "laptopcomputer" : :computer,
        path: polymorphic_path([current_user_or_guest, :programs])
      },
      {
        title: t("helpers.application.menu.examples"),
        image: ios ? :document : :code,
        path: examples_path
      },
      {
        title: t("helpers.application.menu.messages"),
        image: ios ? "message.fill" : :chat,
        path: polymorphic_path([current_user_or_guest, :messages])
      },
      {
        title: t("helpers.application.menu.about"),
        image: :info,
        path: about_path
      },
      (
        if admin?
          {
            title: t("helpers.application.menu.admin"),
            image: ios ? :suitcase : :work,
            path: admin_path
          }
        end
      ),
      (
        if fr?
          {
            title: t("helpers.application.menu.english"),
            image: ios ? :flag : :language_us,
            path: url_for(locale: :en)
          }
        end
      ),
      (
        unless fr?
          {
            title: t("helpers.application.menu.french"),
            image: ios ? :flag : :language_french,
            path: url_for(locale: :fr)
          }
        end
      )
    ].compact
  end
end
