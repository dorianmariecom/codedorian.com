import { StreamLanguage } from "@codemirror/language";

const KEYWORDS = new Set([
  "if",
  "unless",
  "elsif",
  "elsunless",
  "else",
  "while",
  "until",
  "loop",
  "do",
  "begin",
  "end",
  "rescue",
]);

const OPERATOR_WORDS = new Set(["and", "or", "not"]);
const ATOMS = new Set(["true", "false", "nothing"]);

const SYMBOL = /^:[^\s,=:{}\[\]().'"|&<>*][^\s,=:{}\[\]().'"|&<>*]*/;
const IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*[!?]?/;
const HEX_NUMBER = /^0[xX][0-9A-Fa-f](?:_?[0-9A-Fa-f])*/;
const OCTAL_NUMBER = /^0[oO][0-7](?:_?[0-7])*/;
const BINARY_NUMBER = /^0[bB][01](?:_?[01])*/;
const FLOAT_NUMBER = /^[0-9](?:_?[0-9])*\.[0-9](?:_?[0-9])*(?:[eE][0-9](?:_?[0-9])*)?/;
const INTEGER_NUMBER = /^[0-9](?:_?[0-9])*(?:[eE][0-9](?:_?[0-9])*)?/;
const OPERATORS =
  /^(?:\|\|=|&&=|>>=|<<=|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|===|==|!=|<=>|=~|~=|!~|>=|<=|>>|<<|\*\*|\.\.\.|\.\.|::|&\.|\|\||&&|[+\-*\/%&|^~!<>?:=.×÷])/;
const DELIMITERS = /^[(){}\[\],]/;

const codeLanguage = StreamLanguage.define({
  startState() {
    return {
      inBlockComment: false,
      quote: null,
      interpolationDepth: 0,
      interpolationQuote: null,
      pendingProperty: false,
    };
  },

  token(stream, state) {
    if (state.inBlockComment) {
      if (stream.skipTo("*/")) {
        stream.match("*/");
        state.inBlockComment = false;
      } else {
        stream.skipToEnd();
      }

      return "comment";
    }

    if (state.quote && state.interpolationDepth === 0) {
      let escaped = false;

      while (!stream.eol()) {
        const character = stream.next();

        if (escaped) {
          escaped = false;
        } else if (character === "\\") {
          escaped = true;
        } else if (character === "{") {
          if (stream.pos - stream.start === 1) {
            state.interpolationDepth = 1;
            state.pendingProperty = false;
            return "bracket";
          }

          stream.backUp(1);
          return "string";
        } else if (character === state.quote) {
          state.quote = null;
          break;
        }
      }

      return "string";
    }

    if (stream.eatSpace()) {
      return null;
    }

    if (stream.match("/*")) {
      state.inBlockComment = true;
      state.pendingProperty = false;
      return "comment";
    }

    if (stream.match("//") || stream.match("#")) {
      stream.skipToEnd();
      state.pendingProperty = false;
      return "comment";
    }

    if (state.interpolationDepth > 0) {
      if (state.interpolationQuote) {
        let escaped = false;

        while (!stream.eol()) {
          const character = stream.next();

          if (escaped) {
            escaped = false;
          } else if (character === "\\") {
            escaped = true;
          } else if (character === state.interpolationQuote) {
            state.interpolationQuote = null;
            break;
          }
        }

        return "string";
      }

      if (stream.eatSpace()) {
        return null;
      }

      if (stream.match("{")) {
        state.interpolationDepth += 1;
        state.pendingProperty = false;
        return "bracket";
      }

      if (stream.match("}")) {
        state.interpolationDepth -= 1;
        state.pendingProperty = false;
        return "bracket";
      }
    }

    const quote = stream.peek();
    if (quote === "'" || quote === '"') {
      stream.next();
      if (state.interpolationDepth > 0) {
        state.interpolationQuote = quote;
      } else {
        state.quote = quote;
      }
      state.pendingProperty = false;
      return "string";
    }

    if (
      stream.match(HEX_NUMBER) ||
      stream.match(OCTAL_NUMBER) ||
      stream.match(BINARY_NUMBER) ||
      stream.match(FLOAT_NUMBER) ||
      stream.match(INTEGER_NUMBER)
    ) {
      state.pendingProperty = false;
      return "number";
    }

    if (stream.match(SYMBOL)) {
      state.pendingProperty = false;
      return "atom";
    }

    if (stream.match(IDENTIFIER)) {
      const value = stream.current();
      const startsWithUppercase = /^[A-Z]/.test(value);

      if (OPERATOR_WORDS.has(value)) {
        state.pendingProperty = false;
        return "operator";
      }

      if (KEYWORDS.has(value)) {
        state.pendingProperty = false;
        return "keyword";
      }

      if (ATOMS.has(value)) {
        state.pendingProperty = false;
        return "atom";
      }

      if (state.pendingProperty) {
        state.pendingProperty = false;
        return startsWithUppercase ? "typeName" : "propertyName";
      }

      state.pendingProperty = false;
      if (startsWithUppercase) {
        return "typeName";
      }

      return "variableName";
    }

    if (stream.match(OPERATORS)) {
      const operator = stream.current();
      state.pendingProperty =
        operator === "." || operator === "&." || operator === "::";

      if (state.pendingProperty) {
        return "punctuation";
      }

      return "operator";
    }

    if (stream.match(DELIMITERS)) {
      state.pendingProperty = false;
      return stream.current() === "," ? "separator" : "bracket";
    }

    state.pendingProperty = false;
    stream.next();
    return null;
  },

  languageData: {
    commentTokens: {
      line: "#",
      block: { open: "/*", close: "*/" },
    },
  },
});

export default codeLanguage;
