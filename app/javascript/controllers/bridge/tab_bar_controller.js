import { BridgeComponent } from "@hotwired/hotwire-native-bridge";

export default class extends BridgeComponent {
  static component = "tab-bar";

  static values = {
    tabsIos: Array,
    tabsAndroid: Array,
  };

  connect() {
    super.connect();

    if (window.platform === "ios") {
      this.send("connect", { tabs: this.tabsIosValue });
    } else if (window.platform === "android") {
      this.send("connect", { tabs: this.tabsAndroidValue });
    }
  }
}
