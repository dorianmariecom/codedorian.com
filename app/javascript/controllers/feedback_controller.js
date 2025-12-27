import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    const client = window.Sentry.getClient();
    const feedback = client.getIntegrationByName("Feedback");
    feedback.attachTo(this.element);
  }
}
