import { Controller } from "@hotwired/stimulus";
import { EditorView } from "codemirror";
import {
  EditorView,
  keymap,
  drawSelection,
  rectangularSelection,
  crosshairCursor,
  lineNumbers,
} from "@codemirror/view";
import { indentOnInput } from "@codemirror/language";
import { history, historyKeymap } from "@codemirror/commands";

export default class extends Controller {
  static targets = ["input", "editor"];

  connect() {
    this.editor = new EditorView({
      doc: this.inputTarget.value,
      parent: this.editorTarget,
      extensions: [
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          this.inputTarget.value = update.state.doc.toString();
        }),
        keymap.of(historyKeymap),
        bracketMatching(),
        crosshairCursor(),
        drawSelection(),
        history(),
        indentOnInput(),
        lineNumbers(),
        rectangularSelection(),
      ],
    });
  }

  disconnect() {
    this.editor.destroy();
    this.editor = null;
  }
}
