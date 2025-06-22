import { BridgeComponent } from "@hotwired/hotwire-native-bridge";

export default class extends BridgeComponent {
  static component = "flash";

  static values = {
    message: String,
    type: String,
  };

  connect() {
    super.connect();

    this.send("connect", { message: this.messageValue, type: this.typeValue });
  }

  disconnect() {
    super.disconnect();

    this.send("disconnect");
  }
}
