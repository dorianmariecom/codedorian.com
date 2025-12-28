import { Controller } from "@hotwired/stimulus";
import { createTheme } from "thememirror";
import { indentOnInput, bracketMatching } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import {
  EditorView,
  keymap,
  drawSelection,
  rectangularSelection,
  crosshairCursor,
  lineNumbers,
} from "@codemirror/view";

const codeTheme = createTheme({
  variant: "light",
  settings: {
    background: "#ffffff", // white
    foreground: "#000000", // black
    caret: "#000000", // black
    selection: "#e5e7eb", // gray-200
    lineHighlight: "#f3f4f6", // gray-100
    gutterBackground: "#ffffff", // white
    gutterForeground: "#000000", // black
  },
  styles: [],
});

export default class extends Controller {
  static targets = ["input", "editor"];

  connect() {
    window.addEventListener("turbo:morph", this.reconnect.bind(this));

    this.editor = new EditorView({
      doc: this.inputTarget.value,
      parent: this.editorTarget,
      extensions: [
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          this.inputTarget.value = update.state.doc.toString();
        }),
        keymap.of(defaultKeymap),
        keymap.of(historyKeymap),
        keymap.of([indentWithTab]),
        bracketMatching(),
        crosshairCursor(),
        drawSelection(),
        history(),
        indentOnInput(),
        lineNumbers(),
        rectangularSelection(),
        codeTheme,
        EditorView.theme({
          "&": {
            height: "100%",
          },
          ".cm-scroller": {
            overflow: "auto",
            height: "100%",
          },
        }),
      ],
    });
  }

  disconnect() {
    window.removeEventListener("turbo:morph", this.reconnect.bind(this));

    this.editor.destroy();
    this.editor = null;
  }

  reconnect() {
    this.disconnect();
    this.connect();
  }
}
