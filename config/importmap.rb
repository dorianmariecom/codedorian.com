# frozen_string_literal: true

pin "@codemirror/autocomplete",
    to: "@codemirror--autocomplete.js",
    preload: false,
    integrity: true # @6.20.0
pin "@codemirror/commands",
    to: "@codemirror--commands.js",
    preload: false,
    integrity: true # @6.10.4
pin "@codemirror/language",
    to: "@codemirror--language.js",
    preload: false,
    integrity: true # @6.12.3
pin "@codemirror/lint",
    to: "@codemirror--lint.js",
    preload: false,
    integrity: true # @6.9.7
pin "@codemirror/search",
    to: "@codemirror--search.js",
    preload: false,
    integrity: true # @6.7.1
pin "@codemirror/state",
    to: "@codemirror--state.js",
    preload: false,
    integrity: true # @6.7.0
pin "@codemirror/view",
    to: "@codemirror--view.js",
    preload: false,
    integrity: true # @6.43.2
pin "@googlemaps/js-api-loader",
    to: "@googlemaps--js-api-loader.js",
    preload: false,
    integrity: true # @2.0.2
pin "@hotwired/hotwire-native-bridge",
    to: "@hotwired--hotwire-native-bridge.js",
    preload: false,
    integrity: true # @1.2.2
pin "@hotwired/stimulus", to: "@hotwired--stimulus.js", integrity: true # @3.2.2
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", integrity: true
pin "@hotwired/turbo", to: "@hotwired--turbo.js", integrity: true # @8.0.23
pin "@hotwired/turbo-rails", to: "@hotwired--turbo-rails.js", integrity: true # @8.0.23
pin "@lezer/common", to: "@lezer--common.js", preload: false, integrity: true # @1.5.2
pin "@lezer/highlight",
    to: "@lezer--highlight.js",
    preload: false,
    integrity: true # @1.2.3
pin "@marijn/find-cluster-break",
    to: "@marijn--find-cluster-break.js",
    preload: false,
    integrity: true # @1.0.2
pin "@rails/actioncable", to: "@rails--actioncable.js", integrity: true # @8.1.300
pin "@rails/actioncable/src", to: "@rails--actioncable--src.js", integrity: true # @8.1.300
pin "@rails/activestorage", to: "activestorage.esm.js", preload: false
pin "@sentry/browser", to: "@sentry--browser.js", integrity: true # @10.60.0
pin "application", integrity: true
pin "codemirror", preload: false, integrity: true # @6.0.2
pin "code-lang", preload: false, integrity: true
pin "constants", preload: false, integrity: true
pin "consumer", integrity: true # @1.2.2
pin "crelt", preload: false, integrity: true # @1.0.6
pin "debounce", preload: false, integrity: true
pin "http", integrity: true
pin "i18n", preload: false, integrity: true
pin "intl-tel-input", preload: false, integrity: true # @29.1.1
pin "intl-tel-input/utils",
    to: "intl-tel-input--utils.js",
    preload: false,
    integrity: true # @29.1.1
pin "json-lang", preload: false, integrity: true
pin "lexxy", to: "lexxy.js", preload: false
pin "lexxy-code", preload: false, integrity: true
pin "local-time", integrity: true # @3.0.3
pin "polyfills", integrity: true
pin "style-mod", preload: false, integrity: true # @4.1.3
pin "stripe", to: "lib/stripe.js", preload: false, integrity: true
pin "thememirror", preload: false, integrity: true # @2.0.1
pin "w3c-keyname", preload: false, integrity: true # @2.2.8
pin_all_from "app/javascript/controllers",
             under: "controllers",
             preload: false,
             integrity: true
