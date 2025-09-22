# frozen_string_literal: true

module TabsHelper
  def ios_tabs
    [
      {
        title: t("helpers.application.tabs.home"),
        image: "house.fill",
        path: root_path,
        default: true
      },
      {
        title: t("helpers.application.tabs.programs"),
        image: "laptopcomputer",
        path: polymorphic_path([current_user_or_guest, :programs]),
        default: false
      },
      (
        if registered?
          {
            title: t("helpers.application.tabs.messages"),
            image: "message.fill",
            path: polymorphic_path([current_user, :messages]),
            default: false
          },
        end
      ),
      (
        if registered?
          {
            title: t("helpers.application.tabs.repl"),
            image: "apple.terminal",
            path: polymorphic_path([current_user, :repl_sessions]),
            default: false
          },
        end
      ),
      (
        if registered?
          {
            title: t("helpers.application.tabs.account"),
            image: "person.crop.circle.fill",
            path: polymorphic_path(current_user),
            default: false
          }
        end
      ),
      (
        if guest?
          {
            title: t("helpers.application.tabs.register"),
            image: "person.badge.plus",
            path: new_user_path,
            default: false
          },
        end
      ),
      (
        if guest?
          {
            title: t("helpers.application.tabs.log_in"),
            image: "person.crop.circle.fill",
            path: new_session_path,
            default: false
          }
        end
      )
    ].compact
  end
end
