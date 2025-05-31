import { BridgeComponent } from "@hotwired/hotwire-native-bridge";

export default class extends BridgeComponent {
  static component = "menu";

  static values = {
    menuIos: Array,
    menuAndroid: Array,
  };

  connect() {
    super.connect();

    if (window.platform === "ios") {
      this.send("connect", { menu: this.menuIosValue });
    } else {
      this.send("connect", { menu: this.menuAndroidValue });
    }
  }
}
