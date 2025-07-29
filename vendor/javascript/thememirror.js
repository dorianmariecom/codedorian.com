// thememirror@2.0.1 downloaded from https://ga.jspm.io/npm:thememirror@2.0.1/dist/index.js

import { EditorView as o } from "@codemirror/view";
import {
  HighlightStyle as e,
  syntaxHighlighting as t,
} from "@codemirror/language";
import { tags as r } from "@lezer/highlight";
const createTheme = ({ variant: r, settings: a, styles: g }) => {
  const l = o.theme(
    {
      "&": { backgroundColor: a.background, color: a.foreground },
      ".cm-content": { caretColor: a.caret },
      ".cm-cursor, .cm-dropCursor": { borderLeftColor: a.caret },
      "&.cm-focused .cm-selectionBackgroundm .cm-selectionBackground, .cm-content ::selection":
        { backgroundColor: a.selection },
      ".cm-activeLine": { backgroundColor: a.lineHighlight },
      ".cm-gutters": {
        backgroundColor: a.gutterBackground,
        color: a.gutterForeground,
      },
      ".cm-activeLineGutter": { backgroundColor: a.lineHighlight },
    },
    { dark: "dark" === r },
  );
  const c = e.define(g);
  const n = [l, t(c)];
  return n;
};
const a = createTheme({
  variant: "dark",
  settings: {
    background: "#200020",
    foreground: "#D0D0FF",
    caret: "#7070FF",
    selection: "#80000080",
    gutterBackground: "#200020",
    gutterForeground: "#C080C0",
    lineHighlight: "#80000040",
  },
  styles: [
    { tag: r.comment, color: "#404080" },
    { tag: [r.string, r.regexp], color: "#999999" },
    { tag: r.number, color: "#7090B0" },
    { tag: [r.bool, r.null], color: "#8080A0" },
    { tag: [r.punctuation, r.derefOperator], color: "#805080" },
    { tag: r.keyword, color: "#60B0FF" },
    { tag: r.definitionKeyword, color: "#B0FFF0" },
    { tag: r.moduleKeyword, color: "#60B0FF" },
    { tag: r.operator, color: "#A0A0FF" },
    { tag: [r.variableName, r.self], color: "#008080" },
    { tag: r.operatorKeyword, color: "#A0A0FF" },
    { tag: r.controlKeyword, color: "#80A0FF" },
    { tag: r.className, color: "#70E080" },
    { tag: [r.function(r.propertyName), r.propertyName], color: "#50A0A0" },
    { tag: r.tagName, color: "#009090" },
    { tag: r.modifier, color: "#B0FFF0" },
    { tag: [r.squareBracket, r.attributeName], color: "#D0D0FF" },
  ],
});
const g = createTheme({
  variant: "light",
  settings: {
    background: "#fcfcfc",
    foreground: "#5c6166",
    caret: "#ffaa33",
    selection: "#036dd626",
    gutterBackground: "#fcfcfc",
    gutterForeground: "#8a919966",
    lineHighlight: "#8a91991a",
  },
  styles: [
    { tag: r.comment, color: "#787b8099" },
    { tag: r.string, color: "#86b300" },
    { tag: r.regexp, color: "#4cbf99" },
    { tag: [r.number, r.bool, r.null], color: "#ffaa33" },
    { tag: r.variableName, color: "#5c6166" },
    { tag: [r.definitionKeyword, r.modifier], color: "#fa8d3e" },
    { tag: [r.keyword, r.special(r.brace)], color: "#fa8d3e" },
    { tag: r.operator, color: "#ed9366" },
    { tag: r.separator, color: "#5c6166b3" },
    { tag: r.punctuation, color: "#5c6166" },
    {
      tag: [r.definition(r.propertyName), r.function(r.variableName)],
      color: "#f2ae49",
    },
    { tag: [r.className, r.definition(r.typeName)], color: "#22a4e6" },
    { tag: [r.tagName, r.typeName, r.self, r.labelName], color: "#55b4d4" },
    { tag: r.angleBracket, color: "#55b4d480" },
    { tag: r.attributeName, color: "#f2ae49" },
  ],
});
const l = createTheme({
  variant: "dark",
  settings: {
    background: "#15191EFA",
    foreground: "#EEF2F7",
    caret: "#C4C4C4",
    selection: "#90B2D557",
    gutterBackground: "#15191EFA",
    gutterForeground: "#aaaaaa95",
    lineHighlight: "#57575712",
  },
  styles: [
    { tag: r.comment, color: "#6E6E6E" },
    { tag: [r.string, r.regexp, r.special(r.brace)], color: "#5C81B3" },
    { tag: r.number, color: "#C1E1B8" },
    { tag: r.bool, color: "#53667D" },
    {
      tag: [r.definitionKeyword, r.modifier, r.function(r.propertyName)],
      color: "#A3D295",
      fontWeight: "bold",
    },
    {
      tag: [r.keyword, r.moduleKeyword, r.operatorKeyword, r.operator],
      color: "#697A8E",
      fontWeight: "bold",
    },
    { tag: [r.variableName, r.attributeName], color: "#708E67" },
    {
      tag: [
        r.function(r.variableName),
        r.definition(r.propertyName),
        r.derefOperator,
      ],
      color: "#fff",
    },
    { tag: r.tagName, color: "#A3D295" },
  ],
});
const c = createTheme({
  variant: "dark",
  settings: {
    background: "#2e241d",
    foreground: "#BAAE9E",
    caret: "#A7A7A7",
    selection: "#DDF0FF33",
    gutterBackground: "#28211C",
    gutterForeground: "#BAAE9E90",
    lineHighlight: "#FFFFFF08",
  },
  styles: [
    { tag: r.comment, color: "#666666" },
    { tag: [r.string, r.special(r.brace)], color: "#54BE0D" },
    { tag: r.regexp, color: "#E9C062" },
    { tag: r.number, color: "#CF6A4C" },
    { tag: [r.keyword, r.operator], color: "#5EA6EA" },
    { tag: r.variableName, color: "#7587A6" },
    { tag: [r.definitionKeyword, r.modifier], color: "#F9EE98" },
    { tag: [r.propertyName, r.function(r.variableName)], color: "#937121" },
    { tag: [r.typeName, r.angleBracket, r.tagName], color: "#9B859D" },
  ],
});
const n = createTheme({
  variant: "dark",
  settings: {
    background: "#3b2627",
    foreground: "#E6E1C4",
    caret: "#E6E1C4",
    selection: "#16120E",
    gutterBackground: "#3b2627",
    gutterForeground: "#E6E1C490",
    lineHighlight: "#1F1611",
  },
  styles: [
    { tag: r.comment, color: "#6B4E32" },
    { tag: [r.keyword, r.operator, r.derefOperator], color: "#EF5D32" },
    { tag: r.className, color: "#EFAC32", fontWeight: "bold" },
    {
      tag: [
        r.typeName,
        r.propertyName,
        r.function(r.variableName),
        r.definition(r.variableName),
      ],
      color: "#EFAC32",
    },
    { tag: r.definition(r.typeName), color: "#EFAC32", fontWeight: "bold" },
    { tag: r.labelName, color: "#EFAC32", fontWeight: "bold" },
    { tag: [r.number, r.bool], color: "#6C99BB" },
    { tag: [r.variableName, r.self], color: "#7DAF9C" },
    { tag: [r.string, r.special(r.brace), r.regexp], color: "#D9D762" },
    { tag: [r.angleBracket, r.tagName, r.attributeName], color: "#EFCB43" },
  ],
});
const i = createTheme({
  variant: "dark",
  settings: {
    background: "#000205",
    foreground: "#FFFFFF",
    caret: "#E60065",
    selection: "#E60C6559",
    gutterBackground: "#000205",
    gutterForeground: "#ffffff90",
    lineHighlight: "#4DD7FC1A",
  },
  styles: [
    { tag: r.comment, color: "#404040" },
    { tag: [r.string, r.special(r.brace), r.regexp], color: "#00D8FF" },
    { tag: r.number, color: "#E62286" },
    {
      tag: [r.variableName, r.attributeName, r.self],
      color: "#E62286",
      fontWeight: "bold",
    },
    { tag: r.function(r.variableName), color: "#fff", fontWeight: "bold" },
  ],
});
const d = createTheme({
  variant: "light",
  settings: {
    background: "#fff",
    foreground: "#000",
    caret: "#000",
    selection: "#BDD5FC",
    gutterBackground: "#fff",
    gutterForeground: "#00000070",
    lineHighlight: "#FFFBD1",
  },
  styles: [
    { tag: r.comment, color: "#BCC8BA" },
    { tag: [r.string, r.special(r.brace), r.regexp], color: "#5D90CD" },
    { tag: [r.number, r.bool, r.null], color: "#46A609" },
    { tag: r.keyword, color: "#AF956F" },
    { tag: [r.definitionKeyword, r.modifier], color: "#C52727" },
    { tag: [r.angleBracket, r.tagName, r.attributeName], color: "#606060" },
    { tag: r.self, color: "#000" },
  ],
});
const F = createTheme({
  variant: "dark",
  settings: {
    background: "#00254b",
    foreground: "#FFFFFF",
    caret: "#FFFFFF",
    selection: "#B36539BF",
    gutterBackground: "#00254b",
    gutterForeground: "#FFFFFF70",
    lineHighlight: "#00000059",
  },
  styles: [
    { tag: r.comment, color: "#0088FF" },
    { tag: r.string, color: "#3AD900" },
    { tag: r.regexp, color: "#80FFC2" },
    { tag: [r.number, r.bool, r.null], color: "#FF628C" },
    { tag: [r.definitionKeyword, r.modifier], color: "#FFEE80" },
    { tag: r.variableName, color: "#CCCCCC" },
    { tag: r.self, color: "#FF80E1" },
    {
      tag: [
        r.className,
        r.definition(r.propertyName),
        r.function(r.variableName),
        r.definition(r.typeName),
        r.labelName,
      ],
      color: "#FFDD00",
    },
    { tag: [r.keyword, r.operator], color: "#FF9D00" },
    { tag: [r.propertyName, r.typeName], color: "#80FFBB" },
    { tag: r.special(r.brace), color: "#EDEF7D" },
    { tag: r.attributeName, color: "#9EFFFF" },
    { tag: r.derefOperator, color: "#fff" },
  ],
});
const f = createTheme({
  variant: "dark",
  settings: {
    background: "#060521",
    foreground: "#E0E0E0",
    caret: "#FFFFFFA6",
    selection: "#122BBB",
    gutterBackground: "#060521",
    gutterForeground: "#E0E0E090",
    lineHighlight: "#FFFFFF0F",
  },
  styles: [
    { tag: r.comment, color: "#AEAEAE" },
    { tag: [r.string, r.special(r.brace), r.regexp], color: "#8DFF8E" },
    {
      tag: [
        r.className,
        r.definition(r.propertyName),
        r.function(r.variableName),
        r.function(r.definition(r.variableName)),
        r.definition(r.typeName),
      ],
      color: "#A3EBFF",
    },
    { tag: [r.number, r.bool, r.null], color: "#62E9BD" },
    { tag: [r.keyword, r.operator], color: "#2BF1DC" },
    { tag: [r.definitionKeyword, r.modifier], color: "#F8FBB1" },
    { tag: [r.variableName, r.self], color: "#B683CA" },
    {
      tag: [r.angleBracket, r.tagName, r.typeName, r.propertyName],
      color: "#60A4F1",
    },
    { tag: r.derefOperator, color: "#E0E0E0" },
    { tag: r.attributeName, color: "#7BACCA" },
  ],
});
const m = createTheme({
  variant: "dark",
  settings: {
    background: "#2d2f3f",
    foreground: "#f8f8f2",
    caret: "#f8f8f0",
    selection: "#44475a",
    gutterBackground: "#282a36",
    gutterForeground: "rgb(144, 145, 148)",
    lineHighlight: "#44475a",
  },
  styles: [
    { tag: r.comment, color: "#6272a4" },
    { tag: [r.string, r.special(r.brace)], color: "#f1fa8c" },
    { tag: [r.number, r.self, r.bool, r.null], color: "#bd93f9" },
    { tag: [r.keyword, r.operator], color: "#ff79c6" },
    { tag: [r.definitionKeyword, r.typeName], color: "#8be9fd" },
    { tag: r.definition(r.typeName), color: "#f8f8f2" },
    {
      tag: [
        r.className,
        r.definition(r.propertyName),
        r.function(r.variableName),
        r.attributeName,
      ],
      color: "#50fa7b",
    },
  ],
});
const u = createTheme({
  variant: "light",
  settings: {
    background: "#FFFFFF",
    foreground: "#000000",
    caret: "#000000",
    selection: "#80C7FF",
    gutterBackground: "#FFFFFF",
    gutterForeground: "#00000070",
    lineHighlight: "#C1E2F8",
  },
  styles: [
    { tag: r.comment, color: "#AAAAAA" },
    {
      tag: [r.keyword, r.operator, r.typeName, r.tagName, r.propertyName],
      color: "#2F6F9F",
      fontWeight: "bold",
    },
    { tag: [r.attributeName, r.definition(r.propertyName)], color: "#4F9FD0" },
    { tag: [r.className, r.string, r.special(r.brace)], color: "#CF4F5F" },
    { tag: r.number, color: "#CF4F5F", fontWeight: "bold" },
    { tag: r.variableName, fontWeight: "bold" },
  ],
});
const s = createTheme({
  variant: "light",
  settings: {
    background: "#f2f1f8",
    foreground: "#0c006b",
    caret: "#5c49e9",
    selection: "#d5d1f2",
    gutterBackground: "#f2f1f8",
    gutterForeground: "#0c006b70",
    lineHighlight: "#e1def3",
  },
  styles: [
    { tag: r.comment, color: "#9995b7" },
    { tag: r.keyword, color: "#ff5792", fontWeight: "bold" },
    { tag: [r.definitionKeyword, r.modifier], color: "#ff5792" },
    {
      tag: [r.className, r.tagName, r.definition(r.typeName)],
      color: "#0094f0",
    },
    { tag: [r.number, r.bool, r.null, r.special(r.brace)], color: "#5842ff" },
    {
      tag: [r.definition(r.propertyName), r.function(r.variableName)],
      color: "#0095a8",
    },
    { tag: r.typeName, color: "#b3694d" },
    { tag: [r.propertyName, r.variableName], color: "#fa8900" },
    { tag: r.operator, color: "#ff5792" },
    { tag: r.self, color: "#e64100" },
    { tag: [r.string, r.regexp], color: "#00b368" },
    { tag: [r.paren, r.bracket], color: "#0431fa" },
    { tag: r.labelName, color: "#00bdd6" },
    { tag: r.attributeName, color: "#e64100" },
    { tag: r.angleBracket, color: "#9995b7" },
  ],
});
const b = createTheme({
  variant: "light",
  settings: {
    background: "#faf4ed",
    foreground: "#575279",
    caret: "#575279",
    selection: "#6e6a8614",
    gutterBackground: "#faf4ed",
    gutterForeground: "#57527970",
    lineHighlight: "#6e6a860d",
  },
  styles: [
    { tag: r.comment, color: "#9893a5" },
    { tag: [r.bool, r.null], color: "#286983" },
    { tag: r.number, color: "#d7827e" },
    { tag: r.className, color: "#d7827e" },
    { tag: [r.angleBracket, r.tagName, r.typeName], color: "#56949f" },
    { tag: r.attributeName, color: "#907aa9" },
    { tag: r.punctuation, color: "#797593" },
    { tag: [r.keyword, r.modifier], color: "#286983" },
    { tag: [r.string, r.regexp], color: "#ea9d34" },
    { tag: r.variableName, color: "#d7827e" },
  ],
});
const p = createTheme({
  variant: "light",
  settings: {
    background: "#FFFFFF",
    foreground: "#000000",
    caret: "#000000",
    selection: "#FFFD0054",
    gutterBackground: "#FFFFFF",
    gutterForeground: "#00000070",
    lineHighlight: "#00000008",
  },
  styles: [
    { tag: r.comment, color: "#CFCFCF" },
    { tag: [r.number, r.bool, r.null], color: "#E66C29" },
    {
      tag: [
        r.className,
        r.definition(r.propertyName),
        r.function(r.variableName),
        r.labelName,
        r.definition(r.typeName),
      ],
      color: "#2EB43B",
    },
    { tag: r.keyword, color: "#D8B229" },
    { tag: r.operator, color: "#4EA44E", fontWeight: "bold" },
    { tag: [r.definitionKeyword, r.modifier], color: "#925A47" },
    { tag: r.string, color: "#704D3D" },
    { tag: r.typeName, color: "#2F8996" },
    { tag: [r.variableName, r.propertyName], color: "#77ACB0" },
    { tag: r.self, color: "#77ACB0", fontWeight: "bold" },
    { tag: r.regexp, color: "#E3965E" },
    { tag: [r.tagName, r.angleBracket], color: "#BAA827" },
    { tag: r.attributeName, color: "#B06520" },
    { tag: r.derefOperator, color: "#000" },
  ],
});
const N = createTheme({
  variant: "light",
  settings: {
    background: "#fef7e5",
    foreground: "#586E75",
    caret: "#000000",
    selection: "#073642",
    gutterBackground: "#fef7e5",
    gutterForeground: "#586E7580",
    lineHighlight: "#EEE8D5",
  },
  styles: [
    { tag: r.comment, color: "#93A1A1" },
    { tag: r.string, color: "#2AA198" },
    { tag: r.regexp, color: "#D30102" },
    { tag: r.number, color: "#D33682" },
    { tag: r.variableName, color: "#268BD2" },
    { tag: [r.keyword, r.operator, r.punctuation], color: "#859900" },
    {
      tag: [r.definitionKeyword, r.modifier],
      color: "#073642",
      fontWeight: "bold",
    },
    {
      tag: [r.className, r.self, r.definition(r.propertyName)],
      color: "#268BD2",
    },
    { tag: r.function(r.variableName), color: "#268BD2" },
    { tag: [r.bool, r.null], color: "#B58900" },
    { tag: r.tagName, color: "#268BD2", fontWeight: "bold" },
    { tag: r.angleBracket, color: "#93A1A1" },
    { tag: r.attributeName, color: "#93A1A1" },
    { tag: r.typeName, color: "#859900" },
  ],
});
const y = createTheme({
  variant: "light",
  settings: {
    background: "#FFFFFF",
    foreground: "#4D4D4C",
    caret: "#AEAFAD",
    selection: "#D6D6D6",
    gutterBackground: "#FFFFFF",
    gutterForeground: "#4D4D4C80",
    lineHighlight: "#EFEFEF",
  },
  styles: [
    { tag: r.comment, color: "#8E908C" },
    {
      tag: [r.variableName, r.self, r.propertyName, r.attributeName, r.regexp],
      color: "#C82829",
    },
    { tag: [r.number, r.bool, r.null], color: "#F5871F" },
    {
      tag: [r.className, r.typeName, r.definition(r.typeName)],
      color: "#C99E00",
    },
    { tag: [r.string, r.special(r.brace)], color: "#718C00" },
    { tag: r.operator, color: "#3E999F" },
    {
      tag: [r.definition(r.propertyName), r.function(r.variableName)],
      color: "#4271AE",
    },
    { tag: r.keyword, color: "#8959A8" },
    { tag: r.derefOperator, color: "#4D4D4C" },
  ],
});
export {
  a as amy,
  g as ayuLight,
  l as barf,
  c as bespin,
  n as birdsOfParadise,
  i as boysAndGirls,
  d as clouds,
  F as cobalt,
  f as coolGlow,
  createTheme,
  m as dracula,
  u as espresso,
  s as noctisLilac,
  b as rosePineDawn,
  p as smoothy,
  N as solarizedLight,
  y as tomorrow,
};
