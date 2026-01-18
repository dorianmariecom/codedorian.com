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
            title: t("helpers.menu.account"),
            image: ios ? "person.crop.circle.fill" : :account_circle,
            path: polymorphic_path(current_user)
          }
        end
      ),
      (
        if guest?
          {
            title: t("helpers.menu.register"),
            image: ios ? "person.badge.plus" : :person_add,
            path: new_user_path
          }
        end
      ),
      (
        if guest?
          {
            title: t("helpers.menu.log_in"),
            image: ios ? "person.crop.circle.fill" : :login,
            path: new_login_path
          }
        end
      ),
      {
        title: t("helpers.menu.home"),
        image: ios ? "house.fill" : :home,
        path: root_path
      },
      {
        title: t("helpers.menu.book"),
        image: ios ? :video : :video_call,
        path: book_path
      },
      {
        title: t("helpers.menu.form"),
        image: ios ? :checklist : :assignment,
        path: form_path
      },
      {
        title: t("helpers.menu.programs"),
        image: ios ? :laptopcomputer : :computer,
        path: polymorphic_path([current_user_or_guest, :programs])
      },
      {
        title: t("helpers.menu.messages"),
        image: ios ? "message.fill" : :chat,
        path: polymorphic_path([current_user_or_guest, :messages])
      },
      { title: t("helpers.menu.about"), image: :info, path: about_path },
      (
        if admin?
          {
            title: t("helpers.menu.admin"),
            image: ios ? :suitcase : :work,
            path: admin_path
          }
        end
      ),
      (
        if fr?
          {
            title: t("helpers.menu.english"),
            image: ios ? :flag : :language_us,
            path: url_for(locale: :en)
          }
        end
      ),
      (
        unless fr?
          {
            title: t("helpers.menu.french"),
            image: ios ? :flag : :language_french,
            path: url_for(locale: :fr)
          }
        end
      )
    ].compact
  end
end
