import { Controller } from "@hotwired/stimulus";
import i18n from "i18n";
import { recaptchaToken } from "controllers/recaptcha_controller";

const POLL_MILLISECONDS = 1000;
const RECAPTCHA_ACTION = "post/program_runs";
const t = i18n("runnable_code");

export default class extends Controller {
  static values = { createUrl: String };

  connect() {
    this.scanBound = this.scan.bind(this);
    document.addEventListener("turbo:morph", this.scanBound);
    this.scan();
  }

  disconnect() {
    document.removeEventListener("turbo:morph", this.scanBound);
    clearTimeout(this.pollTimeout);
    this.observedBlocks?.forEach((block) => {
      block.removeEventListener("click", this.activate);
    });
  }

  scan() {
    this.observedBlocks ||= new Set();

    this.element.querySelectorAll("pre, .code").forEach((block) => {
      if (this.skip(block) || this.observedBlocks.has(block)) return;

      block.addEventListener("click", this.activate);
      this.observedBlocks.add(block);
    });
  }

  activate = (event) => {
    const block = event.currentTarget;
    const input = block.textContent;
    const editor = this.buildEditor(input);

    block.replaceWith(editor);
  };

  skip(block) {
    return (
      block.closest("[data-runnable-code-skip]") ||
      block.closest("[data-runnable-code-editor]") ||
      block.closest("[data-controller~='editor']")
    );
  }

  buildEditor(input) {
    const wrapper = document.createElement("div");
    wrapper.className = "p flex flex-col gap-2";
    wrapper.dataset.runnableCodeEditor = "true";

    const editorController = document.createElement("div");
    editorController.className = "flex flex-col";
    editorController.dataset.controller = "editor";
    editorController.dataset.editorLanguageValue = "code";

    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.value = input;
    hiddenInput.dataset.editorTarget = "input";

    const frame = document.createElement("div");
    frame.className =
      "flex flex-col border border-black rounded overflow-hidden";

    const editorTarget = document.createElement("div");
    editorTarget.className = "h-96";
    editorTarget.dataset.editorTarget = "editor";

    const actions = document.createElement("div");
    actions.className = "p p--flex";

    const run = document.createElement("button");
    run.type = "button";
    run.className = "button";
    run.textContent = t("run");
    run.addEventListener("click", () => this.run(hiddenInput, run));

    actions.append(run);
    frame.append(hiddenInput, editorTarget);
    editorController.append(frame);
    wrapper.append(editorController, actions);

    return wrapper;
  }

  async run(input, button) {
    this.openModal({ status_label: t("running") });
    button.disabled = true;

    try {
      const token = await recaptchaToken(RECAPTCHA_ACTION);
      const response = await fetch(this.createUrlValue, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRF-Token": this.csrfToken(),
        },
        body: JSON.stringify({
          input: input.value,
          "g-recaptcha-action": RECAPTCHA_ACTION,
          "g-recaptcha-response": token,
        }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || response.statusText);

      this.renderResult(data);
      this.poll(data.status_url).catch((error) => {
        this.renderResult({ error_message: error.message, finished: true });
      });
    } catch (error) {
      this.renderResult({ error_message: error.message, finished: true });
    } finally {
      button.disabled = false;
    }
  }

  async poll(url) {
    clearTimeout(this.pollTimeout);
    const response = await fetch(url, {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.message || response.statusText);

    this.renderResult(data);

    if (!data.finished) {
      this.pollTimeout = setTimeout(() => {
        this.poll(url).catch((error) => {
          this.renderResult({ error_message: error.message, finished: true });
        });
      }, POLL_MILLISECONDS);
    }
  }

  openModal(data) {
    this.modal ||= this.buildModal();
    document.body.append(this.modal);
    this.modal.hidden = false;
    this.renderResult(data);
  }

  buildModal() {
    const modal = document.createElement("div");
    modal.hidden = true;
    modal.className =
      "bg-black fixed inset-0 flex items-center justify-center p-4 z-10";
    modal.dataset.runnableCodeSkip = "true";

    const panel = document.createElement("div");
    panel.className = "bg-white p-4 rounded w-full max-w-3xl";

    const header = document.createElement("div");
    header.className = "p flex justify-between items-center";

    const title = document.createElement("div");
    title.className = "font-bold";
    title.textContent = t("result");

    const close = document.createElement("button");
    close.type = "button";
    close.className = "link";
    close.textContent = t("close");
    close.addEventListener("click", () => {
      clearTimeout(this.pollTimeout);
      modal.hidden = true;
    });

    this.resultTarget = document.createElement("div");

    header.append(title, close);
    panel.append(header, this.resultTarget);
    modal.append(panel);

    return modal;
  }

  renderResult(data) {
    this.resultTarget.replaceChildren(
      this.row(t("status"), data.status_label || data.status || ""),
      this.codeRow(t("output"), data.output),
      this.codeRow(t("result"), data.result),
      this.codeRow(
        t("error"),
        [data.error_class, data.error_message, data.error].filter(Boolean).join(
          "\n",
        ),
      ),
    );
  }

  row(label, value) {
    const row = document.createElement("div");
    row.className = "p";

    const title = document.createElement("div");
    title.className = "text-gray-600";
    title.textContent = label;

    const body = document.createElement("div");
    body.className = "font-bold";
    body.textContent = value;

    row.append(title, body);
    return row;
  }

  codeRow(label, value) {
    const row = this.row(label, "");
    const body = document.createElement("pre");
    body.className = "code w-full";
    body.textContent = value || "";
    body.hidden = !value;
    row.append(body);
    row.hidden = !value;
    return row;
  }

  csrfToken() {
    return document.querySelector("meta[name='csrf-token']")?.content || "";
  }
}
