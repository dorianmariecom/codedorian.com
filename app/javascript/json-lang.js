import { StreamLanguage } from "@codemirror/language";

const NUMBER =
  /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/;
const LITERAL = /^(?:true|false|null)\b/;

const jsonLanguage = StreamLanguage.define({
  startState() {
    return {
      stack: [],
    };
  },

  token(stream, state) {
    if (stream.eatSpace()) {
      return null;
    }

    const context = state.stack[state.stack.length - 1];

    if (stream.match("{")) {
      state.stack.push({ type: "object", expectsKey: true });
      return "bracket";
    }

    if (stream.match("}")) {
      state.stack.pop();
      return "bracket";
    }

    if (stream.match("[")) {
      state.stack.push({ type: "array" });
      return "bracket";
    }

    if (stream.match("]")) {
      state.stack.pop();
      return "bracket";
    }

    if (stream.match(":")) {
      return "punctuation";
    }

    if (stream.match(",")) {
      if (context?.type === "object") {
        context.expectsKey = true;
      }

      return "separator";
    }

    if (stream.match('"')) {
      let escaped = false;

      while (!stream.eol()) {
        const character = stream.next();

        if (escaped) {
          escaped = false;
        } else if (character === "\\") {
          escaped = true;
        } else if (character === '"') {
          break;
        }
      }

      if (context?.type === "object" && context.expectsKey) {
        context.expectsKey = false;
        return "propertyName";
      }

      return "string";
    }

    if (stream.match(NUMBER)) {
      return "number";
    }

    if (stream.match(LITERAL)) {
      return "atom";
    }

    stream.next();
    return null;
  },
});

export default jsonLanguage;
