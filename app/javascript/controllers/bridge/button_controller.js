import { BridgeComponent } from "@hotwired/hotwire-native-bridge";

export default class extends BridgeComponent {
  static component = "button";
  static values = {
    title: String,
    image: String,
  };

  connect() {
    super.connect();

    this.send(
      "connect",
      { title: this.titleValue, image: this.imageValue },
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
