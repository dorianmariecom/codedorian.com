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
        unless registered?
          {
            title: t("helpers.application.menu.register"),
            image: ios ? "person.badge.plus" : :person_add,
            path: new_user_path
          }
        end
      ),
      (
        unless registered?
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
        title: t("helpers.application.menu.messages"),
        image: ios ? "message.fill" : :chat,
        path: polymorphic_path([current_user_or_guest, :messages])
      },
      {
        title: t("helpers.application.menu.repl"),
        image: ios ? "apple.terminal" : :terminal,
        path: polymorphic_path([current_user_or_guest, :repl_sessions])
      },
      {
        title: t("helpers.application.menu.source"),
        image: ios ? "chevron.left.forwardslash.chevron.right" : :code,
        path: source_path
      },
      {
        title: t("helpers.application.menu.about"),
        image: :info,
        path: about_path
      },
      {
        title: t("helpers.application.menu.privacy"),
        image: :lock,
        path: privacy_path
      },
      {
        title: t("helpers.application.menu.terms"),
        image: ios ? :newspaper : :contract,
        path: terms_path
      },
      {
        title: t("helpers.application.menu.up"),
        image: ios ? "arrow.up" : :arrow_upward,
        path: up_path
      },
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
      ),
      (
        if admin?
          {
            title: t("helpers.application.menu.users"),
            image: ios ? "person.3" : :groups,
            path: users_path
          }
        end
      ),
      (
        if admin?
          {
            title: t("helpers.application.menu.programs"),
            image: ios ? "laptopcomputer" : :computer,
            path: programs_path
          }
        end
      ),
      (
        if admin?
          {
            title: t("helpers.application.menu.messages"),
            image: ios ? "message.fill" : :chat,
            path: messages_path
          }
        end
      ),
      (
        if admin?
          {
            title: t("helpers.application.menu.repl"),
            image: ios ? "apple.terminal" : :terminal,
            path: repl_sessions_path
          }
        end
      ),
      (
        if admin?
          {
            title: t("helpers.application.menu.errors"),
            image: ios ? "exclamationmark.warninglight" : :priority_high,
            path: errors_path
          }
        end
      ),
      (
        if admin?
          {
            title: t("helpers.application.menu.jobs"),
            image: ios ? :suitcase : :work,
            path: jobs_path
          }
        end
      )
    ].compact
  end
end
