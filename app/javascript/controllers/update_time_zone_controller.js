import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  async connect() {
    if (window.time_zone) {
      return;
    }

    const csrfToken = document.querySelector("[name='csrf-token']")?.content;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const response = await fetch("/time_zone", {
      method: "PATCH",
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ time_zone: timeZone }),
    });

    if (response.ok) {
      window.location.reload();
    }
  }
}
