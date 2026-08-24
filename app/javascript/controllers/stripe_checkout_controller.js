import { Controller } from "@hotwired/stimulus";
import { loadStripe } from "stripe";

export default class extends Controller {
  static targets = ["billingAddress", "error", "payment", "submit"];
  static values = {
    clientSecret: String,
    publishableKey: String,
  };

  async connect() {
    try {
      this.connected = true;
      const Stripe = await loadStripe();
      if (!this.connected) return;

      const stripe = Stripe(this.publishableKeyValue);
      this.checkout = stripe.initCheckout({
        clientSecret: this.clientSecretValue,
      });

      this.checkout.createPaymentElement().mount(this.paymentTarget);
      this.checkout
        .createBillingAddressElement()
        .mount(this.billingAddressTarget);

      const result = await this.checkout.loadActions();
      if (result.type !== "success") throw new Error(result.error.message);

      this.actions = result.actions;
      this.submitTarget.disabled = false;
    } catch (error) {
      this.showError(error.message);
    }
  }

  disconnect() {
    this.connected = false;
  }

  async submit(event) {
    event.preventDefault();
    if (!this.actions) return;

    this.submitTarget.disabled = true;
    this.showError("");
    const result = await this.actions.confirm();
    if (result.type === "error") {
      this.showError(result.error.message);
      this.submitTarget.disabled = false;
    }
  }

  showError(message) {
    this.errorTarget.textContent = message;
    this.errorTarget.hidden = !message;
  }
}
