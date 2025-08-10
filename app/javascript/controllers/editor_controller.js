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

const INTERVAL_DELAY_MS = 500;
const RECAPTCHA_CHECK_INTERVAL_MS = 50;
const ELLIPSIS = ["&nbsp;&nbsp;&nbsp;", ".&nbsp;&nbsp;", "..&nbsp;", "..."];
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
  static targets = [
    "input",
    "editor",
    "name",
    "nameButton",
    "schedules",
    "promptForm",
    "error",
  ];

  static values = {
    repatchaInterval: Number,
    nameInterval: Number,
    nameIndex: Number,
    loading: String,
    initial: String,
  };

  connect() {
    this.repatchaIntervalValue = setInterval(() => {
      this.nameButtonTarget.disabled = this.promptFormTarget.disabled;
    }, RECAPTCHA_CHECK_INTERVAL_MS);

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
    this.editor.destroy();
    this.editor = null;
    clearInterval(this.repatchaIntervalValue);
  }

  async generate() {
    this.nameButtonTarget.disabled = false;
    this.nameIndexValue = 0;

    this.nameIntervalValue = setInterval(() => {
      this.nameButtonTarget.innerHTML =
        this.loadingValue + ELLIPSIS[this.nameIndexValue];
      this.nameIndexValue = (this.nameIndexValue + 1) % ELLIPSIS.length;
    }, INTERVAL_DELAY_MS);

    const csrfToken = document.querySelector("[name='csrf-token']")?.content;
    const formData = new FormData(this.promptFormTarget);
    formData.append("prompt[name]", this.hasNameTarget ? this.nameTarget.value : "");
    formData.append("prompt[input]", this.inputTarget.value);
    formData.append("prompt[schedules]", JSON.stringify(this._schedules()));

    try {
      const response = await fetch(this.promptFormTarget.action, {
        method: this.promptFormTarget.method,
        headers: {
          "X-CSRF-Token": csrfToken,
          Accept: "application/json",
        },
        body: formData,
      });

      const json = await response.json();

      if (response.ok) {
        this.errorTarget.innerText = null;
        this.editor.dispatch({
          changes: {
            from: 0,
            to: this.editor.state.doc.length,
            insert: json.input,
          },
        });

        if (this.hasSchedulesTarget) {
          this.schedulesTarget.dispatchEvent(
            new CustomEvent("nested.schedules", {
              detail: { schedules: json.schedules },
            }),
          );
        }
      } else {
        this.errorTarget.innerText = json.message;
      }
    } catch {}

    clearInterval(this.nameIntervalValue);
    this.nameButtonTarget.disabled = false;
    this.nameButtonTarget.innerText = this.initialValue;
  }

  _schedules() {
    if (!this.hasSchedulesTarget) {
      return [];
    }

    return [...this.schedulesTarget.querySelectorAll(".schedule")]
      .filter((schedule) => {
        return schedule.querySelector('input[name*="_destroy"]').value !== "1";
      })
      .map((schedule) => {
        return {
          starts_at: schedule.querySelector(".schedule__starts-at").value,
          interval: schedule.querySelector(".schedule__interval").value,
        };
      });
  }
}
