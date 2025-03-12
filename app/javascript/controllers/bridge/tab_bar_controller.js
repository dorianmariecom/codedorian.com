import { BridgeComponent } from "@hotwired/hotwire-native-bridge";

export default class extends BridgeComponent {
  static component = "tab-bar";

  static values = {
    tabs: Array,
  };

  connect() {
    super.connect();

    this.send("connect", { tabs: this.tabsValue });
  }
}
