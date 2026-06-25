import { Controller } from "@hotwired/stimulus";
import { highlightLexxyCode } from "lexxy-code";

export default class extends Controller {
  connect() {
    highlightLexxyCode(this.element);
  }
}
