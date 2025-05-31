import { BridgeComponent } from "@hotwired/hotwire-native-bridge";

export default class extends BridgeComponent {
  static component = "button";
  static values = {
    title: String,
  };

  connect() {
    super.connect();

    this.send(
      "connect",
      { title: this.titleValue },
      () => {
        this.element.click();
      },
    );
  }

  disconnect() {
    super.disconnect();

    this.send("disconnect");
  }
}
