import { Controller } from "@hotwired/stimulus";
import { EditorView } from "codemirror";

export default class extends Controller {
  static targets = ["input", "editor"];

  connect() {
    this.editor = new EditorView({
      doc: this.inputTarget.value,
      parent: this.editorTarget,
    });
  }

  disconnect() {
    this.editor.destroy();
    this.editor = null;
  }
}
