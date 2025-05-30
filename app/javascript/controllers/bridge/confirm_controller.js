import { BridgeComponent } from "@hotwired/hotwire-native-bridge";

export default class extends BridgeComponent {
  static component = "confirm";
  static values = {
    title: String,
    description: String,
    cancel: String,
    confirm: String,
    destructive: Boolean,
  };

  show() {
    this.send(
      "show",
      {
        title: this.titleValue,
        description: this.descriptionValue,
        cancel: this.cancelValue,
        confirm: this.confirmValue,
        destructive: this.destructiveValue
      },
      () => {
        this.element.submit();
      },
    );
  }
}
