import { BridgeComponent } from "@hotwired/hotwire-native-bridge"

export default class extends BridgeComponent {
  static component = "share";

  connect() {
    super.connect();

    this.send("connect", { url: window.location.href });
  }

  disconnect() {
    super.disconnect();

    this.send("disconnect");
  }
}
