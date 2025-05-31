import { BridgeComponent } from "@hotwired/hotwire-native-bridge";

export default class extends BridgeComponent {
  static component = "menu";

  static values = {
    menuIos: Array,
    menuAndroid: Array,
  };

  connect() {
    super.connect();

    const menu = window.platform === "ios" ? this.menuIosValue : this.menuAndroidValue;

    this.send("connect", { menu }, (message) => {
      window.Turbo.visit(menu[message.data.index].path);
    });
  }

  disconnect() {
    super.disconnect();

    this.send("disconnect");
  }
}
