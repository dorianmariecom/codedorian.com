import { BridgeComponent } from "@hotwired/hotwire-native-bridge";

export default class extends BridgeComponent {
  static component = "actions";

  static values = {
    categoriesIos: Array,
    categoriesAndroid: Array,
  };

  connect() {
    super.connect();

    const categories =
      window.platform === "ios"
        ? this.categoriesIosValue
        : this.categoriesAndroidValue;

    this.send("connect", { categories });
  }
}
