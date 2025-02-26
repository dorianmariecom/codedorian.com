import "@hotwired/turbo-rails";
import "@hotwired/turbo";
import "controllers";
import "local-time";
import "trix";
import "@rails/actiontext";

const setupRecaptcha = () => {
  [...document.querySelectorAll("[type=submit]")].forEach((element) => {
    element.disabled = true;
  });

  window.executeRecaptchaForSubmit = () => {
    console.log("window.executeRecaptchaForSubmit");
    grecaptcha.ready(() => {
      console.log("grecaptcha.ready");
      grecaptcha
        .execute(window.RECAPTCHA_SITE_KEY, { action: "submit" })
        .then((token) => {
          console.log("grecaptcha.execute");
          setInputWithRecaptchaResponseTokenForSubmit(
            "g-recaptcha-response-data-submit",
            token,
          );
        });
    });
  };

  window.setInputWithRecaptchaResponseTokenForSubmit = (id, token) => {
    console.log("window.setInputWithRecaptchaResponseTokenForSubmit");
    [...document.querySelectorAll(`#${id}`)].forEach((element) => {
      element.value = token;
      element.parentElement.querySelector("[type=submit]").disabled = false;
    });
  };
};

Object.entries(window.translations.trix).forEach(([key, value]) => {
  Trix.config.lang[key] = value;
});

document.addEventListener("turbo:load", () => {
  setupRecaptcha();
});

setupRecaptcha();
