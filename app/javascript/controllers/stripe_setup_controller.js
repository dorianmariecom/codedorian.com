import { Controller } from "@hotwired/stimulus";
import { loadStripe } from "stripe";

export default class extends Controller {
  static targets = ["error", "payment", "submit"];
  static values = {
    clientSecret: String,
    publishableKey: String,
    returnUrl: String,
  };

  async connect() {
    try {
      this.connected = true;
      const Stripe = await loadStripe();
      if (!this.connected) return;

      const stripe = Stripe(this.publishableKeyValue);
      this.stripe = stripe;
      this.elements = stripe.elements({ clientSecret: this.clientSecretValue });
      this.elements.create("payment").mount(this.paymentTarget);
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
    this.submitTarget.disabled = true;
    this.showError("");
    const { error } = await this.stripe.confirmSetup({
      elements: this.elements,
      confirmParams: { return_url: this.returnUrlValue },
    });
    if (error) {
      this.showError(error.message);
      this.submitTarget.disabled = false;
    }
  }

  showError(message) {
    this.errorTarget.textContent = message;
    this.errorTarget.hidden = !message;
  }
}
