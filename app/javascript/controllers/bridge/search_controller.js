import { BridgeComponent } from "@hotwired/hotwire-native-bridge"

export default class extends BridgeComponent {
  static component = "search"
  static targets = ["form", "q"]

  connect() {
    super.connect()

    this.send("connect", {}, (message) => {
      this.qTarget.value = message.data.query
      this.formTarget.requestSubmit()
    })
  }

  disconnect() {
    super.disconnect()

    this.send("disconnect")
  }
}
