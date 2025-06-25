import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["interval", "startsAt"];

  fill(event) {
    const schedule = event.detail.schedule;

    this.intervalTarget.value = schedule.interval;
    this.startsAtTarget.value = schedule.starts_at;
  }
}
