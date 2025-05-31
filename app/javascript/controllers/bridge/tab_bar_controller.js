import { BridgeComponent } from "@hotwired/hotwire-native-bridge";

export default class extends BridgeComponent {
  static component = "tab-bar";

  static values = {
    tabsIos: Array,
    tabsAndroid: Array,
  };

  connect() {
    super.connect();

    const tabs =
      window.platform === "ios" ? this.tabsIosValue : this.tabsAndroidValue;

    this.send("connect", { tabs });
  }
}
