import { Controller } from "@hotwired/stimulus";

const EXECUTE_TIMEOUT_MILLISECONDS = 90000;
const INTERVAL_MILLISECONDS = 5000;
const READY_TIMEOUT_MILLISECONDS = 30000;
const SCRIPT_TIMEOUT_MILLISECONDS = 30000;
const SCRIPT_ID = "recaptcha-enterprise";
const TOKEN_MAX_AGE_MILLISECONDS = 110000;

let loadPromise = null;
let recaptchaExecutionQueue = Promise.resolve();

export default class extends Controller {
  static targets = ["response", "action"];

  connect() {
    if (this.connected) {
      this._enableInputs();
      return;
    }

    this.connected = true;
    this.form = this._form();
    this.submitBound = this.submit.bind(this);
    this.beforeCacheBound = this.beforeCache.bind(this);
    this.beforeRenderBound = this.beforeRender.bind(this);
    this.form?.addEventListener("submit", this.submitBound);
    document.addEventListener("turbo:before-cache", this.beforeCacheBound);
    document.addEventListener("turbo:before-render", this.beforeRenderBound);

    this._enableInputs();
    this.refresh();
    this.interval = setInterval(
      () => this.refresh(),
      INTERVAL_MILLISECONDS,
    );
  }

  disconnect() {
    if (!this.connected) return;

    this.connected = false;
    this.allowSubmit = false;
    this.submitting = false;
    this.form?.removeEventListener("submit", this.submitBound);
    document.removeEventListener("turbo:before-cache", this.beforeCacheBound);
    document.removeEventListener("turbo:before-render", this.beforeRenderBound);
    clearInterval(this.interval);
    resetRecaptchaExecutionQueue();
    this._enableInputs();
  }

  beforeCache() {
    this.allowSubmit = false;
    this.submitting = false;
    resetRecaptchaExecutionQueue();
    this._enableInputs();
  }

  beforeRender() {
    resetRecaptcha();
  }

  async submit(event) {
    if (this.allowSubmit) {
      this.allowSubmit = false;
      this._disableSubmitterAfterSubmit(event.submitter);
      return;
    }

    if (this._hasFreshToken()) {
      this._disableSubmitterAfterSubmit(event.submitter);
      return;
    }

    event.preventDefault();

    if (this.submitting) return;

    this.submitting = true;
    this._disableSubmitter(event.submitter);

    try {
      if (!this._hasFreshToken()) await this.execute();
    } catch (error) {
      this._handleError(error);
      return;
    } finally {
      this.submitting = false;
      this._enableInputs();
    }

    if (!this._hasToken()) {
      this._handleError(new Error("Recaptcha returned an empty token"));
      return;
    }

    this.allowSubmit = true;
    this._enableInputs();
    this._requestSubmit(event.submitter);
  }

  execute() {
    if (this.executionPromise) return this.executionPromise;

    this.executionPromise = this._execute().finally(() => {
      this.executionPromise = null;
    });

    return this.executionPromise;
  }

  refresh() {
    if (this._hasFreshToken()) return;

    this.execute().catch(() => {});
  }

  async _execute() {
    this.responseTarget.value = await enqueueRecaptcha(this.actionTarget.value);
    this.responseTarget.dataset.recaptchaGeneratedAt = Date.now().toString();
  }

  _requestSubmit(submitter) {
    if (!this.form) return;

    if (submitter) {
      this.form.requestSubmit(submitter);
    } else {
      this.form.requestSubmit();
    }
  }

  _inputs() {
    const form = this._form();
    const submitInputs = this._submitInputs(form);

    if (submitInputs.length > 0) return submitInputs;
    if (form) return [form];

    return [];
  }

  _submitInputs(form = this._form()) {
    return [...(form?.querySelectorAll("[type=submit]") || [])];
  }

  _enableInputs() {
    this._inputs().forEach((input) => (input.disabled = false));
  }

  _disableSubmitter(submitter) {
    const inputs = submitter ? [submitter] : this._submitInputs(this.form);

    inputs.forEach((input) => (input.disabled = true));
  }

  _disableSubmitterAfterSubmit(submitter) {
    if (this._opensConfirmation()) return;

    setTimeout(() => this._disableSubmitter(submitter), 0);
  }

  _form() {
    return this.element.closest("form");
  }

  _opensConfirmation() {
    return this.form?.dataset.action?.includes("confirm#show") || false;
  }

  _hasToken() {
    return this.responseTarget.value.trim() !== "";
  }

  _hasFreshToken() {
    const generatedAt = Number(this.responseTarget.dataset.recaptchaGeneratedAt);

    return (
      this._hasToken() &&
      Number.isFinite(generatedAt) &&
      Date.now() - generatedAt < TOKEN_MAX_AGE_MILLISECONDS
    );
  }

  _handleError(error) {
    console.error("Recaptcha failed", error);
  }
}

function loadRecaptcha() {
  if (window.grecaptcha?.enterprise) return Promise.resolve();

  if (loadPromise === null) {
    loadPromise = withTimeout(
      new Promise((resolve, reject) => {
        const existingScript = document.getElementById(SCRIPT_ID);
        if (existingScript) {
          if (existingScript.dataset.loaded === "true") {
            resolve();
            return;
          }

          existingScript.addEventListener(
            "load",
            () => {
              existingScript.dataset.loaded = "true";
              resolve();
            },
            {
              once: true,
            },
          );
          existingScript.addEventListener("error", reject, { once: true });
          return;
        }

        const recaptchaScript = document.createElement("script");
        recaptchaScript.id = SCRIPT_ID;
        recaptchaScript.async = true;
        recaptchaScript.defer = true;
        recaptchaScript.onload = () => {
          recaptchaScript.dataset.loaded = "true";
          resolve();
        };
        recaptchaScript.onerror = reject;
        recaptchaScript.src = `https://www.google.com/recaptcha/enterprise.js?render=${encodeURIComponent(window.RECAPTCHA_SITE_KEY)}`;

        document.head.appendChild(recaptchaScript);
      }),
      SCRIPT_TIMEOUT_MILLISECONDS,
      "Recaptcha script timed out",
    ).catch((error) => {
      loadPromise = null;
      throw error;
    });
  }

  return loadPromise;
}

async function executeRecaptcha(action) {
  await loadRecaptcha();
  await recaptchaReady();

  return withTimeout(
    window.grecaptcha.enterprise.execute(window.RECAPTCHA_SITE_KEY, { action }),
    EXECUTE_TIMEOUT_MILLISECONDS,
    "Recaptcha execute timed out",
  );
}

export function recaptchaToken(action) {
  return enqueueRecaptcha(action);
}

function enqueueRecaptcha(action) {
  const execution = recaptchaExecutionQueue.then(
    () => executeRecaptcha(action),
    () => executeRecaptcha(action),
  );

  recaptchaExecutionQueue = execution.catch(() => {});

  return execution;
}

function resetRecaptchaExecutionQueue() {
  recaptchaExecutionQueue = Promise.resolve();
}

function resetRecaptcha() {
  resetRecaptchaExecutionQueue();
  loadPromise = null;
  document.getElementById(SCRIPT_ID)?.remove();
  clearWindowValue("grecaptcha");
  clearWindowValue("___grecaptcha_cfg");
}

function clearWindowValue(key) {
  try {
    delete window[key];
  } catch {
    window[key] = undefined;
  }
}

function recaptchaReady() {
  return withTimeout(
    new Promise((resolve, reject) => {
      if (!window.grecaptcha?.enterprise) {
        reject(new Error("Recaptcha is unavailable"));
        return;
      }

      window.grecaptcha.enterprise.ready(resolve);
    }),
    READY_TIMEOUT_MILLISECONDS,
    "Recaptcha ready timed out",
  );
}

function withTimeout(promise, milliseconds, message) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error(message)),
      milliseconds,
    );

    promise.then(
      (value) => {
        clearTimeout(timeout);
        resolve(value);
      },
      (error) => {
        clearTimeout(timeout);
        reject(error);
      },
    );
  });
}
