import { Controller } from "@hotwired/stimulus";
import { createTheme } from "thememirror";
import { indentOnInput, bracketMatching } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import codeLanguage from "code-lang";
import jsonLanguage from "json-lang";
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
  styles: [
    { tag: t.comment, color: "#6b7280" },
    { tag: [t.string, t.regexp], color: "#0f766e" },
    { tag: t.number, color: "#b45309" },
    { tag: [t.atom, t.bool, t.null], color: "#7c3aed" },
    { tag: [t.keyword, t.controlKeyword], color: "#1d4ed8", fontWeight: "600" },
    { tag: [t.operator, t.operatorKeyword], color: "#be123c" },
    { tag: t.punctuation, color: "#4b5563" },
    { tag: t.separator, color: "#6b7280" },
    { tag: t.bracket, color: "#7c2d12" },
    { tag: t.special(t.brace), color: "#9333ea" },
    { tag: t.variableName, color: "#111827" },
    { tag: t.propertyName, color: "#0369a1" },
    { tag: [t.typeName, t.className], color: "#0c4a6e", fontWeight: "600" },
  ],
});

export default class extends Controller {
  static targets = ["input", "editor"];
  static values = { language: String };

  connect() {
    this.reconnectBound ||= this.reconnect.bind(this);
    window.addEventListener("turbo:morph", this.reconnectBound);

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
        this.languageExtension(),
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
    window.removeEventListener("turbo:morph", this.reconnectBound);

    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
  }

  reconnect() {
    this.disconnect();
    this.connect();
  }

  languageExtension() {
    if (this.languageValue === "json") {
      return jsonLanguage;
    }

    if (this.languageValue === "code") {
      return codeLanguage;
    }

    throw new Error(
      `Invalid editor language "${this.languageValue}". Expected "json" or "code".`
    );
  }
}
