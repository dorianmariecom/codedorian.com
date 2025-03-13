import { BridgeComponent } from "@hotwired/hotwire-native-bridge";

export default class extends BridgeComponent {
  static component = "csrf-token";

  connect() {
    super.connect();

    const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
    const csrfToken = csrfTokenMeta?.getAttribute("content");

    this.send("connect", { csrf_token: csrfToken });
  }
}
