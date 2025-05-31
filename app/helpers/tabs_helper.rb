# frozen_string_literal: true

module TabsHelper
  def ios_tabs
    version < "2.0" ? ios_tabs_v1 : ios_tabs_v2
  end

  def android_tabs
    version < "2.0" ? android_tabs_v1 : android_tabs_v2
  end

  def ios_tabs_v1
    if current_user?
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
          path: polymorphic_path([current_user, :programs]),
          default: false
        },
        {
          title: t("helpers.application.tabs.messages"),
          image: "message.fill",
          path: polymorphic_path([current_user, :messages]),
          default: false
        },
        {
          title: t("helpers.application.tabs.account"),
          image: "person.crop.circle.fill",
          path: polymorphic_path(current_user),
          default: false
        },
        {
          title: t("helpers.application.tabs.more"),
          image: "ellipsis",
          path: more_path,
          default: false
        }
      ]
    else
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
          path: polymorphic_path([current_guest, :programs]),
          default: false
        },
        {
          title: t("helpers.application.tabs.messages"),
          image: "message.fill",
          path: polymorphic_path([current_guest, :messages]),
          default: false
        },
        {
          title: t("helpers.application.tabs.account"),
          image: "person.crop.circle.fill",
          path: polymorphic_path(current_guest),
          default: false
        },
        {
          title: t("helpers.application.tabs.more"),
          image: "ellipsis",
          path: more_path,
          default: false
        }
      ]
    end
  end

  def android_tabs_v1
    if current_user?
      [
        {
          title: t("helpers.application.tabs.home"),
          image: :home,
          path: root_path,
          default: true
        },
        {
          title: t("helpers.application.tabs.programs"),
          image: :computer,
          path: polymorphic_path([current_user, :programs]),
          default: false
        },
        {
          title: t("helpers.application.tabs.messages"),
          image: :chat,
          path: polymorphic_path([current_user, :messages]),
          default: false
        },
        {
          title: t("helpers.application.tabs.account"),
          image: :account_circle,
          path: polymorphic_path(current_user),
          default: false
        },
        {
          title: t("helpers.application.tabs.more"),
          image: :more_horiz,
          path: more_path,
          default: false
        }
      ]
    else
      [
        {
          title: t("helpers.application.tabs.home"),
          image: :home,
          path: root_path,
          default: true
        },
        {
          title: t("helpers.application.tabs.programs"),
          image: :computer,
          path: polymorphic_path([current_guest, :programs]),
          default: false
        },
        {
          title: t("helpers.application.tabs.messages"),
          image: :chat,
          path: polymorphic_path([current_guest, :messages]),
          default: false
        },
        {
          title: t("helpers.application.tabs.account"),
          image: :account_circle,
          path: polymorphic_path(current_guest),
          default: false
        },
        {
          title: t("helpers.application.tabs.more"),
          image: :more_horiz,
          path: more_path,
          default: false
        }
      ]
    end
  end

  def ios_tabs_v2
    if current_user?
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
          path: polymorphic_path([current_user, :programs]),
          default: false
        },
        {
          title: t("helpers.application.tabs.messages"),
          image: "message.fill",
          path: polymorphic_path([current_user, :messages]),
          default: false
        },
        {
          title: t("helpers.application.tabs.repl"),
          image: "apple.terminal",
          path: polymorphic_path([current_user, :repl_sessions]),
          default: false
        },
        {
          title: t("helpers.application.tabs.account"),
          image: "person.crop.circle.fill",
          path: polymorphic_path(current_user),
          default: false
        }
      ]
    else
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
          path: polymorphic_path([current_guest, :programs]),
          default: false
        },
        {
          title: t("helpers.application.tabs.register"),
          image: "person.badge.plus",
          path: new_user_path,
          default: false
        },
        {
          title: t("helpers.application.tabs.log_in"),
          image: "person.crop.circle.fill",
          path: new_session_path,
          default: false
        }
      ]
    end
  end

  def android_tabs_v2
    if current_user?
      [
        {
          title: t("helpers.application.tabs.home"),
          image: :home,
          path: root_path,
          default: true
        },
        {
          title: t("helpers.application.tabs.programs"),
          image: :computer,
          path: polymorphic_path([current_user, :programs]),
          default: false
        },
        {
          title: t("helpers.application.tabs.messages"),
          image: :chat,
          path: polymorphic_path([current_user, :messages]),
          default: false
        },
        {
          title: t("helpers.application.tabs.repl"),
          image: :terminal,
          path: polymorphic_path([current_user, :repl_sessions]),
          default: false
        },
        {
          title: t("helpers.application.tabs.account"),
          image: :account_circle,
          path: polymorphic_path(current_user),
          default: false
        }
      ]
    else
      [
        {
          title: t("helpers.application.tabs.home"),
          image: :home,
          path: root_path,
          default: true
        },
        {
          title: t("helpers.application.tabs.programs"),
          image: :computer,
          path: polymorphic_path([current_guest, :programs]),
          default: false
        },
        {
          title: t("helpers.application.tabs.messages"),
          image: :chat,
          path: polymorphic_path([current_guest, :messages]),
          default: false
        },
        {
          title: t("helpers.application.tabs.register"),
          image: :person_add,
          path: new_user_path,
          default: false
        },
        {
          title: t("helpers.application.tabs.log_in"),
          image: :login,
          path: new_session_path,
          default: false
        }
      ]
    end
  end
end
