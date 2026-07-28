import { BridgeComponent } from "@hotwired/hotwire-native-bridge";
import { recaptchaToken } from "controllers/recaptcha_controller";

export default class extends BridgeComponent {
  static component = "menu";

  static values = {
    menuIos: Array,
    menuAndroid: Array,
  };

  connect() {
    super.connect();

    const menu =
      window.platform === "ios" ? this.menuIosValue : this.menuAndroidValue;

    this.send("connect", { menu }, async (message) => {
      const item = menu[message.data.index];

      if (item.verb === "get") {
        window.Turbo.visit(item.path);
      } else {
        const action = `${item.verb}${item.path}`;
        const token = await recaptchaToken(action);
        const form = document.createElement("form");
        form.method = "post";
        form.action = item.path;

        const method = document.createElement("input");
        method.type = "hidden";
        method.name = "_method";
        method.value = item.verb;
        form.appendChild(method);

        const recaptchaAction = document.createElement("input");
        recaptchaAction.type = "hidden";
        recaptchaAction.name = "g-recaptcha-action";
        recaptchaAction.value = action;
        form.appendChild(recaptchaAction);

        const response = document.createElement("input");
        response.type = "hidden";
        response.name = "g-recaptcha-response";
        response.value = token;
        form.appendChild(response);

        const csrf = document.querySelector("meta[name='csrf-token']");
        if (csrf) {
          const token = document.createElement("input");
          token.type = "hidden";
          token.name = "authenticity_token";
          token.value = csrf.content;
          form.appendChild(token);
        }

        document.body.appendChild(form);
        form.requestSubmit();
      }
    });
  }

  disconnect() {
    super.disconnect();

    this.send("disconnect");
  }
}
