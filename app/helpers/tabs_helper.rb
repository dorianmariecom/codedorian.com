# frozen_string_literal: true

module TabsHelper
  def ios_tabs
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

  def android_tabs
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
end
