import { BridgeComponent } from "@hotwired/hotwire-native-bridge";

export default class extends BridgeComponent {
  static component = "refresh";

  connect() {
    super.connect();

    this.send("connect", {}, () => {
      window.location.reload();
    });
  }

  disconnect() {
    super.disconnect();

    this.send("disconnect");
  }
}
