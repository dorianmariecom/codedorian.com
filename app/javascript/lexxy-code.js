import { Extension, configure, highlightCode } from "lexxy";

const CODE_LANGUAGE = "code";
const CODE_LANGUAGE_LABEL = "Code";
const CODE_NODE_TYPE = "code";
const CODE_PRE_SELECTOR = "pre";
const CODE_ELEMENT_SELECTOR = "code[data-language], code[data-highlight-language]";
const CODE_PICKER_SELECTOR = 'select[name="lexxy-code-language"]';
const CODE_PICKER_ELEMENT_SELECTOR = "lexxy-code-language-picker";
const CODE_LANGUAGE_OPTION_SELECTOR = `option[value="${CODE_LANGUAGE}"]`;
const CODE_LANGUAGE_PATTERN = /(^|\s)language-[^\s]+/g;
const LEXXY_CODE_LANGUAGE_EXTENSION_NAME = "codedorian/code-language";
const LEXXY_CODE_LINE_BREAK_EXTENSION_NAME = "codedorian/code-line-break";
const INSERT_LINE_BREAK_COMMAND_TYPE = "INSERT_LINE_BREAK_COMMAND";

const IDENTIFIER_START_CHARS = String.raw`_\p{L}`;
const IDENTIFIER_CONTINUE_CHARS = String.raw`_\p{L}\p{M}\p{N}`;
const IDENTIFIER_START = `[${IDENTIFIER_START_CHARS}]`;
const IDENTIFIER_CONTINUE = `[${IDENTIFIER_CONTINUE_CHARS}]`;
const IDENTIFIER_SOURCE = `${IDENTIFIER_START}${IDENTIFIER_CONTINUE}*[!?]?`;
const IDENTIFIER_LOOKBEHIND_SOURCE = `(^|[^${IDENTIFIER_CONTINUE_CHARS}])`;
const IDENTIFIER = new RegExp(
  `${IDENTIFIER_LOOKBEHIND_SOURCE}${IDENTIFIER_SOURCE}`,
  "u",
);
const PROPERTY = new RegExp(
  `((?:\\.|&\\.|::)\\s*)${IDENTIFIER_SOURCE}`,
  "u",
);
const LABEL = new RegExp(`${IDENTIFIER_SOURCE}(?=\\s*:)`, "u");
const TYPE_NAME = new RegExp(
  `${IDENTIFIER_LOOKBEHIND_SOURCE}\\p{Lu}${IDENTIFIER_CONTINUE}*[!?]?`,
  "u",
);
const SYMBOL =
  /(^|[\s([{,=:+\-!*\/%<>?&|^\n\r]):[^\s()[\]{},:&|=~*\/%<>^#.][^\s()[\]{},.:&|=~+\-*\/%<>^#]*(?:[!?](?!=|~))?/;
const HEX_NUMBER = /0[xX][0-9A-Fa-f](?:_?[0-9A-Fa-f])*/;
const OCTAL_NUMBER = /0[oO][0-7](?:_?[0-7])*/;
const BINARY_NUMBER = /0[bB][01](?:_?[01])*/;
const DECIMAL_NUMBER =
  /[0-9](?:_?[0-9])*\.[0-9](?:_?[0-9])*(?:[eE][0-9](?:_?[0-9])*(?:\.[0-9](?:_?[0-9])*)?)?/;
const INTEGER_NUMBER =
  /[0-9](?:_?[0-9])*(?:[eE][0-9](?:_?[0-9])*(?:\.[0-9](?:_?[0-9])*)?)?/;

export function highlightLexxyCode(root = document) {
  registerCodeLanguage();
  normalizeRenderedCodeLanguages(root, { resetHighlighted: true });
  highlightCode(root);
}

function registerCodeLanguage() {
  const Prism = globalThis.Prism;
  if (!Prism?.languages) return;

  Prism.languages[CODE_LANGUAGE] = {
    comment: [
      { pattern: /\/\*[\s\S]*?\*\//, greedy: true },
      { pattern: /\/\/.*/, greedy: true },
      { pattern: /#.*/, greedy: true },
    ],
    string: {
      pattern: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/,
      greedy: true,
    },
    number: [
      HEX_NUMBER,
      OCTAL_NUMBER,
      BINARY_NUMBER,
      DECIMAL_NUMBER,
      INTEGER_NUMBER,
    ],
    symbol: {
      pattern: SYMBOL,
      lookbehind: true,
      alias: "constant",
    },
    property: [
      {
        pattern: PROPERTY,
        lookbehind: true,
      },
      LABEL,
    ],
    "class-name": {
      pattern: TYPE_NAME,
      lookbehind: true,
    },
    boolean: /\b(?:true|false|nothing)\b/,
    keyword:
      /\b(?:begin|do|else|elsif|elsunless|end|if|loop|rescue|unless|until|while)\b/,
    operator:
      /\b(?:and|or|not)\b|(?:\|\|=|&&=|>>=|<<=|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|===|!==|==|!=|<=>|=~|~=|!~|>=|<=|=>|>>|<<|\*\*|\.\.\.|\.\.|::|&\.|\|\||&&|[.&|=!~+\-*\/%<>^×÷])/,
    punctuation: /[(){}\[\],?:]/,
    variable: {
      pattern: IDENTIFIER,
      lookbehind: true,
    },
  };
}

class CodeLanguageExtension extends Extension {
  get enabled() {
    return this.editorElement.supportsRichText;
  }

  get lexicalExtension() {
    return {
      name: LEXXY_CODE_LANGUAGE_EXTENSION_NAME,
      register(editor) {
        const codeNodeClass = codeNodeClassFor(editor);
        if (!codeNodeClass) return;

        return editor.registerNodeTransform(
          codeNodeClass,
          forceCodeNodeLanguage,
        );
      },
    };
  }
}

class CodeLineBreakExtension extends Extension {
  get enabled() {
    return this.editorElement.supportsRichText;
  }

  get lexicalExtension() {
    const editorElement = this.editorElement;

    return {
      name: LEXXY_CODE_LINE_BREAK_EXTENSION_NAME,
      register(editor) {
        const handleKeydown = (event) => {
          handleCodeBlockEnter(editor, editorElement, event);
        };
        let currentRootElement;

        const unregisterRootListener = editor.registerRootListener(
          (rootElement, previousRootElement) => {
            previousRootElement?.removeEventListener(
              "keydown",
              handleKeydown,
              true,
            );
            if (
              currentRootElement &&
              currentRootElement !== previousRootElement &&
              currentRootElement !== rootElement
            ) {
              currentRootElement.removeEventListener(
                "keydown",
                handleKeydown,
                true,
              );
            }

            currentRootElement = rootElement;
            if (!rootElement) return;

            rootElement.addEventListener("keydown", handleKeydown, true);
          },
        );

        return () => {
          unregisterRootListener();
          currentRootElement?.removeEventListener(
            "keydown",
            handleKeydown,
            true,
          );
        };
      },
    };
  }
}

function configureLexxyCodeExtensions() {
  configure({
    global: {
      extensions: [CodeLanguageExtension, CodeLineBreakExtension],
    },
  });
}

function editorCommand(editor, type) {
  // Lexxy does not export Lexical command constants; reuse the registered ones.
  for (const command of editor?._commands?.keys?.() || []) {
    if (command?.type === type) return command;
  }
}

function handleCodeBlockEnter(editor, editorElement, event) {
  if (event.key !== "Enter") return false;
  if (event.ctrlKey || event.metaKey || event.altKey || event.isComposing) {
    return false;
  }

  const insertLineBreakCommand = editorCommand(
    editor,
    INSERT_LINE_BREAK_COMMAND_TYPE,
  );
  if (!insertLineBreakCommand) return false;

  let isInsideCodeBlock = false;
  editor.getEditorState().read(() => {
    isInsideCodeBlock = editorElement?.selection?.isInsideCodeBlock;
  });
  if (!isInsideCodeBlock) return false;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  editor.dispatchCommand(insertLineBreakCommand, false);
  return true;
}

function codeNodeClassFor(editor) {
  return editor?._nodes?.get?.(CODE_NODE_TYPE)?.klass;
}

function forceCodeNodeLanguage(codeNode) {
  if (!isCodeNode(codeNode)) return;
  if (codeNode.getLanguage() === CODE_LANGUAGE) return;

  codeNode.setLanguage(CODE_LANGUAGE);
}

function isCodeNode(node) {
  return (
    node?.getType?.() === CODE_NODE_TYPE &&
    typeof node.getLanguage === "function" &&
    typeof node.setLanguage === "function"
  );
}

function installLexxyCodeLanguageConstraints() {
  configureExistingLanguagePickers();
  installLanguagePickerObserver();

  document.addEventListener("lexxy:initialize", (event) => {
    const editor = event.target;
    normalizeEditorState(editor);
    configureLanguagePicker(editor);
    normalizeEditorValue(editor);
    requestAnimationFrame(() => configureLanguagePicker(editor));
  });

  document.addEventListener(
    "lexxy:code-language-picker-open",
    (event) => {
      event.preventDefault();
    },
  );

  for (const eventName of ["pointerdown", "mousedown", "click"]) {
    document.addEventListener(eventName, preventLanguagePickerOpen, true);
  }

  document.addEventListener("submit", (event) => {
    for (const editor of event.target.querySelectorAll("lexxy-editor")) {
      normalizeEditorValue(editor);
    }
  });
}

function configureExistingLanguagePickers(root = document) {
  for (const pickerRoot of root.querySelectorAll(CODE_PICKER_ELEMENT_SELECTOR)) {
    configureLanguagePicker(pickerRoot);
  }
}

function installLanguagePickerObserver() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;

        if (node.matches(CODE_PICKER_ELEMENT_SELECTOR)) {
          configureLanguagePicker(node);
        }

        configureExistingLanguagePickers(node);
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

function preventLanguagePickerOpen(event) {
  if (!(event.target instanceof Element)) return;
  if (!event.target.closest(CODE_PICKER_SELECTOR)) return;

  event.preventDefault();
  event.stopImmediatePropagation();
}

function configureLanguagePicker(root) {
  const picker = root.querySelector(CODE_PICKER_SELECTOR);
  if (!picker) return;

  picker.replaceChildren(codeLanguageOption());
  picker.value = CODE_LANGUAGE;
  picker.disabled = true;
}

function codeLanguageOption() {
  const option = document.createElement("option");
  option.value = CODE_LANGUAGE;
  option.textContent = CODE_LANGUAGE_LABEL;
  return option;
}

function normalizeEditorValue(editor) {
  if (!editor || typeof editor.value !== "string") return;

  configureLanguagePicker(editor);

  const normalizedValue = normalizeCodeLanguages(editor.value);
  if (normalizedValue !== editor.value) {
    editor.value = normalizedValue;
  }
}

function normalizeEditorState(editorElement) {
  const editor = editorElement?.editor;
  if (!editor) return;

  editor.update(
    () => {
      for (const node of editor.getEditorState()._nodeMap.values()) {
        forceCodeNodeLanguage(node);
      }
    },
    { discrete: true },
  );
}

function normalizeRenderedCodeLanguages(root, { resetHighlighted = false } = {}) {
  let changed = false;
  const normalizedCodeElements = new Set();

  for (const pre of root.querySelectorAll(CODE_PRE_SELECTOR)) {
    changed = forceCodeLanguage(pre, { resetHighlighted }) || changed;

    const code = pre.querySelector("code");
    if (code) {
      normalizedCodeElements.add(code);
      changed =
        forceCodeLanguage(code, {
          resetHighlighted,
          syncHighlightLanguage: true,
        }) || changed;
    }
  }

  for (const code of root.querySelectorAll(CODE_ELEMENT_SELECTOR)) {
    if (normalizedCodeElements.has(code)) continue;

    changed =
      forceCodeLanguage(code, {
        resetHighlighted,
        syncHighlightLanguage: true,
      }) || changed;
  }

  return changed;
}

function normalizeCodeLanguages(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  return normalizeRenderedCodeLanguages(template.content) ? template.innerHTML : html;
}

function forceCodeLanguage(
  element,
  { resetHighlighted = false, syncHighlightLanguage = false } = {},
) {
  let changed = false;

  if (element.dataset.language !== CODE_LANGUAGE) {
    element.dataset.language = CODE_LANGUAGE;
    changed = true;
  }

  if (
    syncHighlightLanguage &&
    element.dataset.highlightLanguage !== CODE_LANGUAGE
  ) {
    element.dataset.highlightLanguage = CODE_LANGUAGE;
    changed = true;
  }

  for (const option of element.querySelectorAll(CODE_LANGUAGE_OPTION_SELECTOR)) {
    if (!option.selected) {
      option.selected = true;
      changed = true;
    }
  }

  const className = element.className
    .replace(CODE_LANGUAGE_PATTERN, "")
    .trim();
  if (className !== element.className) {
    element.className = className;
    changed = true;
  }

  if (!element.classList.contains(`language-${CODE_LANGUAGE}`)) {
    element.classList.add(`language-${CODE_LANGUAGE}`);
    changed = true;
  }

  if (resetHighlighted && element.hasAttribute("data-highlighted")) {
    element.removeAttribute("data-highlighted");
    changed = true;
  }

  return changed;
}

registerCodeLanguage();
configureLexxyCodeExtensions();
installLexxyCodeLanguageConstraints();
