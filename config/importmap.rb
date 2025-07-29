# frozen_string_literal: true

pin "application"
pin "i18n"
pin "debounce"
pin "constants"
pin "@hotwired/turbo-rails", to: "@hotwired--turbo-rails.js" # @8.0.16
pin "@hotwired/stimulus", to: "@hotwired--stimulus.js" # @3.2.2
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin "intl-tel-input" # @23.3.2
pin "intl-tel-input/build/js/utils.js",
    to: "intl-tel-input--build--js--utils.js.js" # @23.3.2
pin "stimulus-places-autocomplete" # @0.5.0
pin "@googlemaps/js-api-loader", to: "@googlemaps--js-api-loader.js" # @1.16.6
pin "@hotwired/turbo", to: "@hotwired--turbo.js" # @8.0.13
pin "local-time" # @3.0.2
pin "trix" # @2.1.15
pin "@rails/actiontext", to: "@rails--actiontext.js" # @8.0.200
pin "@hotwired/hotwire-native-bridge", to: "@hotwired--hotwire-native-bridge.js" # @1.0.0
pin "thememirror" # @2.0.1
pin "@codemirror/language", to: "@codemirror--language.js" # @6.11.2
pin "@codemirror/state", to: "@codemirror--state.js" # @6.5.2
pin "@codemirror/view", to: "@codemirror--view.js" # @6.38.1
pin "@lezer/common", to: "@lezer--common.js" # @1.2.3
pin "@lezer/highlight", to: "@lezer--highlight.js" # @1.2.1
pin "@marijn/find-cluster-break", to: "@marijn--find-cluster-break.js" # @1.0.2
pin "crelt" # @1.0.6
pin "style-mod" # @4.1.2
pin "w3c-keyname" # @2.2.8
pin "codemirror" # @6.0.2
pin "@codemirror/autocomplete", to: "@codemirror--autocomplete.js" # @6.18.6
pin "@codemirror/commands", to: "@codemirror--commands.js" # @6.8.1
pin "@codemirror/lint", to: "@codemirror--lint.js" # @6.8.5
pin "@codemirror/search", to: "@codemirror--search.js" # @6.5.11
pin "@rails/actioncable/src", to: "@rails--actioncable--src.js" # @8.0.200
