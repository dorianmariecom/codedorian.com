import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["target", "template", "schedule"];
  static values = { selector: String };

  add(event) {
    event.preventDefault();

    const existingWrapper = this.element.querySelector(
      `${this.selectorValue}:not([hidden])`,
    );

    const content = this.templateTarget.innerHTML.replace(
      /NEW_RECORD/g,
      new Date().getTime().toString(),
    );

    this.targetTarget.insertAdjacentHTML("beforebegin", content);

    if (!existingWrapper) {
      const newWrapper = this.element.querySelector(
        `${this.selectorValue}:not([hidden])`,
      );

      const primaryCheckBoxes = newWrapper?.querySelectorAll(
        '[name$="[primary]"]',
      );

      primaryCheckBoxes?.forEach((primaryCheckBox) => {
        primaryCheckBox.checked = true;
      });

      const verifiedCheckBoxes = newWrapper?.querySelectorAll(
        '[name$="[verified]"]',
      );

      verifiedCheckBoxes?.forEach((verifiedCheckBox) => {
        verifiedCheckBox.checked = true;
      });
    }
  }

  remove(event) {
    event.preventDefault();

    const wrapper = event.target.closest(this.selectorValue);

    if (wrapper.dataset.newRecord === "true") {
      wrapper.remove();
    } else {
      wrapper.hidden = true;

      const input = wrapper.querySelector("input[name*='_destroy']");
      input.value = "1";

      [...wrapper.querySelectorAll("[required]")].forEach((element) => {
        element.required = false;
      });
    }
  }

  schedules(event) {
    const schedules = event.detail.schedules;

    this.element.querySelectorAll(this.selectorValue).forEach((wrapper) => {
      if (wrapper.dataset.newRecord === "true") {
        wrapper.remove();
      } else {
        wrapper.hidden = true;

        const input = wrapper.querySelector("input[name*='_destroy']");
        input.value = "1";

        [...wrapper.querySelectorAll("[required]")].forEach((element) => {
          element.required = false;
        });
      }
    });

    schedules.forEach((schedule) => {
      const content = this.templateTarget.innerHTML.replace(
        /NEW_RECORD/g,
        new Date().getTime().toString(),
      );

      this.targetTarget.insertAdjacentHTML("beforebegin", content);

      const scheduleTarget = this.scheduleTargets[this.scheduleTargets.length - 1];

      scheduleTarget.dispatchEvent(
        new CustomEvent("schedule.fill", { detail: { schedule } })
      )
    })
  }
}
