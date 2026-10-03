import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  async connect() {
    if (
      !this.element.querySelector(
        "pre, code[data-language], code[data-highlight-language]",
      )
    )
      return;

    const { highlightLexxyCode } = await import("lexxy-code");
    if (!this.element.isConnected) return;

    highlightLexxyCode(this.element);
  }
}
