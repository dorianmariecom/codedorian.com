import { Controller } from "@hotwired/stimulus";
import http from "http";

export default class extends Controller {
  async connect() {
    if (window.time_zone) {
      return;
    }

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    try {
      await http("/time_zone", {
        method: "PATCH",
        json: { time_zone: timeZone },
      });
    } catch {
      // Updating the time zone is optional and should not interrupt the page.
    }
  }
}
