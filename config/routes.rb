# frozen_string_literal: true

class AdminConstraints
  def matches?(request)
    User.find_by(id: request.session[:user_id])&.admin?
  end
end

Rails.application.routes.draw do
  define =
    lambda do
      resources :programs do
        collection do
          delete "/destroy_all", to: "programs#destroy_all"
          delete "/delete_all", to: "programs#delete_all"
        end

        post :evaluate
        post :schedule
        post :unschedule

        resources(:executions) do
          collection do
            delete "/destroy_all", to: "executions#destroy_all"
            delete "/delete_all", to: "executions#delete_all"
          end
        end

        resources(:schedules) do
          collection do
            delete "/destroy_all", to: "schedules#destroy_all"
            delete "/delete_all", to: "schedules#delete_all"
          end
        end
      end

      resources :repl_sessions do
        collection do
          delete "/destroy_all", to: "repl_sessions#destroy_all"
          delete "/delete_all", to: "repl_sessions#delete_all"
        end

        post :evaluate

        resources(:repl_programs) do
          collection do
            delete "/destroy_all", to: "repl_programs#destroy_all"
            delete "/delete_all", to: "repl_programs#delete_all"
          end

          resources(:repl_executions) do
            collection do
              delete "/destroy_all", to: "repl_executions#destroy_all"
              delete "/delete_all", to: "repl_executions#delete_all"
            end
          end
        end

        resources(:repl_executions) do
          collection do
            delete "/destroy_all", to: "repl_executions#destroy_all"
            delete "/delete_all", to: "repl_executions#delete_all"
          end
        end
      end

      resources(:repl_programs) do
        collection do
          delete "/destroy_all", to: "repl_programs#destroy_all"
          delete "/delete_all", to: "repl_programs#delete_all"
        end

        resources(:repl_executions) do
          collection do
            delete "/destroy_all", to: "repl_executions#destroy_all"
            delete "/delete_all", to: "repl_executions#delete_all"
          end
        end
      end

      resources(:repl_executions) do
        collection do
          delete "/destroy_all", to: "repl_executions#destroy_all"
          delete "/delete_all", to: "repl_executions#delete_all"
        end
      end

      resources :email_addresses do
        collection do
          delete "/destroy_all", to: "email_addresses#destroy_all"
          delete "/delete_all", to: "email_addresses#delete_all"
        end
      end

      resources :phone_numbers do
        collection do
          delete "/destroy_all", to: "phone_numbers#destroy_all"
          delete "/delete_all", to: "phone_numbers#delete_all"
        end
      end

      resources(:executions) do
        collection do
          delete "/destroy_all", to: "executions#destroy_all"
          delete "/delete_all", to: "executions#delete_all"
        end
      end

      resources(:time_zones) do
        collection do
          delete "/destroy_all", to: "time_zones#destroy_all"
          delete "/delete_all", to: "time_zones#delete_all"
        end
      end

      resources(:locations) do
        collection do
          delete "/destroy_all", to: "locations#destroy_all"
          delete "/delete_all", to: "locations#delete_all"
        end
      end

      resources(:passwords) do
        collection do
          delete "/destroy_all", to: "passwords#destroy_all"
          delete "/delete_all", to: "passwords#delete_all"
        end
      end

      resources(:schedules) do
        collection do
          delete "/destroy_all", to: "schedules#destroy_all"
          delete "/delete_all", to: "schedules#delete_all"
        end
      end

      resources(:devices) do
        collection do
          delete "/destroy_all", to: "devices#destroy_all"
          delete "/delete_all", to: "devices#delete_all"
        end
      end

      resources(:messages) do
        post :read
        post :unread
        get :content
        get :subject
        get :body

        collection do
          delete "/destroy_all", to: "messages#destroy_all"
          delete "/delete_all", to: "messages#delete_all"
        end
      end

      resources(:handles) do
        collection do
          delete "/destroy_all", to: "handles#destroy_all"
          delete "/delete_all", to: "handles#delete_all"
        end
      end

      resources(:addresses) do
        collection do
          delete "/destroy_all", to: "addresses#destroy_all"
          delete "/delete_all", to: "addresses#delete_all"
        end
      end

      resources(:errors) do
        collection do
          delete "/destroy_all", to: "errors#destroy_all"
          delete "/delete_all", to: "errors#delete_all"
        end

        resources(:error_occurrences) do
          collection do
            delete "/destroy_all", to: "error_occurrences#destroy_all"
            delete "/delete_all", to: "error_occurrences#delete_all"
          end
        end
      end

      resources(:error_occurrences) do
        collection do
          delete "/destroy_all", to: "error_occurrences#destroy_all"
          delete "/delete_all", to: "error_occurrences#delete_all"
        end
      end

      resources(:jobs) do
        collection do
          delete "/destroy_all", to: "jobs#destroy_all"
          delete "/delete_all", to: "jobs#delete_all"
          post "/discard_all", to: "jobs#discard_all"
          post "/retry_all", to: "jobs#retry_all"
        end

        delete :delete
        delete :destroy
        post :discard
        post :retry
      end

      resources(:guests) do
        collection do
          delete "/destroy_all", to: "guests#destroy_all"
          delete "/delete_all", to: "guests#delete_all"
        end
      end

      resources(:names) do
        collection do
          delete "/destroy_all", to: "names#destroy_all"
          delete "/delete_all", to: "names#delete_all"
        end
      end

      resources(:tokens) do
        collection do
          delete "/destroy_all", to: "tokens#destroy_all"
          delete "/delete_all", to: "tokens#delete_all"
        end
      end

      resources(:users) do
        collection do
          delete "/destroy_all", to: "users#destroy_all"
          delete "/delete_all", to: "users#delete_all"
        end
      end
    end

  default_url_options(host: ENV.fetch("BASE_URL"))

  scope "(:locale)", locale: /en|fr|/ do
    resources(:guests) do
      define.call

      collection do
        delete "/destroy_all", to: "users#destroy_all"
        delete "/delete_all", to: "users#delete_all"
      end
    end

    resources(:users) do
      define.call

      post :impersonate

      collection do
        delete "/destroy_all", to: "users#destroy_all"
        delete "/delete_all", to: "users#delete_all"
      end
    end

    define.call

    resources :country_codes
    resources :password_validations
    resource :session

    patch :time_zone, to: "users#update_time_zone"

    get :up, to: "static#up"
    get :documentation, to: "static#documentation"
    get :about, to: "static#about"
    get :terms, to: "static#terms"
    get :privacy, to: "static#privacy"
    get :source, to: "static#source"
    get :account, to: "static#account"
    get :more, to: "static#more"
    get :icons, to: "static#icons"

    resources :configurations, only: [] do
      get :ios_v1, on: :collection
      get :android_v1, on: :collection
      get :ios_v2, on: :collection
      get :android_v2, on: :collection
    end

    match "/404", to: "errors#not_found", via: :all
    match "/422", to: "errors#unprocessable_entity", via: :all
    match "/500", to: "errors#internal_server_error", via: :all

    root to: "static#home"

    match "*path", to: "errors#not_found", via: :all
  end
end
