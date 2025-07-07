# frozen_string_literal: true

module CategoriesHelper
  def ios_categories
    [
      {
        identifier: "DORIAN_TODO",
        actions: [
          {
            identifier: "DORIAN_TODO_DONE",
            title: t("helpers.categories.dorian_todo.done"),
            destructive: false
          },
          {
            identifier: "DORIAN_TODO_SNOOZE",
            title: t("helpers.categories.dorian_todo.snooze"),
            destructive: false
          },
          {
            identifier: "DORIAN_TODO_CANCEL",
            title: t("helpers.categories.dorian_todo.cancel"),
            destructive: true
          }
        ]
      }
    ]
  end

  def android_categories
    []
  end
end
