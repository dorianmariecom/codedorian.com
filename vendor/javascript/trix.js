// trix@2.1.17 downloaded from https://ga.jspm.io/npm:trix@2.1.17/dist/trix.esm.min.js

var e = `2.1.17`;
const t = `[data-trix-attachment]`,
  n = {
    preview: { presentation: `gallery`, caption: { name: !0, size: !0 } },
    file: { caption: { size: !0 } },
  },
  r = {
    default: { tagName: `div`, parse: !1 },
    quote: { tagName: `blockquote`, nestable: !0 },
    heading1: { tagName: `h1`, terminal: !0, breakOnReturn: !0, group: !1 },
    code: {
      tagName: `pre`,
      terminal: !0,
      htmlAttributes: [`language`],
      text: { plaintext: !0 },
    },
    bulletList: { tagName: `ul`, parse: !1 },
    bullet: {
      tagName: `li`,
      listAttribute: `bulletList`,
      group: !1,
      nestable: !0,
      test(e) {
        return i(e.parentNode) === r[this.listAttribute].tagName;
      },
    },
    numberList: { tagName: `ol`, parse: !1 },
    number: {
      tagName: `li`,
      listAttribute: `numberList`,
      group: !1,
      nestable: !0,
      test(e) {
        return i(e.parentNode) === r[this.listAttribute].tagName;
      },
    },
    attachmentGallery: {
      tagName: `div`,
      exclusive: !0,
      terminal: !0,
      parse: !1,
      group: !1,
    },
  },
  i = (e) => {
    var t;
    return e == null || (t = e.tagName) == null ? void 0 : t.toLowerCase();
  },
  a = navigator.userAgent.match(/android\s([0-9]+.*Chrome)/i),
  o = a && parseInt(a[1]);
var s = {
    composesExistingText: /Android.*Chrome/.test(navigator.userAgent),
    recentAndroid: o && o > 12,
    samsungAndroid: o && navigator.userAgent.match(/Android.*SM-/),
    forcesObjectResizing: /Trident.*rv:11/.test(navigator.userAgent),
    supportsInputEvents:
      typeof InputEvent < `u` &&
      [`data`, `getTargetRanges`, `inputType`].every(
        (e) => e in InputEvent.prototype,
      ),
  },
  c = { ADD_ATTR: [`language`], SAFE_FOR_XML: !1, RETURN_DOM: !0 },
  l = {
    attachFiles: `Attach Files`,
    bold: `Bold`,
    bullets: `Bullets`,
    byte: `Byte`,
    bytes: `Bytes`,
    captionPlaceholder: `Add a caption…`,
    code: `Code`,
    heading1: `Heading`,
    indent: `Increase Level`,
    italic: `Italic`,
    link: `Link`,
    numbers: `Numbers`,
    outdent: `Decrease Level`,
    quote: `Quote`,
    redo: `Redo`,
    remove: `Remove`,
    strike: `Strikethrough`,
    undo: `Undo`,
    unlink: `Unlink`,
    url: `URL`,
    urlPlaceholder: `Enter a URL…`,
    GB: `GB`,
    KB: `KB`,
    MB: `MB`,
    PB: `PB`,
    TB: `TB`,
  };
const u = [l.bytes, l.KB, l.MB, l.GB, l.TB, l.PB];
var d = {
  prefix: `IEC`,
  precision: 2,
  formatter(e) {
    switch (e) {
      case 0:
        return `0 ${l.bytes}`;
      case 1:
        return `1 ${l.byte}`;
      default:
        let t;
        this.prefix === `SI` ? (t = 1e3) : this.prefix === `IEC` && (t = 1024);
        let n = Math.floor(Math.log(e) / Math.log(t));
        return `${(e / t ** +n).toFixed(this.precision).replace(/0*$/, ``).replace(/\.$/, ``)} ${u[n]}`;
    }
  },
};
const ee = `﻿`,
  ae = `\xA0`,
  f = function (e) {
    for (let t in e) this[t] = e[t];
    return this;
  },
  p = document.documentElement,
  oe = p.matches,
  m = function (e) {
    let {
        onElement: t,
        matchingSelector: n,
        withCallback: r,
        inPhase: i,
        preventDefault: a,
        times: o,
      } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      s = t || p,
      c = n,
      l = i === `capturing`,
      u = function (e) {
        o != null && --o == 0 && u.destroy();
        let t = g(e.target, { matchingSelector: c });
        t != null && (r?.call(t, e, t), a && e.preventDefault());
      };
    return (
      (u.destroy = () => s.removeEventListener(e, u, l)),
      s.addEventListener(e, u, l),
      u
    );
  },
  se = function (e) {
    let {
      bubbles: t,
      cancelable: n,
      attributes: r,
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    (t = !1 !== t), (n = !1 !== n);
    let i = document.createEvent(`Events`);
    return i.initEvent(e, t, n), r != null && f.call(i, r), i;
  },
  h = function (e) {
    let {
        onElement: t,
        bubbles: n,
        cancelable: r,
        attributes: i,
      } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      a = t ?? p,
      o = se(e, { bubbles: n, cancelable: r, attributes: i });
    return a.dispatchEvent(o);
  },
  ce = function (e, t) {
    if (e?.nodeType === 1) return oe.call(e, t);
  },
  g = function (e) {
    let { matchingSelector: t, untilNode: n } =
      arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    for (; e && e.nodeType !== Node.ELEMENT_NODE; ) e = e.parentNode;
    if (e != null) {
      if (t == null) return e;
      if (e.closest && n == null) return e.closest(t);
      for (; e && e !== n; ) {
        if (ce(e, t)) return e;
        e = e.parentNode;
      }
    }
  },
  le = (e) => document.activeElement !== e && _(e, document.activeElement),
  _ = function (e, t) {
    if (e && t)
      for (; t; ) {
        if (t === e) return !0;
        t = t.parentNode;
      }
  },
  ue = function (e) {
    var t;
    if ((t = e) == null || !t.parentNode) return;
    let n = 0;
    for (e = e.previousSibling; e; ) n++, (e = e.previousSibling);
    return n;
  },
  v = (e) => {
    var t;
    return e == null || (t = e.parentNode) == null ? void 0 : t.removeChild(e);
  },
  de = function (e) {
    let {
        onlyNodesOfType: t,
        usingFilter: n,
        expandEntityReferences: r,
      } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      i = (() => {
        switch (t) {
          case `element`:
            return NodeFilter.SHOW_ELEMENT;
          case `text`:
            return NodeFilter.SHOW_TEXT;
          case `comment`:
            return NodeFilter.SHOW_COMMENT;
          default:
            return NodeFilter.SHOW_ALL;
        }
      })();
    return document.createTreeWalker(e, i, n ?? null, !0 === r);
  },
  y = (e) => {
    var t;
    return e == null || (t = e.tagName) == null ? void 0 : t.toLowerCase();
  },
  b = function (e) {
    let t,
      n,
      r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    typeof e == `object` ? ((r = e), (e = r.tagName)) : (r = { attributes: r });
    let i = document.createElement(e);
    if (
      (r.editable != null &&
        ((r.attributes ??= {}), (r.attributes.contenteditable = r.editable)),
      r.attributes)
    )
      for (t in r.attributes) (n = r.attributes[t]), i.setAttribute(t, n);
    if (r.style) for (t in r.style) (n = r.style[t]), (i.style[t] = n);
    if (r.data) for (t in r.data) (n = r.data[t]), (i.dataset[t] = n);
    return (
      r.className &&
        r.className.split(` `).forEach((e) => {
          i.classList.add(e);
        }),
      r.textContent && (i.textContent = r.textContent),
      r.childNodes &&
        [].concat(r.childNodes).forEach((e) => {
          i.appendChild(e);
        }),
      i
    );
  };
let fe;
const pe = function () {
    if (fe != null) return fe;
    fe = [];
    for (let e in r) {
      let t = r[e];
      t.tagName && fe.push(t.tagName);
    }
    return fe;
  },
  me = (e) => ge(e?.firstChild),
  he = function (e) {
    let { strict: t } =
      arguments.length > 1 && arguments[1] !== void 0
        ? arguments[1]
        : { strict: !0 };
    return t
      ? ge(e)
      : ge(e) ||
          (!ge(e.firstChild) &&
            (function (e) {
              return pe().includes(y(e)) && !pe().includes(y(e.firstChild));
            })(e));
  },
  ge = (e) => _e(e) && e?.data === `block`,
  _e = (e) => e?.nodeType === Node.COMMENT_NODE,
  ve = function (e) {
    let { name: t } =
      arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (e)
      return x(e)
        ? e.data === `﻿`
          ? !t || e.parentNode.dataset.trixCursorTarget === t
          : void 0
        : ve(e.firstChild);
  },
  ye = (e) => ce(e, t),
  be = (e) => x(e) && e?.data === ``,
  x = (e) => e?.nodeType === Node.TEXT_NODE,
  xe = {
    level2Enabled: !0,
    getLevel() {
      return this.level2Enabled && s.supportsInputEvents ? 2 : 0;
    },
    pickFiles(e) {
      let t = b(`input`, {
        type: `file`,
        multiple: !0,
        hidden: !0,
        id: this.fileInputId,
      });
      t.addEventListener(`change`, () => {
        e(t.files), v(t);
      }),
        v(document.getElementById(this.fileInputId)),
        document.body.appendChild(t),
        t.click();
    },
  };
var S = {
    removeBlankTableCells: !1,
    tableCellSeparator: ` | `,
    tableRowSeparator: `
`,
  },
  C = {
    bold: {
      tagName: `strong`,
      inheritable: !0,
      parser(e) {
        let t = window.getComputedStyle(e);
        return t.fontWeight === `bold` || t.fontWeight >= 600;
      },
    },
    italic: {
      tagName: `em`,
      inheritable: !0,
      parser: (e) => window.getComputedStyle(e).fontStyle === `italic`,
    },
    href: {
      groupTagName: `a`,
      parser(e) {
        let n = `a:not(${t})`,
          r = e.closest(n);
        if (r) return r.getAttribute(`href`);
      },
    },
    strike: { tagName: `del`, inheritable: !0 },
    frozen: { style: { backgroundColor: `highlight` } },
  },
  w = {
    getDefaultHTML: () => `<div class="trix-button-row">
      <span class="trix-button-group trix-button-group--text-tools" data-trix-button-group="text-tools">
        <button type="button" class="trix-button trix-button--icon trix-button--icon-bold" data-trix-attribute="bold" data-trix-key="b" title="${l.bold}" tabindex="-1">${l.bold}</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-italic" data-trix-attribute="italic" data-trix-key="i" title="${l.italic}" tabindex="-1">${l.italic}</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-strike" data-trix-attribute="strike" title="${l.strike}" tabindex="-1">${l.strike}</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-link" data-trix-attribute="href" data-trix-action="link" data-trix-key="k" title="${l.link}" tabindex="-1">${l.link}</button>
      </span>

      <span class="trix-button-group trix-button-group--block-tools" data-trix-button-group="block-tools">
        <button type="button" class="trix-button trix-button--icon trix-button--icon-heading-1" data-trix-attribute="heading1" title="${l.heading1}" tabindex="-1">${l.heading1}</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-quote" data-trix-attribute="quote" title="${l.quote}" tabindex="-1">${l.quote}</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-code" data-trix-attribute="code" title="${l.code}" tabindex="-1">${l.code}</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-bullet-list" data-trix-attribute="bullet" title="${l.bullets}" tabindex="-1">${l.bullets}</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-number-list" data-trix-attribute="number" title="${l.numbers}" tabindex="-1">${l.numbers}</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-decrease-nesting-level" data-trix-action="decreaseNestingLevel" title="${l.outdent}" tabindex="-1">${l.outdent}</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-increase-nesting-level" data-trix-action="increaseNestingLevel" title="${l.indent}" tabindex="-1">${l.indent}</button>
      </span>

      <span class="trix-button-group trix-button-group--file-tools" data-trix-button-group="file-tools">
        <button type="button" class="trix-button trix-button--icon trix-button--icon-attach" data-trix-action="attachFiles" title="${l.attachFiles}" tabindex="-1">${l.attachFiles}</button>
      </span>

      <span class="trix-button-group-spacer"></span>

      <span class="trix-button-group trix-button-group--history-tools" data-trix-button-group="history-tools">
        <button type="button" class="trix-button trix-button--icon trix-button--icon-undo" data-trix-action="undo" data-trix-key="z" title="${l.undo}" tabindex="-1">${l.undo}</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-redo" data-trix-action="redo" data-trix-key="shift+z" title="${l.redo}" tabindex="-1">${l.redo}</button>
      </span>
    </div>

    <div class="trix-dialogs" data-trix-dialogs>
      <div class="trix-dialog trix-dialog--link" data-trix-dialog="href" data-trix-dialog-attribute="href">
        <div class="trix-dialog__link-fields">
          <input type="url" name="href" class="trix-input trix-input--dialog" placeholder="${l.urlPlaceholder}" aria-label="${l.url}" data-trix-validate-href required data-trix-input>
          <div class="trix-button-group">
            <input type="button" class="trix-button trix-button--dialog" value="${l.link}" data-trix-method="setAttribute">
            <input type="button" class="trix-button trix-button--dialog" value="${l.unlink}" data-trix-method="removeAttribute">
          </div>
        </div>
      </div>
    </div>`,
  };
const T = { interval: 5e3 };
var E = Object.freeze({
  __proto__: null,
  attachments: n,
  blockAttributes: r,
  browser: s,
  css: {
    attachment: `attachment`,
    attachmentCaption: `attachment__caption`,
    attachmentCaptionEditor: `attachment__caption-editor`,
    attachmentMetadata: `attachment__metadata`,
    attachmentMetadataContainer: `attachment__metadata-container`,
    attachmentName: `attachment__name`,
    attachmentProgress: `attachment__progress`,
    attachmentSize: `attachment__size`,
    attachmentToolbar: `attachment__toolbar`,
    attachmentGallery: `attachment-gallery`,
  },
  dompurify: c,
  fileSize: d,
  input: xe,
  keyNames: {
    8: `backspace`,
    9: `tab`,
    13: `return`,
    27: `escape`,
    37: `left`,
    39: `right`,
    46: `delete`,
    68: `d`,
    72: `h`,
    79: `o`,
  },
  lang: l,
  parser: S,
  textAttributes: C,
  toolbar: w,
  undo: T,
});
class H {
  static proxyMethod(e) {
    let { name: t, toMethod: n, toProperty: r, optional: i } = Se(e);
    this.prototype[t] = function () {
      let e, a;
      var o, s;
      return (
        n
          ? (a = i ? (o = this[n])?.call(this) : this[n]())
          : r && (a = this[r]),
        i
          ? ((e = (s = a)?.[t]), e ? Ce.call(e, a, arguments) : void 0)
          : ((e = a[t]), Ce.call(e, a, arguments))
      );
    };
  }
}
const Se = function (e) {
    let t = e.match(we);
    if (!t) throw Error(`can't parse @proxyMethod expression: ${e}`);
    let n = { name: t[4] };
    return (
      t[2] == null ? (n.toProperty = t[1]) : (n.toMethod = t[1]),
      t[3] != null && (n.optional = !0),
      n
    );
  },
  { apply: Ce } = Function.prototype,
  we = /* @__PURE__ */ RegExp(`^(.+?)(\\(\\))?(\\?)?\\.(.+?)$`);
var Te, Ee, De;
class Z extends H {
  static box() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ``;
    return e instanceof this ? e : this.fromUCS2String(e?.toString());
  }
  static fromUCS2String(e) {
    return new this(e, O(e));
  }
  static fromCodepoints(e) {
    return new this(Ae(e), e);
  }
  constructor(e, t) {
    super(...arguments),
      (this.ucs2String = e),
      (this.codepoints = t),
      (this.length = this.codepoints.length),
      (this.ucs2Length = this.ucs2String.length);
  }
  offsetToUCS2Offset(e) {
    return Ae(this.codepoints.slice(0, Math.max(0, e))).length;
  }
  offsetFromUCS2Offset(e) {
    return O(this.ucs2String.slice(0, Math.max(0, e))).length;
  }
  slice() {
    return this.constructor.fromCodepoints(this.codepoints.slice(...arguments));
  }
  charAt(e) {
    return this.slice(e, e + 1);
  }
  isEqualTo(e) {
    return this.constructor.box(e).ucs2String === this.ucs2String;
  }
  toJSON() {
    return this.ucs2String;
  }
  getCacheKey() {
    return this.ucs2String;
  }
  toString() {
    return this.ucs2String;
  }
}
const D = (Te = Array.from)?.call(Array, `👼`).length === 1,
  Oe = (Ee = ` `.codePointAt)?.call(` `, 0) != null,
  ke = (De = String.fromCodePoint)?.call(String, 32, 128124) === ` 👼`;
let O, Ae;
(O =
  D && Oe
    ? (e) => Array.from(e).map((e) => e.codePointAt(0))
    : function (e) {
        let t = [],
          n = 0,
          { length: r } = e;
        for (; n < r; ) {
          let i = e.charCodeAt(n++);
          if (55296 <= i && i <= 56319 && n < r) {
            let t = e.charCodeAt(n++);
            (64512 & t) == 56320
              ? (i = ((1023 & i) << 10) + (1023 & t) + 65536)
              : n--;
          }
          t.push(i);
        }
        return t;
      }),
  (Ae = ke
    ? (e) => String.fromCodePoint(...Array.from(e || []))
    : function (e) {
        return (() => {
          let t = [];
          return (
            Array.from(e).forEach((e) => {
              let n = ``;
              e > 65535 &&
                ((e -= 65536),
                (n += String.fromCharCode(((e >>> 10) & 1023) | 55296)),
                (e = 56320 | (1023 & e))),
                t.push(n + String.fromCharCode(e));
            }),
            t
          );
        })().join(``);
      });
let je = 0;
class ot extends H {
  static fromJSONString(e) {
    return this.fromJSON(JSON.parse(e));
  }
  constructor() {
    super(...arguments), (this.id = ++je);
  }
  hasSameConstructorAs(e) {
    return this.constructor === e?.constructor;
  }
  isEqualTo(e) {
    return this === e;
  }
  inspect() {
    let e = [],
      t = this.contentsForInspection() || {};
    for (let n in t) {
      let r = t[n];
      e.push(`${n}=${r}`);
    }
    return `#<${this.constructor.name}:${this.id}${e.length ? ` ${e.join(`, `)}` : ``}>`;
  }
  contentsForInspection() {}
  toJSONString() {
    return JSON.stringify(this);
  }
  toUTF16String() {
    return Z.box(this);
  }
  getCacheKey() {
    return this.id.toString();
  }
}
const k = function () {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [],
      t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    if (e.length !== t.length) return !1;
    for (let n = 0; n < e.length; n++) if (e[n] !== t[n]) return !1;
    return !0;
  },
  Me = function (e) {
    let t = e.slice(0);
    var n = [...arguments].slice(1);
    return t.splice(...n), t;
  },
  Ne =
    /[\u05BE\u05C0\u05C3\u05D0-\u05EA\u05F0-\u05F4\u061B\u061F\u0621-\u063A\u0640-\u064A\u066D\u0671-\u06B7\u06BA-\u06BE\u06C0-\u06CE\u06D0-\u06D5\u06E5\u06E6\u200F\u202B\u202E\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE72\uFE74\uFE76-\uFEFC]/,
  Pe = (function () {
    let e = b(`input`, { dir: `auto`, name: `x`, dirName: `x.dir` }),
      t = b(`textarea`, { dir: `auto`, name: `y`, dirName: `y.dir` }),
      n = b(`form`);
    n.appendChild(e), n.appendChild(t);
    let r = (function () {
        try {
          return new FormData(n).has(t.dirName);
        } catch {
          return !1;
        }
      })(),
      i = (function () {
        try {
          return e.matches(`:dir(ltr),:dir(rtl)`);
        } catch {
          return !1;
        }
      })();
    return r
      ? function (e) {
          return (t.value = e), new FormData(n).get(t.dirName);
        }
      : i
        ? function (t) {
            return (e.value = t), e.matches(`:dir(rtl)`) ? `rtl` : `ltr`;
          }
        : function (e) {
            let t = e.trim().charAt(0);
            return Ne.test(t) ? `rtl` : `ltr`;
          };
  })();
let A = null,
  j = null,
  Fe = null,
  Ie = null;
const Le = () => ((A ||= Be().concat(Re())), A),
  M = (e) => r[e],
  Re = () => ((j ||= Object.keys(r)), j),
  ze = (e) => C[e],
  Be = () => ((Fe ||= Object.keys(C)), Fe),
  N = function (e, t) {
    Ve(e).textContent = t.replace(/%t/g, e);
  },
  Ve = function (e) {
    let t = document.createElement(`style`);
    t.setAttribute(`type`, `text/css`),
      t.setAttribute(`data-tag-name`, e.toLowerCase());
    let n = He();
    return (
      n && t.setAttribute(`nonce`, n),
      document.head.insertBefore(t, document.head.firstChild),
      t
    );
  },
  He = function () {
    let e = Ue(`trix-csp-nonce`) || Ue(`csp-nonce`);
    if (e) {
      let { nonce: t, content: n } = e;
      return t == `` ? n : t;
    }
  },
  Ue = (e) => document.head.querySelector(`meta[name=${e}]`),
  We = { "application/x-trix-feature-detection": `test` },
  Ge = function (e) {
    let t = e.getData(`text/plain`),
      n = e.getData(`text/html`);
    if (!t || !n) return t?.length;
    {
      let { body: e } = new DOMParser().parseFromString(n, `text/html`);
      if (e.textContent === t) return !e.querySelector(`*`);
    }
  },
  Ke = /Mac|^iP/.test(navigator.platform) ? (e) => e.metaKey : (e) => e.ctrlKey,
  qe = (e) => setTimeout(e, 1),
  Je = function () {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
      t = {};
    for (let n in e) t[n] = e[n];
    return t;
  },
  Ye = function () {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
      t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (Object.keys(e).length !== Object.keys(t).length) return !1;
    for (let n in e) if (e[n] !== t[n]) return !1;
    return !0;
  },
  P = function (e) {
    if (e != null)
      return (
        Array.isArray(e) || (e = [e, e]),
        [Ze(e[0]), Ze(e[1] == null ? e[0] : e[1])]
      );
  },
  F = function (e) {
    if (e == null) return;
    let [t, n] = P(e);
    return Qe(t, n);
  },
  Xe = function (e, t) {
    if (e == null || t == null) return;
    let [n, r] = P(e),
      [i, a] = P(t);
    return Qe(n, i) && Qe(r, a);
  },
  Ze = function (e) {
    return typeof e == `number` ? e : Je(e);
  },
  Qe = function (e, t) {
    return typeof e == `number` ? e === t : Ye(e, t);
  };
class Ft extends H {
  constructor() {
    super(...arguments),
      (this.update = this.update.bind(this)),
      (this.selectionManagers = []);
  }
  start() {
    this.started ||
      ((this.started = !0),
      document.addEventListener(`selectionchange`, this.update, !0));
  }
  stop() {
    if (this.started)
      return (
        (this.started = !1),
        document.removeEventListener(`selectionchange`, this.update, !0)
      );
  }
  registerSelectionManager(e) {
    if (!this.selectionManagers.includes(e))
      return this.selectionManagers.push(e), this.start();
  }
  unregisterSelectionManager(e) {
    if (
      ((this.selectionManagers = this.selectionManagers.filter((t) => t !== e)),
      this.selectionManagers.length === 0)
    )
      return this.stop();
  }
  notifySelectionManagersOfSelectionChange() {
    return this.selectionManagers.map((e) => e.selectionDidChange());
  }
  update() {
    this.notifySelectionManagersOfSelectionChange();
  }
  reset() {
    this.update();
  }
}
const I = new Ft(),
  $e = function () {
    let e = window.getSelection();
    if (e.rangeCount > 0) return e;
  },
  L = function () {
    var e;
    let t = (e = $e())?.getRangeAt(0);
    if (t && !et(t)) return t;
  },
  R = function (e) {
    let t = window.getSelection();
    return t.removeAllRanges(), t.addRange(e), I.update();
  },
  et = (e) => tt(e.startContainer) || tt(e.endContainer),
  tt = (e) => !Object.getPrototypeOf(e),
  z = (e) => e.replace(RegExp(`﻿`, `g`), ``).replace(RegExp(`\xA0`, `g`), ` `),
  nt = RegExp(`[^\\S\xA0]`),
  B = (e) =>
    e.replace(RegExp(`${nt.source}`, `g`), ` `).replace(/\ {2,}/g, ` `),
  rt = function (e, t) {
    if (e.isEqualTo(t)) return [``, ``];
    let n = it(e, t),
      { length: r } = n.utf16String,
      i;
    if (r) {
      let { offset: a } = n,
        o = e.codepoints.slice(0, a).concat(e.codepoints.slice(a + r));
      i = it(t, Z.fromCodepoints(o));
    } else i = it(t, e);
    return [n.utf16String.toString(), i.utf16String.toString()];
  },
  it = function (e, t) {
    let n = 0,
      r = e.length,
      i = t.length;
    for (; n < r && e.charAt(n).isEqualTo(t.charAt(n)); ) n++;
    for (; r > n + 1 && e.charAt(r - 1).isEqualTo(t.charAt(i - 1)); ) r--, i--;
    return { utf16String: e.slice(n, r), offset: n };
  };
class Jt extends ot {
  static fromCommonAttributesOfObjects() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    if (!e.length) return new this();
    let t = lt(e[0]),
      n = t.getKeys();
    return (
      e.slice(1).forEach((e) => {
        (n = t.getKeysCommonToHash(lt(e))), (t = t.slice(n));
      }),
      t
    );
  }
  static box(e) {
    return lt(e);
  }
  constructor() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    super(...arguments), (this.values = ct(e));
  }
  add(e, t) {
    return this.merge(at(e, t));
  }
  remove(e) {
    return new Jt(ct(this.values, e));
  }
  get(e) {
    return this.values[e];
  }
  has(e) {
    return e in this.values;
  }
  merge(e) {
    return new Jt(st(this.values, ut(e)));
  }
  slice(e) {
    let t = {};
    return (
      Array.from(e).forEach((e) => {
        this.has(e) && (t[e] = this.values[e]);
      }),
      new Jt(t)
    );
  }
  getKeys() {
    return Object.keys(this.values);
  }
  getKeysCommonToHash(e) {
    return (
      (e = lt(e)), this.getKeys().filter((t) => this.values[t] === e.values[t])
    );
  }
  isEqualTo(e) {
    return k(this.toArray(), lt(e).toArray());
  }
  isEmpty() {
    return this.getKeys().length === 0;
  }
  toArray() {
    if (!this.array) {
      let e = [];
      for (let t in this.values) {
        let n = this.values[t];
        e.push(e.push(t, n));
      }
      this.array = e.slice(0);
    }
    return this.array;
  }
  toObject() {
    return ct(this.values);
  }
  toJSON() {
    return this.toObject();
  }
  contentsForInspection() {
    return { values: JSON.stringify(this.values) };
  }
}
const at = function (e, t) {
    let n = {};
    return (n[e] = t), n;
  },
  st = function (e, t) {
    let n = ct(e);
    for (let e in t) n[e] = t[e];
    return n;
  },
  ct = function (e, t) {
    let n = {};
    return (
      Object.keys(e)
        .sort()
        .forEach((r) => {
          r !== t && (n[r] = e[r]);
        }),
      n
    );
  },
  lt = function (e) {
    return e instanceof Jt ? e : new Jt(e);
  },
  ut = function (e) {
    return e instanceof Jt ? e.values : e;
  };
class Zt {
  static groupObjects() {
    let e,
      t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [],
      { depth: n, asTree: r } =
        arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    r && n == null && (n = 0);
    let i = [];
    return (
      Array.from(t).forEach((t) => {
        var a;
        if (e) {
          var o, s, c;
          if (
            (o = t.canBeGrouped) != null &&
            o.call(t, n) &&
            (s = (c = e[e.length - 1]).canBeGroupedWith) != null &&
            s.call(c, t, n)
          )
            return void e.push(t);
          i.push(new this(e, { depth: n, asTree: r })), (e = null);
        }
        (a = t.canBeGrouped) != null && a.call(t, n) ? (e = [t]) : i.push(t);
      }),
      e && i.push(new this(e, { depth: n, asTree: r })),
      i
    );
  }
  constructor() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [],
      { depth: t, asTree: n } = arguments.length > 1 ? arguments[1] : void 0;
    (this.objects = e),
      n &&
        ((this.depth = t),
        (this.objects = this.constructor.groupObjects(this.objects, {
          asTree: n,
          depth: this.depth + 1,
        })));
  }
  getObjects() {
    return this.objects;
  }
  getDepth() {
    return this.depth;
  }
  getCacheKey() {
    let e = [`objectGroup`];
    return (
      Array.from(this.getObjects()).forEach((t) => {
        e.push(t.getCacheKey());
      }),
      e.join(`/`)
    );
  }
}
class Qt extends H {
  constructor() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    super(...arguments),
      (this.objects = {}),
      Array.from(e).forEach((e) => {
        let t = JSON.stringify(e);
        this.objects[t] ?? (this.objects[t] = e);
      });
  }
  find(e) {
    let t = JSON.stringify(e);
    return this.objects[t];
  }
}
class te {
  constructor(e) {
    this.reset(e);
  }
  add(e) {
    let t = dt(e);
    this.elements[t] = e;
  }
  remove(e) {
    let t = dt(e),
      n = this.elements[t];
    if (n) return delete this.elements[t], n;
  }
  reset() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    return (
      (this.elements = {}),
      Array.from(e).forEach((e) => {
        this.add(e);
      }),
      e
    );
  }
}
const dt = (e) => e.dataset.trixStoreKey;
class ie extends H {
  isPerforming() {
    return !0 === this.performing;
  }
  hasPerformed() {
    return !0 === this.performed;
  }
  hasSucceeded() {
    return this.performed && this.succeeded;
  }
  hasFailed() {
    return this.performed && !this.succeeded;
  }
  getPromise() {
    return (
      (this.promise ||= new Promise(
        (e, t) => (
          (this.performing = !0),
          this.perform((n, r) => {
            (this.succeeded = n),
              (this.performing = !1),
              (this.performed = !0),
              this.succeeded ? e(r) : t(r);
          })
        ),
      )),
      this.promise
    );
  }
  perform(e) {
    return e(!1);
  }
  release() {
    var e, t;
    (e = this.promise) == null || (t = e.cancel) == null || t.call(e),
      (this.promise = null),
      (this.performing = null),
      (this.performed = null),
      (this.succeeded = null);
  }
}
ie.proxyMethod(`getPromise().then`), ie.proxyMethod(`getPromise().catch`);
class ne extends H {
  constructor(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super(...arguments),
      (this.object = e),
      (this.options = t),
      (this.childViews = []),
      (this.rootView = this);
  }
  getNodes() {
    return (
      (this.nodes ||= this.createNodes()),
      this.nodes.map((e) => e.cloneNode(!0))
    );
  }
  invalidate() {
    var e;
    return (
      (this.nodes = null),
      (this.childViews = []),
      (e = this.parentView)?.invalidate()
    );
  }
  invalidateViewForObject(e) {
    var t;
    return (t = this.findViewForObject(e))?.invalidate();
  }
  findOrCreateCachedChildView(e, t, n) {
    let r = this.getCachedViewForObject(t);
    return (
      r
        ? this.recordChildView(r)
        : ((r = this.createChildView(...arguments)),
          this.cacheViewForObject(r, t)),
      r
    );
  }
  createChildView(e, t) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    t instanceof Zt && ((n.viewClass = e), (e = re));
    let r = new e(t, n);
    return this.recordChildView(r);
  }
  recordChildView(e) {
    return (
      (e.parentView = this),
      (e.rootView = this.rootView),
      this.childViews.push(e),
      e
    );
  }
  getAllChildViews() {
    let e = [];
    return (
      this.childViews.forEach((t) => {
        e.push(t), (e = e.concat(t.getAllChildViews()));
      }),
      e
    );
  }
  findElement() {
    return this.findElementForObject(this.object);
  }
  findElementForObject(e) {
    let t = e?.id;
    if (t) return this.rootView.element.querySelector(`[data-trix-id='${t}']`);
  }
  findViewForObject(e) {
    for (let t of this.getAllChildViews()) if (t.object === e) return t;
  }
  getViewCache() {
    return this.rootView === this
      ? this.isViewCachingEnabled()
        ? ((this.viewCache ||= {}), this.viewCache)
        : void 0
      : this.rootView.getViewCache();
  }
  isViewCachingEnabled() {
    return !1 !== this.shouldCacheViews;
  }
  enableViewCaching() {
    this.shouldCacheViews = !0;
  }
  disableViewCaching() {
    this.shouldCacheViews = !1;
  }
  getCachedViewForObject(e) {
    var t;
    return (t = this.getViewCache())?.[e.getCacheKey()];
  }
  cacheViewForObject(e, t) {
    let n = this.getViewCache();
    n && (n[t.getCacheKey()] = e);
  }
  garbageCollectCachedViews() {
    let e = this.getViewCache();
    if (e) {
      let t = this.getAllChildViews()
        .concat(this)
        .map((e) => e.object.getCacheKey());
      for (let n in e) t.includes(n) || delete e[n];
    }
  }
}
class re extends ne {
  constructor() {
    super(...arguments),
      (this.objectGroup = this.object),
      (this.viewClass = this.options.viewClass),
      delete this.options.viewClass;
  }
  getChildViews() {
    return (
      this.childViews.length ||
        Array.from(this.objectGroup.getObjects()).forEach((e) => {
          this.findOrCreateCachedChildView(this.viewClass, e, this.options);
        }),
      this.childViews
    );
  }
  createNodes() {
    let e = this.createContainerElement();
    return (
      this.getChildViews().forEach((t) => {
        Array.from(t.getNodes()).forEach((t) => {
          e.appendChild(t);
        });
      }),
      [e]
    );
  }
  createContainerElement() {
    let e =
      arguments.length > 0 && arguments[0] !== void 0
        ? arguments[0]
        : this.objectGroup.getDepth();
    return this.getChildViews()[0].createContainerElement(e);
  }
}
/*! @license DOMPurify 3.2.7 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.7/LICENSE */ const {
  entries: ft,
  setPrototypeOf: pt,
  isFrozen: mt,
  getPrototypeOf: ht,
  getOwnPropertyDescriptor: gt,
} = Object;
let { freeze: V, seal: U, create: _t } = Object,
  { apply: vt, construct: yt } = typeof Reflect < `u` && Reflect;
(V ||= function (e) {
  return e;
}),
  (U ||= function (e) {
    return e;
  }),
  (vt ||= function (e, t) {
    var n = [...arguments].slice(2);
    return e.apply(t, n);
  }),
  (yt ||= function (e) {
    return new e(...[...arguments].slice(1));
  });
const bt = K(Array.prototype.forEach),
  xt = K(Array.prototype.lastIndexOf),
  St = K(Array.prototype.pop),
  Ct = K(Array.prototype.push),
  wt = K(Array.prototype.splice),
  Tt = K(String.prototype.toLowerCase),
  Et = K(String.prototype.toString),
  Dt = K(String.prototype.match),
  Ot = K(String.prototype.replace),
  kt = K(String.prototype.indexOf),
  At = K(String.prototype.trim),
  W = K(Object.prototype.hasOwnProperty),
  G = K(RegExp.prototype.test),
  jt =
    ((Mt = TypeError),
    function () {
      return yt(Mt, [...arguments]);
    });
var Mt;
function K(e) {
  return function (t) {
    t instanceof RegExp && (t.lastIndex = 0);
    var n = [...arguments].slice(1);
    return vt(e, t, n);
  };
}
function q(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Tt;
  pt && pt(e, null);
  let r = t.length;
  for (; r--; ) {
    let i = t[r];
    if (typeof i == `string`) {
      let e = n(i);
      e !== i && (mt(t) || (t[r] = e), (i = e));
    }
    e[i] = !0;
  }
  return e;
}
function Nt(e) {
  for (let t = 0; t < e.length; t++) W(e, t) || (e[t] = null);
  return e;
}
function J(e) {
  let t = _t(null);
  for (let [n, r] of ft(e))
    W(e, n) &&
      (Array.isArray(r)
        ? (t[n] = Nt(r))
        : r && typeof r == `object` && r.constructor === Object
          ? (t[n] = J(r))
          : (t[n] = r));
  return t;
}
function Pt(e, t) {
  for (; e !== null; ) {
    let n = gt(e, t);
    if (n) {
      if (n.get) return K(n.get);
      if (typeof n.value == `function`) return K(n.value);
    }
    e = ht(e);
  }
  return function () {
    return null;
  };
}
const It = V(
    /* @__PURE__ */ `a.abbr.acronym.address.area.article.aside.audio.b.bdi.bdo.big.blink.blockquote.body.br.button.canvas.caption.center.cite.code.col.colgroup.content.data.datalist.dd.decorator.del.details.dfn.dialog.dir.div.dl.dt.element.em.fieldset.figcaption.figure.font.footer.form.h1.h2.h3.h4.h5.h6.head.header.hgroup.hr.html.i.img.input.ins.kbd.label.legend.li.main.map.mark.marquee.menu.menuitem.meter.nav.nobr.ol.optgroup.option.output.p.picture.pre.progress.q.rp.rt.ruby.s.samp.search.section.select.shadow.slot.small.source.spacer.span.strike.strong.style.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.time.tr.track.tt.u.ul.var.video.wbr`.split(
      `.`,
    ),
  ),
  Lt = V(
    /* @__PURE__ */ `svg.a.altglyph.altglyphdef.altglyphitem.animatecolor.animatemotion.animatetransform.circle.clippath.defs.desc.ellipse.enterkeyhint.exportparts.filter.font.g.glyph.glyphref.hkern.image.inputmode.line.lineargradient.marker.mask.metadata.mpath.part.path.pattern.polygon.polyline.radialgradient.rect.slot.stop.style.switch.symbol.text.textpath.title.tref.tspan.view.vkern`.split(
      `.`,
    ),
  ),
  Rt = V([
    `feBlend`,
    `feColorMatrix`,
    `feComponentTransfer`,
    `feComposite`,
    `feConvolveMatrix`,
    `feDiffuseLighting`,
    `feDisplacementMap`,
    `feDistantLight`,
    `feDropShadow`,
    `feFlood`,
    `feFuncA`,
    `feFuncB`,
    `feFuncG`,
    `feFuncR`,
    `feGaussianBlur`,
    `feImage`,
    `feMerge`,
    `feMergeNode`,
    `feMorphology`,
    `feOffset`,
    `fePointLight`,
    `feSpecularLighting`,
    `feSpotLight`,
    `feTile`,
    `feTurbulence`,
  ]),
  zt = V([
    `animate`,
    `color-profile`,
    `cursor`,
    `discard`,
    `font-face`,
    `font-face-format`,
    `font-face-name`,
    `font-face-src`,
    `font-face-uri`,
    `foreignobject`,
    `hatch`,
    `hatchpath`,
    `mesh`,
    `meshgradient`,
    `meshpatch`,
    `meshrow`,
    `missing-glyph`,
    `script`,
    `set`,
    `solidcolor`,
    `unknown`,
    `use`,
  ]),
  Bt = V(
    /* @__PURE__ */ `math.menclose.merror.mfenced.mfrac.mglyph.mi.mlabeledtr.mmultiscripts.mn.mo.mover.mpadded.mphantom.mroot.mrow.ms.mspace.msqrt.mstyle.msub.msup.msubsup.mtable.mtd.mtext.mtr.munder.munderover.mprescripts`.split(
      `.`,
    ),
  ),
  Vt = V([
    `maction`,
    `maligngroup`,
    `malignmark`,
    `mlongdiv`,
    `mscarries`,
    `mscarry`,
    `msgroup`,
    `mstack`,
    `msline`,
    `msrow`,
    `semantics`,
    `annotation`,
    `annotation-xml`,
    `mprescripts`,
    `none`,
  ]),
  Ht = V([`#text`]),
  Ut = V(
    /* @__PURE__ */ `accept.action.align.alt.autocapitalize.autocomplete.autopictureinpicture.autoplay.background.bgcolor.border.capture.cellpadding.cellspacing.checked.cite.class.clear.color.cols.colspan.controls.controlslist.coords.crossorigin.datetime.decoding.default.dir.disabled.disablepictureinpicture.disableremoteplayback.download.draggable.enctype.enterkeyhint.exportparts.face.for.headers.height.hidden.high.href.hreflang.id.inert.inputmode.integrity.ismap.kind.label.lang.list.loading.loop.low.max.maxlength.media.method.min.minlength.multiple.muted.name.nonce.noshade.novalidate.nowrap.open.optimum.part.pattern.placeholder.playsinline.popover.popovertarget.popovertargetaction.poster.preload.pubdate.radiogroup.readonly.rel.required.rev.reversed.role.rows.rowspan.spellcheck.scope.selected.shape.size.sizes.slot.span.srclang.start.src.srcset.step.style.summary.tabindex.title.translate.type.usemap.valign.value.width.wrap.xmlns.slot`.split(
      `.`,
    ),
  ),
  Wt = V(
    /* @__PURE__ */ `accent-height.accumulate.additive.alignment-baseline.amplitude.ascent.attributename.attributetype.azimuth.basefrequency.baseline-shift.begin.bias.by.class.clip.clippathunits.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.cx.cy.d.dx.dy.diffuseconstant.direction.display.divisor.dur.edgemode.elevation.end.exponent.fill.fill-opacity.fill-rule.filter.filterunits.flood-color.flood-opacity.font-family.font-size.font-size-adjust.font-stretch.font-style.font-variant.font-weight.fx.fy.g1.g2.glyph-name.glyphref.gradientunits.gradienttransform.height.href.id.image-rendering.in.in2.intercept.k.k1.k2.k3.k4.kerning.keypoints.keysplines.keytimes.lang.lengthadjust.letter-spacing.kernelmatrix.kernelunitlength.lighting-color.local.marker-end.marker-mid.marker-start.markerheight.markerunits.markerwidth.maskcontentunits.maskunits.max.mask.media.method.mode.min.name.numoctaves.offset.operator.opacity.order.orient.orientation.origin.overflow.paint-order.path.pathlength.patterncontentunits.patterntransform.patternunits.points.preservealpha.preserveaspectratio.primitiveunits.r.rx.ry.radius.refx.refy.repeatcount.repeatdur.restart.result.rotate.scale.seed.shape-rendering.slope.specularconstant.specularexponent.spreadmethod.startoffset.stddeviation.stitchtiles.stop-color.stop-opacity.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke.stroke-width.style.surfacescale.systemlanguage.tabindex.tablevalues.targetx.targety.transform.transform-origin.text-anchor.text-decoration.text-rendering.textlength.type.u1.u2.unicode.values.viewbox.visibility.version.vert-adv-y.vert-origin-x.vert-origin-y.width.word-spacing.wrap.writing-mode.xchannelselector.ychannelselector.x.x1.x2.xmlns.y.y1.y2.z.zoomandpan`.split(
      `.`,
    ),
  ),
  Gt = V(
    /* @__PURE__ */ `accent.accentunder.align.bevelled.close.columnsalign.columnlines.columnspan.denomalign.depth.dir.display.displaystyle.encoding.fence.frame.height.href.id.largeop.length.linethickness.lspace.lquote.mathbackground.mathcolor.mathsize.mathvariant.maxsize.minsize.movablelimits.notation.numalign.open.rowalign.rowlines.rowspacing.rowspan.rspace.rquote.scriptlevel.scriptminsize.scriptsizemultiplier.selection.separator.separators.stretchy.subscriptshift.supscriptshift.symmetric.voffset.width.xmlns`.split(
      `.`,
    ),
  ),
  Kt = V([`xlink:href`, `xml:id`, `xlink:title`, `xml:space`, `xmlns:xlink`]),
  qt = U(/\{\{[\w\W]*|[\w\W]*\}\}/gm),
  Yt = U(/<%[\w\W]*|[\w\W]*%>/gm),
  Xt = U(/\$\{[\w\W]*/gm),
  $t = U(/^data-[\-\w.\u00B7-\uFFFF]+$/),
  en = U(/^aria-[\-\w]+$/),
  tn = U(
    /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  ),
  nn = U(/^(?:\w+script|data):/i),
  rn = U(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),
  an = U(/^html$/i),
  on = U(/^[a-z][.\w]*(-[.\w]+)+$/i);
var sn = Object.freeze({
  __proto__: null,
  ARIA_ATTR: en,
  ATTR_WHITESPACE: rn,
  CUSTOM_ELEMENT: on,
  DATA_ATTR: $t,
  DOCTYPE_NAME: an,
  ERB_EXPR: Yt,
  IS_ALLOWED_URI: tn,
  IS_SCRIPT_OR_DATA: nn,
  MUSTACHE_EXPR: qt,
  TMPLIT_EXPR: Xt,
});
const cn = 1,
  un = 3,
  fn = 7,
  pn = 8,
  mn = 9,
  hn = function () {
    return typeof window > `u` ? null : window;
  };
var gn = (function e() {
  let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : hn(),
    n = (t) => e(t);
  if (
    ((n.version = `3.2.7`),
    (n.removed = []),
    !t || !t.document || t.document.nodeType !== 9 || !t.Element)
  )
    return (n.isSupported = !1), n;
  let { document: r } = t,
    i = r,
    a = i.currentScript,
    {
      DocumentFragment: o,
      HTMLTemplateElement: s,
      Node: c,
      Element: l,
      NodeFilter: u,
      NamedNodeMap: d = t.NamedNodeMap || t.MozNamedAttrMap,
      HTMLFormElement: ee,
      DOMParser: ae,
      trustedTypes: f,
    } = t,
    p = l.prototype,
    oe = Pt(p, `cloneNode`),
    m = Pt(p, `remove`),
    se = Pt(p, `nextSibling`),
    h = Pt(p, `childNodes`),
    ce = Pt(p, `parentNode`);
  if (typeof s == `function`) {
    let e = r.createElement(`template`);
    e.content && e.content.ownerDocument && (r = e.content.ownerDocument);
  }
  let g,
    le = ``,
    {
      implementation: _,
      createNodeIterator: ue,
      createDocumentFragment: v,
      getElementsByTagName: de,
    } = r,
    { importNode: y } = i,
    b = {
      afterSanitizeAttributes: [],
      afterSanitizeElements: [],
      afterSanitizeShadowDOM: [],
      beforeSanitizeAttributes: [],
      beforeSanitizeElements: [],
      beforeSanitizeShadowDOM: [],
      uponSanitizeAttribute: [],
      uponSanitizeElement: [],
      uponSanitizeShadowNode: [],
    };
  n.isSupported =
    typeof ft == `function` &&
    typeof ce == `function` &&
    _ &&
    _.createHTMLDocument !== void 0;
  let {
      MUSTACHE_EXPR: fe,
      ERB_EXPR: pe,
      TMPLIT_EXPR: me,
      DATA_ATTR: he,
      ARIA_ATTR: ge,
      IS_SCRIPT_OR_DATA: _e,
      ATTR_WHITESPACE: ve,
      CUSTOM_ELEMENT: ye,
    } = sn,
    { IS_ALLOWED_URI: be } = sn,
    x = null,
    xe = q({}, [...It, ...Lt, ...Rt, ...Bt, ...Ht]),
    S = null,
    C = q({}, [...Ut, ...Wt, ...Gt, ...Kt]),
    w = Object.seal(
      _t(null, {
        tagNameCheck: {
          writable: !0,
          configurable: !1,
          enumerable: !0,
          value: null,
        },
        attributeNameCheck: {
          writable: !0,
          configurable: !1,
          enumerable: !0,
          value: null,
        },
        allowCustomizedBuiltInElements: {
          writable: !0,
          configurable: !1,
          enumerable: !0,
          value: !1,
        },
      }),
    ),
    T = null,
    E = null,
    Se = !0,
    Ce = !0,
    we = !1,
    Te = !0,
    Ee = !1,
    De = !0,
    D = !1,
    Oe = !1,
    ke = !1,
    O = !1,
    Ae = !1,
    je = !1,
    k = !0,
    Me = !1,
    Ne = !0,
    Pe = !1,
    A = {},
    j = null,
    Fe = q({}, [
      `annotation-xml`,
      `audio`,
      `colgroup`,
      `desc`,
      `foreignobject`,
      `head`,
      `iframe`,
      `math`,
      `mi`,
      `mn`,
      `mo`,
      `ms`,
      `mtext`,
      `noembed`,
      `noframes`,
      `noscript`,
      `plaintext`,
      `script`,
      `style`,
      `svg`,
      `template`,
      `thead`,
      `title`,
      `video`,
      `xmp`,
    ]),
    Ie = null,
    Le = q({}, [`audio`, `video`, `img`, `source`, `image`, `track`]),
    M = null,
    Re = q({}, [
      `alt`,
      `class`,
      `for`,
      `id`,
      `label`,
      `name`,
      `pattern`,
      `placeholder`,
      `role`,
      `summary`,
      `title`,
      `value`,
      `style`,
      `xmlns`,
    ]),
    ze = `http://www.w3.org/1998/Math/MathML`,
    Be = `http://www.w3.org/2000/svg`,
    N = `http://www.w3.org/1999/xhtml`,
    Ve = N,
    He = !1,
    Ue = null,
    We = q({}, [ze, Be, N], Et),
    Ge = q({}, [`mi`, `mo`, `mn`, `ms`, `mtext`]),
    Ke = q({}, [`annotation-xml`]),
    qe = q({}, [`title`, `style`, `font`, `a`, `script`]),
    Je = null,
    Ye = [`application/xhtml+xml`, `text/html`],
    P = null,
    F = null,
    Xe = r.createElement(`form`),
    Ze = function (e) {
      return e instanceof RegExp || e instanceof Function;
    },
    Qe = function () {
      let e =
        arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      if (!F || F !== e) {
        if (
          ((e && typeof e == `object`) || (e = {}),
          (e = J(e)),
          (Je =
            Ye.indexOf(e.PARSER_MEDIA_TYPE) === -1
              ? `text/html`
              : e.PARSER_MEDIA_TYPE),
          (P = Je === `application/xhtml+xml` ? Et : Tt),
          (x = W(e, `ALLOWED_TAGS`) ? q({}, e.ALLOWED_TAGS, P) : xe),
          (S = W(e, `ALLOWED_ATTR`) ? q({}, e.ALLOWED_ATTR, P) : C),
          (Ue = W(e, `ALLOWED_NAMESPACES`)
            ? q({}, e.ALLOWED_NAMESPACES, Et)
            : We),
          (M = W(e, `ADD_URI_SAFE_ATTR`)
            ? q(J(Re), e.ADD_URI_SAFE_ATTR, P)
            : Re),
          (Ie = W(e, `ADD_DATA_URI_TAGS`)
            ? q(J(Le), e.ADD_DATA_URI_TAGS, P)
            : Le),
          (j = W(e, `FORBID_CONTENTS`) ? q({}, e.FORBID_CONTENTS, P) : Fe),
          (T = W(e, `FORBID_TAGS`) ? q({}, e.FORBID_TAGS, P) : J({})),
          (E = W(e, `FORBID_ATTR`) ? q({}, e.FORBID_ATTR, P) : J({})),
          (A = !!W(e, `USE_PROFILES`) && e.USE_PROFILES),
          (Se = !1 !== e.ALLOW_ARIA_ATTR),
          (Ce = !1 !== e.ALLOW_DATA_ATTR),
          (we = e.ALLOW_UNKNOWN_PROTOCOLS || !1),
          (Te = !1 !== e.ALLOW_SELF_CLOSE_IN_ATTR),
          (Ee = e.SAFE_FOR_TEMPLATES || !1),
          (De = !1 !== e.SAFE_FOR_XML),
          (D = e.WHOLE_DOCUMENT || !1),
          (O = e.RETURN_DOM || !1),
          (Ae = e.RETURN_DOM_FRAGMENT || !1),
          (je = e.RETURN_TRUSTED_TYPE || !1),
          (ke = e.FORCE_BODY || !1),
          (k = !1 !== e.SANITIZE_DOM),
          (Me = e.SANITIZE_NAMED_PROPS || !1),
          (Ne = !1 !== e.KEEP_CONTENT),
          (Pe = e.IN_PLACE || !1),
          (be = e.ALLOWED_URI_REGEXP || tn),
          (Ve = e.NAMESPACE || N),
          (Ge = e.MATHML_TEXT_INTEGRATION_POINTS || Ge),
          (Ke = e.HTML_INTEGRATION_POINTS || Ke),
          (w = e.CUSTOM_ELEMENT_HANDLING || {}),
          e.CUSTOM_ELEMENT_HANDLING &&
            Ze(e.CUSTOM_ELEMENT_HANDLING.tagNameCheck) &&
            (w.tagNameCheck = e.CUSTOM_ELEMENT_HANDLING.tagNameCheck),
          e.CUSTOM_ELEMENT_HANDLING &&
            Ze(e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) &&
            (w.attributeNameCheck =
              e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),
          e.CUSTOM_ELEMENT_HANDLING &&
            typeof e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements ==
              `boolean` &&
            (w.allowCustomizedBuiltInElements =
              e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),
          Ee && (Ce = !1),
          Ae && (O = !0),
          A &&
            ((x = q({}, Ht)),
            (S = []),
            !0 === A.html && (q(x, It), q(S, Ut)),
            !0 === A.svg && (q(x, Lt), q(S, Wt), q(S, Kt)),
            !0 === A.svgFilters && (q(x, Rt), q(S, Wt), q(S, Kt)),
            !0 === A.mathMl && (q(x, Bt), q(S, Gt), q(S, Kt))),
          e.ADD_TAGS && (x === xe && (x = J(x)), q(x, e.ADD_TAGS, P)),
          e.ADD_ATTR && (S === C && (S = J(S)), q(S, e.ADD_ATTR, P)),
          e.ADD_URI_SAFE_ATTR && q(M, e.ADD_URI_SAFE_ATTR, P),
          e.FORBID_CONTENTS &&
            (j === Fe && (j = J(j)), q(j, e.FORBID_CONTENTS, P)),
          Ne && (x[`#text`] = !0),
          D && q(x, [`html`, `head`, `body`]),
          x.table && (q(x, [`tbody`]), delete T.tbody),
          e.TRUSTED_TYPES_POLICY)
        ) {
          if (typeof e.TRUSTED_TYPES_POLICY.createHTML != `function`)
            throw jt(
              `TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.`,
            );
          if (typeof e.TRUSTED_TYPES_POLICY.createScriptURL != `function`)
            throw jt(
              `TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.`,
            );
          (g = e.TRUSTED_TYPES_POLICY), (le = g.createHTML(``));
        } else
          g === void 0 &&
            (g = (function (e, t) {
              if (typeof e != `object` || typeof e.createPolicy != `function`)
                return null;
              let n = null,
                r = `data-tt-policy-suffix`;
              t && t.hasAttribute(r) && (n = t.getAttribute(r));
              let i = `dompurify` + (n ? `#` + n : ``);
              try {
                return e.createPolicy(i, {
                  createHTML: (e) => e,
                  createScriptURL: (e) => e,
                });
              } catch {
                return (
                  console.warn(
                    `TrustedTypes policy ` + i + ` could not be created.`,
                  ),
                  null
                );
              }
            })(f, a)),
            g !== null && typeof le == `string` && (le = g.createHTML(``));
        V && V(e), (F = e);
      }
    },
    I = q({}, [...Lt, ...Rt, ...zt]),
    $e = q({}, [...Bt, ...Vt]),
    L = function (e) {
      Ct(n.removed, { element: e });
      try {
        ce(e).removeChild(e);
      } catch {
        m(e);
      }
    },
    R = function (e, t) {
      try {
        Ct(n.removed, { attribute: t.getAttributeNode(e), from: t });
      } catch {
        Ct(n.removed, { attribute: null, from: t });
      }
      if ((t.removeAttribute(e), e === `is`))
        if (O || Ae)
          try {
            L(t);
          } catch {}
        else
          try {
            t.setAttribute(e, ``);
          } catch {}
    },
    et = function (e) {
      let t = null,
        n = null;
      if (ke) e = `<remove></remove>` + e;
      else {
        let t = Dt(e, /^[\r\n\t ]+/);
        n = t && t[0];
      }
      Je === `application/xhtml+xml` &&
        Ve === N &&
        (e =
          `<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>` +
          e +
          `</body></html>`);
      let i = g ? g.createHTML(e) : e;
      if (Ve === N)
        try {
          t = new ae().parseFromString(i, Je);
        } catch {}
      if (!t || !t.documentElement) {
        t = _.createDocument(Ve, `template`, null);
        try {
          t.documentElement.innerHTML = He ? le : i;
        } catch {}
      }
      let a = t.body || t.documentElement;
      return (
        e && n && a.insertBefore(r.createTextNode(n), a.childNodes[0] || null),
        Ve === N
          ? de.call(t, D ? `html` : `body`)[0]
          : D
            ? t.documentElement
            : a
      );
    },
    tt = function (e) {
      return ue.call(
        e.ownerDocument || e,
        e,
        u.SHOW_ELEMENT |
          u.SHOW_COMMENT |
          u.SHOW_TEXT |
          u.SHOW_PROCESSING_INSTRUCTION |
          u.SHOW_CDATA_SECTION,
        null,
      );
    },
    z = function (e) {
      return (
        e instanceof ee &&
        (typeof e.nodeName != `string` ||
          typeof e.textContent != `string` ||
          typeof e.removeChild != `function` ||
          !(e.attributes instanceof d) ||
          typeof e.removeAttribute != `function` ||
          typeof e.setAttribute != `function` ||
          typeof e.namespaceURI != `string` ||
          typeof e.insertBefore != `function` ||
          typeof e.hasChildNodes != `function`)
      );
    },
    nt = function (e) {
      return typeof c == `function` && e instanceof c;
    };
  function B(e, t, r) {
    bt(e, (e) => {
      e.call(n, t, r, F);
    });
  }
  let rt = function (e) {
      let t = null;
      if ((B(b.beforeSanitizeElements, e, null), z(e))) return L(e), !0;
      let r = P(e.nodeName);
      if (
        (B(b.uponSanitizeElement, e, { tagName: r, allowedTags: x }),
        (De &&
          e.hasChildNodes() &&
          !nt(e.firstElementChild) &&
          G(/<[/\w!]/g, e.innerHTML) &&
          G(/<[/\w!]/g, e.textContent)) ||
          e.nodeType === 7 ||
          (De && e.nodeType === 8 && G(/<[/\w]/g, e.data)))
      )
        return L(e), !0;
      if (!x[r] || T[r]) {
        if (
          !T[r] &&
          at(r) &&
          ((w.tagNameCheck instanceof RegExp && G(w.tagNameCheck, r)) ||
            (w.tagNameCheck instanceof Function && w.tagNameCheck(r)))
        )
          return !1;
        if (Ne && !j[r]) {
          let t = ce(e) || e.parentNode,
            n = h(e) || e.childNodes;
          if (n && t)
            for (let r = n.length - 1; r >= 0; --r) {
              let i = oe(n[r], !0);
              (i.__removalCount = (e.__removalCount || 0) + 1),
                t.insertBefore(i, se(e));
            }
        }
        return L(e), !0;
      }
      return e instanceof l &&
        !(function (e) {
          let t = ce(e);
          (t && t.tagName) || (t = { namespaceURI: Ve, tagName: `template` });
          let n = Tt(e.tagName),
            r = Tt(t.tagName);
          return (
            !!Ue[e.namespaceURI] &&
            (e.namespaceURI === Be
              ? t.namespaceURI === N
                ? n === `svg`
                : t.namespaceURI === ze
                  ? n === `svg` && (r === `annotation-xml` || Ge[r])
                  : !!I[n]
              : e.namespaceURI === ze
                ? t.namespaceURI === N
                  ? n === `math`
                  : t.namespaceURI === Be
                    ? n === `math` && Ke[r]
                    : !!$e[n]
                : e.namespaceURI === N
                  ? !(t.namespaceURI === Be && !Ke[r]) &&
                    !(t.namespaceURI === ze && !Ge[r]) &&
                    !$e[n] &&
                    (qe[n] || !I[n])
                  : !(Je !== `application/xhtml+xml` || !Ue[e.namespaceURI]))
          );
        })(e)
        ? (L(e), !0)
        : (r !== `noscript` && r !== `noembed` && r !== `noframes`) ||
            !G(/<\/no(script|embed|frames)/i, e.innerHTML)
          ? (Ee &&
              e.nodeType === 3 &&
              ((t = e.textContent),
              bt([fe, pe, me], (e) => {
                t = Ot(t, e, ` `);
              }),
              e.textContent !== t &&
                (Ct(n.removed, { element: e.cloneNode() }),
                (e.textContent = t))),
            B(b.afterSanitizeElements, e, null),
            !1)
          : (L(e), !0);
    },
    it = function (e, t, n) {
      if (k && (t === `id` || t === `name`) && (n in r || n in Xe)) return !1;
      if (!(Ce && !E[t] && G(he, t)) && !(Se && G(ge, t))) {
        if (!S[t] || E[t]) {
          if (
            !(
              (at(e) &&
                ((w.tagNameCheck instanceof RegExp && G(w.tagNameCheck, e)) ||
                  (w.tagNameCheck instanceof Function && w.tagNameCheck(e))) &&
                ((w.attributeNameCheck instanceof RegExp &&
                  G(w.attributeNameCheck, t)) ||
                  (w.attributeNameCheck instanceof Function &&
                    w.attributeNameCheck(t, e)))) ||
              (t === `is` &&
                w.allowCustomizedBuiltInElements &&
                ((w.tagNameCheck instanceof RegExp && G(w.tagNameCheck, n)) ||
                  (w.tagNameCheck instanceof Function && w.tagNameCheck(n))))
            )
          )
            return !1;
        } else if (
          !M[t] &&
          !G(be, Ot(n, ve, ``)) &&
          ((t !== `src` && t !== `xlink:href` && t !== `href`) ||
            e === `script` ||
            kt(n, `data:`) !== 0 ||
            !Ie[e]) &&
          !(we && !G(_e, Ot(n, ve, ``))) &&
          n
        )
          return !1;
      }
      return !0;
    },
    at = function (e) {
      return e !== `annotation-xml` && Dt(e, ye);
    },
    st = function (e) {
      B(b.beforeSanitizeAttributes, e, null);
      let { attributes: t } = e;
      if (!t || z(e)) return;
      let r = {
          attrName: ``,
          attrValue: ``,
          keepAttr: !0,
          allowedAttributes: S,
          forceKeepAttr: void 0,
        },
        i = t.length;
      for (; i--; ) {
        let { name: a, namespaceURI: o, value: s } = t[i],
          c = P(a),
          l = s,
          u = a === `value` ? l : At(l);
        if (
          ((r.attrName = c),
          (r.attrValue = u),
          (r.keepAttr = !0),
          (r.forceKeepAttr = void 0),
          B(b.uponSanitizeAttribute, e, r),
          (u = r.attrValue),
          !Me ||
            (c !== `id` && c !== `name`) ||
            (R(a, e), (u = `user-content-` + u)),
          De && G(/((--!?|])>)|<\/(style|title|textarea)/i, u))
        ) {
          R(a, e);
          continue;
        }
        if (c === `attributename` && Dt(u, `href`)) {
          R(a, e);
          continue;
        }
        if (r.forceKeepAttr) continue;
        if (!r.keepAttr) {
          R(a, e);
          continue;
        }
        if (!Te && G(/\/>/i, u)) {
          R(a, e);
          continue;
        }
        Ee &&
          bt([fe, pe, me], (e) => {
            u = Ot(u, e, ` `);
          });
        let d = P(e.nodeName);
        if (it(d, c, u)) {
          if (
            g &&
            typeof f == `object` &&
            typeof f.getAttributeType == `function` &&
            !o
          )
            switch (f.getAttributeType(d, c)) {
              case `TrustedHTML`:
                u = g.createHTML(u);
                break;
              case `TrustedScriptURL`:
                u = g.createScriptURL(u);
            }
          if (u !== l)
            try {
              o ? e.setAttributeNS(o, a, u) : e.setAttribute(a, u),
                z(e) ? L(e) : St(n.removed);
            } catch {
              R(a, e);
            }
        } else R(a, e);
      }
      B(b.afterSanitizeAttributes, e, null);
    },
    ct = function e(t) {
      let n = null,
        r = tt(t);
      for (B(b.beforeSanitizeShadowDOM, t, null); (n = r.nextNode()); )
        B(b.uponSanitizeShadowNode, n, null),
          rt(n),
          st(n),
          n.content instanceof o && e(n.content);
      B(b.afterSanitizeShadowDOM, t, null);
    };
  return (
    (n.sanitize = function (e) {
      let t =
          arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
        r = null,
        a = null,
        s = null,
        l = null;
      if (((He = !e), He && (e = `<!-->`), typeof e != `string` && !nt(e))) {
        if (typeof e.toString != `function`)
          throw jt(`toString is not a function`);
        if (typeof (e = e.toString()) != `string`)
          throw jt(`dirty is not a string, aborting`);
      }
      if (!n.isSupported) return e;
      if (
        (Oe || Qe(t), (n.removed = []), typeof e == `string` && (Pe = !1), Pe)
      ) {
        if (e.nodeName) {
          let t = P(e.nodeName);
          if (!x[t] || T[t])
            throw jt(`root node is forbidden and cannot be sanitized in-place`);
        }
      } else if (e instanceof c)
        (r = et(`<!---->`)),
          (a = r.ownerDocument.importNode(e, !0)),
          (a.nodeType === 1 && a.nodeName === `BODY`) || a.nodeName === `HTML`
            ? (r = a)
            : r.appendChild(a);
      else {
        if (!O && !Ee && !D && e.indexOf(`<`) === -1)
          return g && je ? g.createHTML(e) : e;
        if (((r = et(e)), !r)) return O ? null : je ? le : ``;
      }
      r && ke && L(r.firstChild);
      let u = tt(Pe ? e : r);
      for (; (s = u.nextNode()); )
        rt(s), st(s), s.content instanceof o && ct(s.content);
      if (Pe) return e;
      if (O) {
        if (Ae)
          for (l = v.call(r.ownerDocument); r.firstChild; )
            l.appendChild(r.firstChild);
        else l = r;
        return (S.shadowroot || S.shadowrootmode) && (l = y.call(i, l, !0)), l;
      }
      let d = D ? r.outerHTML : r.innerHTML;
      return (
        D &&
          x[`!doctype`] &&
          r.ownerDocument &&
          r.ownerDocument.doctype &&
          r.ownerDocument.doctype.name &&
          G(an, r.ownerDocument.doctype.name) &&
          (d =
            `<!DOCTYPE ` +
            r.ownerDocument.doctype.name +
            `>
` +
            d),
        Ee &&
          bt([fe, pe, me], (e) => {
            d = Ot(d, e, ` `);
          }),
        g && je ? g.createHTML(d) : d
      );
    }),
    (n.setConfig = function () {
      Qe(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}),
        (Oe = !0);
    }),
    (n.clearConfig = function () {
      (F = null), (Oe = !1);
    }),
    (n.isValidAttribute = function (e, t, n) {
      return F || Qe({}), it(P(e), P(t), n);
    }),
    (n.addHook = function (e, t) {
      typeof t == `function` && Ct(b[e], t);
    }),
    (n.removeHook = function (e, t) {
      if (t !== void 0) {
        let n = xt(b[e], t);
        return n === -1 ? void 0 : wt(b[e], n, 1)[0];
      }
      return St(b[e]);
    }),
    (n.removeHooks = function (e) {
      b[e] = [];
    }),
    (n.removeAllHooks = function () {
      b = {
        afterSanitizeAttributes: [],
        afterSanitizeElements: [],
        afterSanitizeShadowDOM: [],
        beforeSanitizeAttributes: [],
        beforeSanitizeElements: [],
        beforeSanitizeShadowDOM: [],
        uponSanitizeAttribute: [],
        uponSanitizeElement: [],
        uponSanitizeShadowNode: [],
      };
    }),
    n
  );
})();
gn.addHook(`uponSanitizeAttribute`, function (e, t) {
  if (t.attrName === `data-trix-serialized-attributes`)
    return void (t.keepAttr = !1);
  /^data-trix-/.test(t.attrName) && (t.forceKeepAttr = !0);
});
const _n = `style href src width height language class`.split(` `),
  vn = `javascript:`.split(` `),
  yn = `script iframe form noscript`.split(` `);
class gi extends H {
  static setHTML(e, t, n) {
    let r = new this(t, n).sanitize();
    e.innerHTML = r.getHTML ? r.getHTML() : r.outerHTML;
  }
  static sanitize(e, t) {
    let n = new this(e, t);
    return n.sanitize(), n;
  }
  constructor(e) {
    let {
      allowedAttributes: t,
      forbiddenProtocols: n,
      forbiddenElements: r,
      purifyOptions: i,
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super(...arguments),
      (this.allowedAttributes = t || _n),
      (this.forbiddenProtocols = n || vn),
      (this.forbiddenElements = r || yn),
      (this.purifyOptions = i || {}),
      (this.body = bn(e));
  }
  sanitize() {
    this.sanitizeElements(), this.normalizeListElementNesting();
    let e = Object.assign({}, c, this.purifyOptions);
    return gn.setConfig(e), (this.body = gn.sanitize(this.body)), this.body;
  }
  getHTML() {
    return this.body.innerHTML;
  }
  getBody() {
    return this.body;
  }
  sanitizeElements() {
    let e = de(this.body),
      t = [];
    for (; e.nextNode(); ) {
      let n = e.currentNode;
      switch (n.nodeType) {
        case Node.ELEMENT_NODE:
          this.elementIsRemovable(n) ? t.push(n) : this.sanitizeElement(n);
          break;
        case Node.COMMENT_NODE:
          t.push(n);
      }
    }
    return t.forEach((e) => v(e)), this.body;
  }
  sanitizeElement(e) {
    return (
      e.hasAttribute(`href`) &&
        this.forbiddenProtocols.includes(e.protocol) &&
        e.removeAttribute(`href`),
      Array.from(e.attributes).forEach((t) => {
        let { name: n } = t;
        this.allowedAttributes.includes(n) ||
          n.indexOf(`data-trix`) === 0 ||
          e.removeAttribute(n);
      }),
      e
    );
  }
  normalizeListElementNesting() {
    return (
      Array.from(this.body.querySelectorAll(`ul,ol`)).forEach((e) => {
        let t = e.previousElementSibling;
        t && y(t) === `li` && t.appendChild(e);
      }),
      this.body
    );
  }
  elementIsRemovable(e) {
    if (e?.nodeType === Node.ELEMENT_NODE)
      return this.elementIsForbidden(e) || this.elementIsntSerializable(e);
  }
  elementIsForbidden(e) {
    return this.forbiddenElements.includes(y(e));
  }
  elementIsntSerializable(e) {
    return e.getAttribute(`data-trix-serialize`) === `false` && !ye(e);
  }
}
const bn = function () {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ``;
    e = e.replace(/<\/html[^>]*>[^]*$/i, `</html>`);
    let t = document.implementation.createHTMLDocument(``);
    return (
      (t.documentElement.innerHTML = e),
      Array.from(t.head.querySelectorAll(`style`)).forEach((e) => {
        t.body.appendChild(e);
      }),
      t.body
    );
  },
  { css: xn } = E;
class fi extends ne {
  constructor() {
    super(...arguments),
      (this.attachment = this.object),
      (this.attachment.uploadProgressDelegate = this),
      (this.attachmentPiece = this.options.piece);
  }
  createContentNodes() {
    return [];
  }
  createNodes() {
    let e,
      t = (e = b({
        tagName: `figure`,
        className: this.getClassName(),
        data: this.getData(),
        editable: !1,
      })),
      n = this.getHref();
    return (
      n &&
        ((e = b({
          tagName: `a`,
          editable: !1,
          attributes: { href: n, tabindex: -1 },
        })),
        t.appendChild(e)),
      this.attachment.hasContent()
        ? gi.setHTML(e, this.attachment.getContent())
        : this.createContentNodes().forEach((t) => {
            e.appendChild(t);
          }),
      e.appendChild(this.createCaptionElement()),
      this.attachment.isPending() &&
        ((this.progressElement = b({
          tagName: `progress`,
          attributes: {
            class: xn.attachmentProgress,
            value: this.attachment.getUploadProgress(),
            max: 100,
          },
          data: {
            trixMutable: !0,
            trixStoreKey: [`progressElement`, this.attachment.id].join(`/`),
          },
        })),
        t.appendChild(this.progressElement)),
      [Sn(`left`), t, Sn(`right`)]
    );
  }
  createCaptionElement() {
    let e = b({ tagName: `figcaption`, className: xn.attachmentCaption }),
      t = this.attachmentPiece.getCaption();
    if (t)
      e.classList.add(`${xn.attachmentCaption}--edited`), (e.textContent = t);
    else {
      let t,
        n,
        r = this.getCaptionConfig();
      if (
        (r.name && (t = this.attachment.getFilename()),
        r.size && (n = this.attachment.getFormattedFilesize()),
        t)
      ) {
        let n = b({
          tagName: `span`,
          className: xn.attachmentName,
          textContent: t,
        });
        e.appendChild(n);
      }
      if (n) {
        t && e.appendChild(document.createTextNode(` `));
        let r = b({
          tagName: `span`,
          className: xn.attachmentSize,
          textContent: n,
        });
        e.appendChild(r);
      }
    }
    return e;
  }
  getClassName() {
    let e = [xn.attachment, `${xn.attachment}--${this.attachment.getType()}`],
      t = this.attachment.getExtension();
    return t && e.push(`${xn.attachment}--${t}`), e.join(` `);
  }
  getData() {
    let e = {
        trixAttachment: JSON.stringify(this.attachment),
        trixContentType: this.attachment.getContentType(),
        trixId: this.attachment.id,
      },
      { attributes: t } = this.attachmentPiece;
    return (
      t.isEmpty() || (e.trixAttributes = JSON.stringify(t)),
      this.attachment.isPending() && (e.trixSerialize = !1),
      e
    );
  }
  getHref() {
    if (!Cn(this.attachment.getContent(), `a`)) {
      let e = this.attachment.getHref();
      if (e && gn.isValidAttribute(`a`, `href`, e)) return e;
    }
  }
  getCaptionConfig() {
    var e;
    let t = this.attachment.getType(),
      r = Je((e = n[t])?.caption);
    return t === `file` && (r.name = !0), r;
  }
  findProgressElement() {
    var e;
    return (e = this.findElement())?.querySelector(`progress`);
  }
  attachmentDidChangeUploadProgress() {
    let e = this.attachment.getUploadProgress(),
      t = this.findProgressElement();
    t && (t.value = e);
  }
}
const Sn = (e) =>
    b({
      tagName: `span`,
      textContent: `﻿`,
      data: { trixCursorTarget: e, trixSerialize: !1 },
    }),
  Cn = function (e, t) {
    let n = b(`div`);
    return gi.setHTML(n, e || ``), n.querySelector(t);
  };
class Ai extends fi {
  constructor() {
    super(...arguments), (this.attachment.previewDelegate = this);
  }
  createContentNodes() {
    return (
      (this.image = b({
        tagName: `img`,
        attributes: { src: `` },
        data: { trixMutable: !0 },
      })),
      this.refresh(this.image),
      [this.image]
    );
  }
  createCaptionElement() {
    let e = super.createCaptionElement(...arguments);
    return (
      e.textContent ||
        e.setAttribute(`data-trix-placeholder`, l.captionPlaceholder),
      e
    );
  }
  refresh(e) {
    var t;
    if (((e ||= (t = this.findElement())?.querySelector(`img`)), e))
      return this.updateAttributesForImage(e);
  }
  updateAttributesForImage(e) {
    let t = this.attachment.getURL(),
      n = this.attachment.getPreviewURL();
    if (((e.src = n || t), n === t))
      e.removeAttribute(`data-trix-serialized-attributes`);
    else {
      let n = JSON.stringify({ src: t });
      e.setAttribute(`data-trix-serialized-attributes`, n);
    }
    let r = this.attachment.getWidth(),
      i = this.attachment.getHeight(),
      a = this.attachment.getAttribute(`alt`);
    r != null && (e.width = r),
      i != null && (e.height = i),
      a != null && (e.alt = a);
    let o = [`imageElement`, this.attachment.id, e.src, e.width, e.height].join(
      `/`,
    );
    e.dataset.trixStoreKey = o;
  }
  attachmentDidChangeAttributes() {
    return this.refresh(this.image), this.refresh();
  }
}
class yi extends ne {
  constructor() {
    super(...arguments),
      (this.piece = this.object),
      (this.attributes = this.piece.getAttributes()),
      (this.textConfig = this.options.textConfig),
      (this.context = this.options.context),
      this.piece.attachment
        ? (this.attachment = this.piece.attachment)
        : (this.string = this.piece.toString());
  }
  createNodes() {
    let e = this.attachment
        ? this.createAttachmentNodes()
        : this.createStringNodes(),
      t = this.createElement();
    if (t) {
      let n = (function (e) {
        for (; (t = e) != null && t.firstElementChild; ) {
          var t;
          e = e.firstElementChild;
        }
        return e;
      })(t);
      Array.from(e).forEach((e) => {
        n.appendChild(e);
      }),
        (e = [t]);
    }
    return e;
  }
  createAttachmentNodes() {
    let e = this.attachment.isPreviewable() ? Ai : fi;
    return this.createChildView(e, this.piece.attachment, {
      piece: this.piece,
    }).getNodes();
  }
  createStringNodes() {
    var e;
    if ((e = this.textConfig) != null && e.plaintext)
      return [document.createTextNode(this.string)];
    {
      let e = [],
        t = this.string.split(`
`);
      for (let n = 0; n < t.length; n++) {
        let r = t[n];
        if (n > 0) {
          let t = b(`br`);
          e.push(t);
        }
        if (r.length) {
          let t = document.createTextNode(this.preserveSpaces(r));
          e.push(t);
        }
      }
      return e;
    }
  }
  createElement() {
    let e,
      t,
      n,
      r = {};
    for (t in this.attributes) {
      n = this.attributes[t];
      let a = ze(t);
      if (a) {
        if (a.tagName) {
          var i;
          let t = b(a.tagName);
          i ? (i.appendChild(t), (i = t)) : (e = i = t);
        }
        if ((a.styleProperty && (r[a.styleProperty] = n), a.style))
          for (t in a.style) (n = a.style[t]), (r[t] = n);
      }
    }
    if (Object.keys(r).length)
      for (t in ((e ||= b(`span`)), r)) (n = r[t]), (e.style[t] = n);
    return e;
  }
  createContainerElement() {
    for (let e in this.attributes) {
      let t = this.attributes[e],
        n = ze(e);
      if (n && n.groupTagName) {
        let r = {};
        return (r[e] = t), b(n.groupTagName, r);
      }
    }
  }
  preserveSpaces(e) {
    return (
      this.context.isLast && (e = e.replace(/\ $/, `\xA0`)),
      (e = e
        .replace(/(\S)\ {3}(\S)/g, `$1 \xA0 $2`)
        .replace(/\ {2}/g, `\xA0 `)
        .replace(/\ {2}/g, ` \xA0`)),
      (this.context.isFirst || this.context.followsWhitespace) &&
        (e = e.replace(/^\ /, `\xA0`)),
      e
    );
  }
}
class xi extends ne {
  constructor() {
    super(...arguments),
      (this.text = this.object),
      (this.textConfig = this.options.textConfig);
  }
  createNodes() {
    let e = [],
      t = Zt.groupObjects(this.getPieces()),
      n = t.length - 1;
    for (let i = 0; i < t.length; i++) {
      let a = t[i],
        o = {};
      i === 0 && (o.isFirst = !0),
        i === n && (o.isLast = !0),
        En(r) && (o.followsWhitespace = !0);
      let s = this.findOrCreateCachedChildView(yi, a, {
        textConfig: this.textConfig,
        context: o,
      });
      e.push(...Array.from(s.getNodes() || []));
      var r = a;
    }
    return e;
  }
  getPieces() {
    return Array.from(this.text.getPieces()).filter(
      (e) => !e.hasAttribute(`blockBreak`),
    );
  }
}
const En = (e) => /\s$/.test(e?.toString()),
  { css: An } = E;
class Si extends ne {
  constructor() {
    super(...arguments),
      (this.block = this.object),
      (this.attributes = this.block.getAttributes());
  }
  createNodes() {
    let e = [document.createComment(`block`)];
    if (this.block.isEmpty()) e.push(b(`br`));
    else {
      var t;
      let n = (t = M(this.block.getLastAttribute()))?.text,
        r = this.findOrCreateCachedChildView(xi, this.block.text, {
          textConfig: n,
        });
      e.push(...Array.from(r.getNodes() || [])),
        this.shouldAddExtraNewlineElement() && e.push(b(`br`));
    }
    if (this.attributes.length) return e;
    {
      let t,
        { tagName: n } = r.default;
      this.block.isRTL() && (t = { dir: `rtl` });
      let i = b({ tagName: n, attributes: t });
      return e.forEach((e) => i.appendChild(e)), [i];
    }
  }
  createContainerElement(e) {
    let t = {},
      n,
      r = this.attributes[e],
      { tagName: i, htmlAttributes: a = [] } = M(r);
    if (
      (e === 0 && this.block.isRTL() && Object.assign(t, { dir: `rtl` }),
      r === `attachmentGallery`)
    ) {
      let e = this.block.getBlockBreakPosition();
      n = `${An.attachmentGallery} ${An.attachmentGallery}--${e}`;
    }
    return (
      Object.entries(this.block.htmlAttributes).forEach((e) => {
        let [n, r] = e;
        a.includes(n) && (t[n] = r);
      }),
      b({ tagName: i, className: n, attributes: t })
    );
  }
  shouldAddExtraNewlineElement() {
    return /\n\n$/.test(this.block.toString());
  }
}
class Ri extends ne {
  static render(e) {
    let t = b(`div`),
      n = new this(e, { element: t });
    return n.render(), n.sync(), t;
  }
  constructor() {
    super(...arguments),
      (this.element = this.options.element),
      (this.elementStore = new te()),
      this.setDocument(this.object);
  }
  setDocument(e) {
    e.isEqualTo(this.document) || (this.document = this.object = e);
  }
  render() {
    if (
      ((this.childViews = []),
      (this.shadowElement = b(`div`)),
      !this.document.isEmpty())
    ) {
      let e = Zt.groupObjects(this.document.getBlocks(), { asTree: !0 });
      Array.from(e).forEach((e) => {
        let t = this.findOrCreateCachedChildView(Si, e);
        Array.from(t.getNodes()).map((e) => this.shadowElement.appendChild(e));
      });
    }
  }
  isSynced() {
    return Nn(this.shadowElement, this.element);
  }
  sync() {
    let e = se(`trix-before-render`, {
      cancelable: !1,
      attributes: {
        render: (e, t) => {
          for (; e.lastChild; ) e.removeChild(e.lastChild);
          e.appendChild(t);
        },
      },
    });
    this.element.dispatchEvent(e);
    let t = this.createDocumentFragmentForSync();
    return e.render(this.element, t), this.didSync();
  }
  didSync() {
    return (
      this.elementStore.reset(jn(this.element)),
      qe(() => this.garbageCollectCachedViews())
    );
  }
  createDocumentFragmentForSync() {
    let e = document.createDocumentFragment();
    return (
      Array.from(this.shadowElement.childNodes).forEach((t) => {
        e.appendChild(t.cloneNode(!0));
      }),
      Array.from(jn(e)).forEach((e) => {
        let t = this.elementStore.remove(e);
        t && e.parentNode.replaceChild(t, e);
      }),
      e
    );
  }
}
const jn = (e) => e.querySelectorAll(`[data-trix-store-key]`),
  Nn = (e, t) => Pn(e.innerHTML) === Pn(t.innerHTML),
  Pn = (e) => e.replace(/&nbsp;/g, ` `);
function Fn(e) {
  var t, n;
  function r(t, n) {
    try {
      var a = e[t](n),
        o = a.value,
        s = o instanceof In;
      Promise.resolve(s ? o.v : o).then(
        function (n) {
          if (s) {
            var c = t === `return` ? `return` : `next`;
            if (!o.k || n.done) return r(c, n);
            n = e[c](n).value;
          }
          i(a.done ? `return` : `normal`, n);
        },
        function (e) {
          r(`throw`, e);
        },
      );
    } catch (e) {
      i(`throw`, e);
    }
  }
  function i(e, i) {
    switch (e) {
      case `return`:
        t.resolve({ value: i, done: !0 });
        break;
      case `throw`:
        t.reject(i);
        break;
      default:
        t.resolve({ value: i, done: !1 });
    }
    (t = t.next) ? r(t.key, t.arg) : (n = null);
  }
  (this._invoke = function (e, i) {
    return new Promise(function (a, o) {
      var s = { key: e, arg: i, resolve: a, reject: o, next: null };
      n ? (n = n.next = s) : ((t = n = s), r(e, i));
    });
  }),
    typeof e.return != `function` && (this.return = void 0);
}
function In(e, t) {
  (this.v = e), (this.k = t);
}
function Rn(e) {
  var t = (function (e, t) {
    if (typeof e != `object` || !e) return e;
    var n = e[Symbol.toPrimitive];
    if (n !== void 0) {
      var r = n.call(e, t || `default`);
      if (typeof r != `object`) return r;
      throw TypeError(`@@toPrimitive must return a primitive value.`);
    }
    return (t === `string` ? String : Number)(e);
  })(e, `string`);
  return typeof t == `symbol` ? t : String(t);
}
function Y(e, t, n) {
  return (
    (t = Rn(t)) in e
      ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[t] = n),
    e
  );
}
(Fn.prototype[
  (typeof Symbol == `function` && Symbol.asyncIterator) || `@@asyncIterator`
] = function () {
  return this;
}),
  (Fn.prototype.next = function (e) {
    return this._invoke(`next`, e);
  }),
  (Fn.prototype.throw = function (e) {
    return this._invoke(`throw`, e);
  }),
  (Fn.prototype.return = function (e) {
    return this._invoke(`return`, e);
  });
function X(e, t) {
  return Wn(e, Un(e, t, `get`));
}
function Hn(e, t, n) {
  return Gn(e, Un(e, t, `set`), n), n;
}
function Un(e, t, n) {
  if (!t.has(e))
    throw TypeError(`attempted to ` + n + ` private field on non-instance`);
  return t.get(e);
}
function Wn(e, t) {
  return t.get ? t.get.call(e) : t.value;
}
function Gn(e, t, n) {
  if (t.set) t.set.call(e, n);
  else {
    if (!t.writable)
      throw TypeError(`attempted to set read only private field`);
    t.value = n;
  }
}
function Kn(e, t, n) {
  if (!t.has(e))
    throw TypeError(`attempted to get private field on non-instance`);
  return n;
}
function qn(e, t) {
  if (t.has(e))
    throw TypeError(
      `Cannot initialize the same private elements twice on an object`,
    );
}
function Jn(e, t, n) {
  qn(e, t), t.set(e, n);
}
class Ui extends ot {
  static registerType(e, t) {
    (t.type = e), (this.types[e] = t);
  }
  static fromJSON(e) {
    let t = this.types[e.type];
    if (t) return t.fromJSON(e);
  }
  constructor(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super(...arguments), (this.attributes = Jt.box(t));
  }
  copyWithAttributes(e) {
    return new this.constructor(this.getValue(), e);
  }
  copyWithAdditionalAttributes(e) {
    return this.copyWithAttributes(this.attributes.merge(e));
  }
  copyWithoutAttribute(e) {
    return this.copyWithAttributes(this.attributes.remove(e));
  }
  copy() {
    return this.copyWithAttributes(this.attributes);
  }
  getAttribute(e) {
    return this.attributes.get(e);
  }
  getAttributesHash() {
    return this.attributes;
  }
  getAttributes() {
    return this.attributes.toObject();
  }
  hasAttribute(e) {
    return this.attributes.has(e);
  }
  hasSameStringValueAsPiece(e) {
    return e && this.toString() === e.toString();
  }
  hasSameAttributesAsPiece(e) {
    return (
      e &&
      (this.attributes === e.attributes ||
        this.attributes.isEqualTo(e.attributes))
    );
  }
  isBlockBreak() {
    return !1;
  }
  isEqualTo(e) {
    return (
      super.isEqualTo(...arguments) ||
      (this.hasSameConstructorAs(e) &&
        this.hasSameStringValueAsPiece(e) &&
        this.hasSameAttributesAsPiece(e))
    );
  }
  isEmpty() {
    return this.length === 0;
  }
  isSerializable() {
    return !0;
  }
  toJSON() {
    return { type: this.constructor.type, attributes: this.getAttributes() };
  }
  contentsForInspection() {
    return {
      type: this.constructor.type,
      attributes: this.attributes.inspect(),
    };
  }
  canBeGrouped() {
    return this.hasAttribute(`href`);
  }
  canBeGroupedWith(e) {
    return this.getAttribute(`href`) === e.getAttribute(`href`);
  }
  getLength() {
    return this.length;
  }
  canBeConsolidatedWith(e) {
    return !1;
  }
}
Y(Ui, `types`, {});
class Vi extends ie {
  constructor(e) {
    super(...arguments), (this.url = e);
  }
  perform(e) {
    let t = new Image();
    (t.onload = () => (
      (t.width = this.width = t.naturalWidth),
      (t.height = this.height = t.naturalHeight),
      e(!0, t)
    )),
      (t.onerror = () => e(!1)),
      (t.src = this.url);
  }
}
class zi extends ot {
  static attachmentForFile(e) {
    let t = new this(this.attributesForFile(e));
    return t.setFile(e), t;
  }
  static attributesForFile(e) {
    return new Jt({ filename: e.name, filesize: e.size, contentType: e.type });
  }
  static fromJSON(e) {
    return new this(e);
  }
  constructor() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    super(e),
      (this.releaseFile = this.releaseFile.bind(this)),
      (this.attributes = Jt.box(e)),
      this.didChangeAttributes();
  }
  setAttribute(e, t) {
    this.setAttributes({ [e]: t });
  }
  getAttribute(e) {
    return this.attributes.get(e);
  }
  hasAttribute(e) {
    return this.attributes.has(e);
  }
  getAttributes() {
    return this.attributes.toObject();
  }
  setAttributes() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
      t = this.attributes.merge(e);
    var n, r, i, a;
    if (!this.attributes.isEqualTo(t))
      return (
        (this.attributes = t),
        this.didChangeAttributes(),
        (n = this.previewDelegate) == null ||
          (r = n.attachmentDidChangeAttributes) == null ||
          r.call(n, this),
        (i = this.delegate) == null ||
        (a = i.attachmentDidChangeAttributes) == null
          ? void 0
          : a.call(i, this)
      );
  }
  didChangeAttributes() {
    if (this.isPreviewable()) return this.preloadURL();
  }
  isPending() {
    return this.file != null && !(this.getURL() || this.getHref());
  }
  isPreviewable() {
    return this.attributes.has(`previewable`)
      ? this.attributes.get(`previewable`)
      : zi.previewablePattern.test(this.getContentType());
  }
  getType() {
    return this.hasContent()
      ? `content`
      : this.isPreviewable()
        ? `preview`
        : `file`;
  }
  getURL() {
    return this.attributes.get(`url`);
  }
  getHref() {
    return this.attributes.get(`href`);
  }
  getFilename() {
    return this.attributes.get(`filename`) || ``;
  }
  getFilesize() {
    return this.attributes.get(`filesize`);
  }
  getFormattedFilesize() {
    let e = this.attributes.get(`filesize`);
    return typeof e == `number` ? d.formatter(e) : ``;
  }
  getExtension() {
    var e;
    return (e = this.getFilename().match(/\.(\w+)$/))?.[1].toLowerCase();
  }
  getContentType() {
    return this.attributes.get(`contentType`);
  }
  hasContent() {
    return this.attributes.has(`content`);
  }
  getContent() {
    return this.attributes.get(`content`);
  }
  getWidth() {
    return this.attributes.get(`width`);
  }
  getHeight() {
    return this.attributes.get(`height`);
  }
  getFile() {
    return this.file;
  }
  setFile(e) {
    if (((this.file = e), this.isPreviewable())) return this.preloadFile();
  }
  releaseFile() {
    this.releasePreloadedFile(), (this.file = null);
  }
  getUploadProgress() {
    return this.uploadProgress == null ? 0 : this.uploadProgress;
  }
  setUploadProgress(e) {
    var t, n;
    if (this.uploadProgress !== e)
      return (
        (this.uploadProgress = e),
        (t = this.uploadProgressDelegate) == null ||
        (n = t.attachmentDidChangeUploadProgress) == null
          ? void 0
          : n.call(t, this)
      );
  }
  toJSON() {
    return this.getAttributes();
  }
  getCacheKey() {
    return [
      super.getCacheKey(...arguments),
      this.attributes.getCacheKey(),
      this.getPreviewURL(),
    ].join(`/`);
  }
  getPreviewURL() {
    return this.previewURL || this.preloadingURL;
  }
  setPreviewURL(e) {
    var t, n, r, i;
    if (e !== this.getPreviewURL())
      return (
        (this.previewURL = e),
        (t = this.previewDelegate) == null ||
          (n = t.attachmentDidChangeAttributes) == null ||
          n.call(t, this),
        (r = this.delegate) == null ||
        (i = r.attachmentDidChangePreviewURL) == null
          ? void 0
          : i.call(r, this)
      );
  }
  preloadURL() {
    return this.preload(this.getURL(), this.releaseFile);
  }
  preloadFile() {
    if (this.file)
      return (
        (this.fileObjectURL = URL.createObjectURL(this.file)),
        this.preload(this.fileObjectURL)
      );
  }
  releasePreloadedFile() {
    this.fileObjectURL &&= (URL.revokeObjectURL(this.fileObjectURL), null);
  }
  preload(e, t) {
    if (e && e !== this.getPreviewURL())
      return (
        (this.preloadingURL = e),
        new Vi(e)
          .then((n) => {
            let { width: r, height: i } = n;
            return (
              (this.getWidth() && this.getHeight()) ||
                this.setAttributes({ width: r, height: i }),
              (this.preloadingURL = null),
              this.setPreviewURL(e),
              t?.()
            );
          })
          .catch(() => ((this.preloadingURL = null), t?.()))
      );
  }
}
Y(zi, `previewablePattern`, /^image(\/(gif|png|webp|jpe?g)|$)/);
class qi extends Ui {
  static fromJSON(e) {
    return new this(zi.fromJSON(e.attachment), e.attributes);
  }
  constructor(e) {
    super(...arguments),
      (this.attachment = e),
      (this.length = 1),
      this.ensureAttachmentExclusivelyHasAttribute(`href`),
      this.attachment.hasContent() || this.removeProhibitedAttributes();
  }
  ensureAttachmentExclusivelyHasAttribute(e) {
    this.hasAttribute(e) &&
      (this.attachment.hasAttribute(e) ||
        this.attachment.setAttributes(this.attributes.slice([e])),
      (this.attributes = this.attributes.remove(e)));
  }
  removeProhibitedAttributes() {
    let e = this.attributes.slice(qi.permittedAttributes);
    e.isEqualTo(this.attributes) || (this.attributes = e);
  }
  getValue() {
    return this.attachment;
  }
  isSerializable() {
    return !this.attachment.isPending();
  }
  getCaption() {
    return this.attributes.get(`caption`) || ``;
  }
  isEqualTo(e) {
    var t;
    return (
      super.isEqualTo(e) &&
      this.attachment.id ===
        (e == null || (t = e.attachment) == null ? void 0 : t.id)
    );
  }
  toString() {
    return `￼`;
  }
  toJSON() {
    let e = super.toJSON(...arguments);
    return (e.attachment = this.attachment), e;
  }
  getCacheKey() {
    return [
      super.getCacheKey(...arguments),
      this.attachment.getCacheKey(),
    ].join(`/`);
  }
  toConsole() {
    return JSON.stringify(this.toString());
  }
}
Y(qi, `permittedAttributes`, [`caption`, `presentation`]),
  Ui.registerType(`attachment`, qi);
class Hi extends Ui {
  static fromJSON(e) {
    return new this(e.string, e.attributes);
  }
  constructor(e) {
    super(...arguments),
      (this.string = ((e) =>
        e.replace(
          /\r\n?/g,
          `
`,
        ))(e)),
      (this.length = this.string.length);
  }
  getValue() {
    return this.string;
  }
  toString() {
    return this.string.toString();
  }
  isBlockBreak() {
    return (
      this.toString() ===
        `
` && !0 === this.getAttribute(`blockBreak`)
    );
  }
  toJSON() {
    let e = super.toJSON(...arguments);
    return (e.string = this.string), e;
  }
  canBeConsolidatedWith(e) {
    return (
      e && this.hasSameConstructorAs(e) && this.hasSameAttributesAsPiece(e)
    );
  }
  consolidateWith(e) {
    return new this.constructor(
      this.toString() + e.toString(),
      this.attributes,
    );
  }
  splitAtOffset(e) {
    let t, n;
    return (
      e === 0
        ? ((t = null), (n = this))
        : e === this.length
          ? ((t = this), (n = null))
          : ((t = new this.constructor(
              this.string.slice(0, e),
              this.attributes,
            )),
            (n = new this.constructor(this.string.slice(e), this.attributes))),
      [t, n]
    );
  }
  toConsole() {
    let { string: e } = this;
    return (
      e.length > 15 && (e = e.slice(0, 14) + `…`), JSON.stringify(e.toString())
    );
  }
}
Ui.registerType(`string`, Hi);
class Ji extends ot {
  static box(e) {
    return e instanceof this ? e : new this(e);
  }
  constructor() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    super(...arguments),
      (this.objects = e.slice(0)),
      (this.length = this.objects.length);
  }
  indexOf(e) {
    return this.objects.indexOf(e);
  }
  splice() {
    var e = [...arguments];
    return new this.constructor(Me(this.objects, ...e));
  }
  eachObject(e) {
    return this.objects.map((t, n) => e(t, n));
  }
  insertObjectAtIndex(e, t) {
    return this.splice(t, 0, e);
  }
  insertSplittableListAtIndex(e, t) {
    return this.splice(t, 0, ...e.objects);
  }
  insertSplittableListAtPosition(e, t) {
    let [n, r] = this.splitObjectAtPosition(t);
    return new this.constructor(n).insertSplittableListAtIndex(e, r);
  }
  editObjectAtIndex(e, t) {
    return this.replaceObjectAtIndex(t(this.objects[e]), e);
  }
  replaceObjectAtIndex(e, t) {
    return this.splice(t, 1, e);
  }
  removeObjectAtIndex(e) {
    return this.splice(e, 1);
  }
  getObjectAtIndex(e) {
    return this.objects[e];
  }
  getSplittableListInRange(e) {
    let [t, n, r] = this.splitObjectsAtRange(e);
    return new this.constructor(t.slice(n, r + 1));
  }
  selectSplittableList(e) {
    let t = this.objects.filter((t) => e(t));
    return new this.constructor(t);
  }
  removeObjectsInRange(e) {
    let [t, n, r] = this.splitObjectsAtRange(e);
    return new this.constructor(t).splice(n, r - n + 1);
  }
  transformObjectsInRange(e, t) {
    let [n, r, i] = this.splitObjectsAtRange(e),
      a = n.map((e, n) => (r <= n && n <= i ? t(e) : e));
    return new this.constructor(a);
  }
  splitObjectsAtRange(e) {
    let t,
      [n, r, i] = this.splitObjectAtPosition(Qn(e));
    return (
      ([n, t] = new this.constructor(n).splitObjectAtPosition(er(e) + i)),
      [n, r, t - 1]
    );
  }
  getObjectAtPosition(e) {
    let { index: t } = this.findIndexAndOffsetAtPosition(e);
    return this.objects[t];
  }
  splitObjectAtPosition(e) {
    let t,
      n,
      { index: r, offset: i } = this.findIndexAndOffsetAtPosition(e),
      a = this.objects.slice(0);
    if (r != null)
      if (i === 0) (t = r), (n = 0);
      else {
        let [e, o] = this.getObjectAtIndex(r).splitAtOffset(i);
        a.splice(r, 1, e, o), (t = r + 1), (n = e.getLength() - i);
      }
    else (t = a.length), (n = 0);
    return [a, t, n];
  }
  consolidate() {
    let e = [],
      t = this.objects[0];
    return (
      this.objects.slice(1).forEach((n) => {
        var r, i;
        (r = (i = t).canBeConsolidatedWith) != null && r.call(i, n)
          ? (t = t.consolidateWith(n))
          : (e.push(t), (t = n));
      }),
      t && e.push(t),
      new this.constructor(e)
    );
  }
  consolidateFromIndexToIndex(e, t) {
    let n = this.objects.slice(0).slice(e, t + 1),
      r = new this.constructor(n).consolidate().toArray();
    return this.splice(e, n.length, ...r);
  }
  findIndexAndOffsetAtPosition(e) {
    let t,
      n = 0;
    for (t = 0; t < this.objects.length; t++) {
      let r = n + this.objects[t].getLength();
      if (n <= e && e < r) return { index: t, offset: e - n };
      n = r;
    }
    return { index: null, offset: null };
  }
  findPositionAtIndexAndOffset(e, t) {
    let n = 0;
    for (let r = 0; r < this.objects.length; r++) {
      let i = this.objects[r];
      if (r < e) n += i.getLength();
      else if (r === e) {
        n += t;
        break;
      }
    }
    return n;
  }
  getEndPosition() {
    return (
      this.endPosition ??
        ((this.endPosition = 0),
        this.objects.forEach((e) => (this.endPosition += e.getLength()))),
      this.endPosition
    );
  }
  toString() {
    return this.objects.join(``);
  }
  toArray() {
    return this.objects.slice(0);
  }
  toJSON() {
    return this.toArray();
  }
  isEqualTo(e) {
    return super.isEqualTo(...arguments) || Yn(this.objects, e?.objects);
  }
  contentsForInspection() {
    return { objects: `[${this.objects.map((e) => e.inspect()).join(`, `)}]` };
  }
}
const Yn = function (e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    if (e.length !== t.length) return !1;
    let n = !0;
    for (let r = 0; r < e.length; r++) {
      let i = e[r];
      n && !i.isEqualTo(t[r]) && (n = !1);
    }
    return n;
  },
  Qn = (e) => e[0],
  er = (e) => e[1];
class Xi extends ot {
  static textForAttachmentWithAttributes(e, t) {
    return new this([new qi(e, t)]);
  }
  static textForStringWithAttributes(e, t) {
    return new this([new Hi(e, t)]);
  }
  static fromJSON(e) {
    return new this(Array.from(e).map((e) => Ui.fromJSON(e)));
  }
  constructor() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    super(...arguments),
      (this.pieceList = new Ji(e.filter((e) => !e.isEmpty())));
  }
  copy() {
    return this.copyWithPieceList(this.pieceList);
  }
  copyWithPieceList(e) {
    return new this.constructor(e.consolidate().toArray());
  }
  copyUsingObjectMap(e) {
    let t = this.getPieces().map((t) => e.find(t) || t);
    return new this.constructor(t);
  }
  appendText(e) {
    return this.insertTextAtPosition(e, this.getLength());
  }
  insertTextAtPosition(e, t) {
    return this.copyWithPieceList(
      this.pieceList.insertSplittableListAtPosition(e.pieceList, t),
    );
  }
  removeTextAtRange(e) {
    return this.copyWithPieceList(this.pieceList.removeObjectsInRange(e));
  }
  replaceTextAtRange(e, t) {
    return this.removeTextAtRange(t).insertTextAtPosition(e, t[0]);
  }
  moveTextFromRangeToPosition(e, t) {
    if (e[0] <= t && t <= e[1]) return;
    let n = this.getTextAtRange(e),
      r = n.getLength();
    return (
      e[0] < t && (t -= r), this.removeTextAtRange(e).insertTextAtPosition(n, t)
    );
  }
  addAttributeAtRange(e, t, n) {
    let r = {};
    return (r[e] = t), this.addAttributesAtRange(r, n);
  }
  addAttributesAtRange(e, t) {
    return this.copyWithPieceList(
      this.pieceList.transformObjectsInRange(t, (t) =>
        t.copyWithAdditionalAttributes(e),
      ),
    );
  }
  removeAttributeAtRange(e, t) {
    return this.copyWithPieceList(
      this.pieceList.transformObjectsInRange(t, (t) =>
        t.copyWithoutAttribute(e),
      ),
    );
  }
  setAttributesAtRange(e, t) {
    return this.copyWithPieceList(
      this.pieceList.transformObjectsInRange(t, (t) => t.copyWithAttributes(e)),
    );
  }
  getAttributesAtPosition(e) {
    var t;
    return (t = this.pieceList.getObjectAtPosition(e))?.getAttributes() || {};
  }
  getCommonAttributes() {
    let e = Array.from(this.pieceList.toArray()).map((e) => e.getAttributes());
    return Jt.fromCommonAttributesOfObjects(e).toObject();
  }
  getCommonAttributesAtRange(e) {
    return this.getTextAtRange(e).getCommonAttributes() || {};
  }
  getExpandedRangeForAttributeAtOffset(e, t) {
    let n,
      r = (n = t),
      i = this.getLength();
    for (; r > 0 && this.getCommonAttributesAtRange([r - 1, n])[e]; ) r--;
    for (; n < i && this.getCommonAttributesAtRange([t, n + 1])[e]; ) n++;
    return [r, n];
  }
  getTextAtRange(e) {
    return this.copyWithPieceList(this.pieceList.getSplittableListInRange(e));
  }
  getStringAtRange(e) {
    return this.pieceList.getSplittableListInRange(e).toString();
  }
  getStringAtPosition(e) {
    return this.getStringAtRange([e, e + 1]);
  }
  startsWithString(e) {
    return this.getStringAtRange([0, e.length]) === e;
  }
  endsWithString(e) {
    let t = this.getLength();
    return this.getStringAtRange([t - e.length, t]) === e;
  }
  getAttachmentPieces() {
    return this.pieceList.toArray().filter((e) => !!e.attachment);
  }
  getAttachments() {
    return this.getAttachmentPieces().map((e) => e.attachment);
  }
  getAttachmentAndPositionById(e) {
    let t = 0;
    for (let r of this.pieceList.toArray()) {
      var n;
      if ((n = r.attachment)?.id === e)
        return { attachment: r.attachment, position: t };
      t += r.length;
    }
    return { attachment: null, position: null };
  }
  getAttachmentById(e) {
    let { attachment: t } = this.getAttachmentAndPositionById(e);
    return t;
  }
  getRangeOfAttachment(e) {
    let t = this.getAttachmentAndPositionById(e.id),
      n = t.position;
    if ((e = t.attachment)) return [n, n + 1];
  }
  updateAttributesForAttachment(e, t) {
    let n = this.getRangeOfAttachment(t);
    return n ? this.addAttributesAtRange(e, n) : this;
  }
  getLength() {
    return this.pieceList.getEndPosition();
  }
  isEmpty() {
    return this.getLength() === 0;
  }
  isEqualTo(e) {
    var t;
    return (
      super.isEqualTo(e) ||
      (e == null || (t = e.pieceList) == null
        ? void 0
        : t.isEqualTo(this.pieceList))
    );
  }
  isBlockBreak() {
    return (
      this.getLength() === 1 &&
      this.pieceList.getObjectAtIndex(0).isBlockBreak()
    );
  }
  eachPiece(e) {
    return this.pieceList.eachObject(e);
  }
  getPieces() {
    return this.pieceList.toArray();
  }
  getPieceAtPosition(e) {
    return this.pieceList.getObjectAtPosition(e);
  }
  contentsForInspection() {
    return { pieceList: this.pieceList.inspect() };
  }
  toSerializableText() {
    let e = this.pieceList.selectSplittableList((e) => e.isSerializable());
    return this.copyWithPieceList(e);
  }
  toString() {
    return this.pieceList.toString();
  }
  toJSON() {
    return this.pieceList.toJSON();
  }
  toConsole() {
    return JSON.stringify(
      this.pieceList.toArray().map((e) => JSON.parse(e.toConsole())),
    );
  }
  getDirection() {
    return Pe(this.toString());
  }
  isRTL() {
    return this.getDirection() === `rtl`;
  }
}
class $i extends ot {
  static fromJSON(e) {
    return new this(Xi.fromJSON(e.text), e.attributes, e.htmlAttributes);
  }
  constructor(e, t, n) {
    super(...arguments),
      (this.text = tr(e || new Xi())),
      (this.attributes = t || []),
      (this.htmlAttributes = n || {});
  }
  isEmpty() {
    return this.text.isBlockBreak();
  }
  isEqualTo(e) {
    return (
      !!super.isEqualTo(e) ||
      (this.text.isEqualTo(e?.text) &&
        k(this.attributes, e?.attributes) &&
        Ye(this.htmlAttributes, e?.htmlAttributes))
    );
  }
  copyWithText(e) {
    return new $i(e, this.attributes, this.htmlAttributes);
  }
  copyWithoutText() {
    return this.copyWithText(null);
  }
  copyWithAttributes(e) {
    return new $i(this.text, e, this.htmlAttributes);
  }
  copyWithoutAttributes() {
    return this.copyWithAttributes(null);
  }
  copyUsingObjectMap(e) {
    let t = e.find(this.text);
    return t
      ? this.copyWithText(t)
      : this.copyWithText(this.text.copyUsingObjectMap(e));
  }
  addAttribute(e) {
    let t = this.attributes.concat(dr(e));
    return this.copyWithAttributes(t);
  }
  addHTMLAttribute(e, t) {
    let n = Object.assign({}, this.htmlAttributes, { [e]: t });
    return new $i(this.text, this.attributes, n);
  }
  removeAttribute(e) {
    let { listAttribute: t } = M(e),
      n = pr(pr(this.attributes, e), t);
    return this.copyWithAttributes(n);
  }
  removeLastAttribute() {
    return this.removeAttribute(this.getLastAttribute());
  }
  getLastAttribute() {
    return fr(this.attributes);
  }
  getAttributes() {
    return this.attributes.slice(0);
  }
  getAttributeLevel() {
    return this.attributes.length;
  }
  getAttributeAtLevel(e) {
    return this.attributes[e - 1];
  }
  hasAttribute(e) {
    return this.attributes.includes(e);
  }
  hasAttributes() {
    return this.getAttributeLevel() > 0;
  }
  getLastNestableAttribute() {
    return fr(this.getNestableAttributes());
  }
  getNestableAttributes() {
    return this.attributes.filter((e) => M(e).nestable);
  }
  getNestingLevel() {
    return this.getNestableAttributes().length;
  }
  decreaseNestingLevel() {
    let e = this.getLastNestableAttribute();
    return e ? this.removeAttribute(e) : this;
  }
  increaseNestingLevel() {
    let e = this.getLastNestableAttribute();
    if (e) {
      let t = this.attributes.lastIndexOf(e),
        n = Me(this.attributes, t + 1, 0, ...dr(e));
      return this.copyWithAttributes(n);
    }
    return this;
  }
  getListItemAttributes() {
    return this.attributes.filter((e) => M(e).listAttribute);
  }
  isListItem() {
    var e;
    return (e = M(this.getLastAttribute()))?.listAttribute;
  }
  isTerminalBlock() {
    var e;
    return (e = M(this.getLastAttribute()))?.terminal;
  }
  breaksOnReturn() {
    var e;
    return (e = M(this.getLastAttribute()))?.breakOnReturn;
  }
  findLineBreakInDirectionFromPosition(e, t) {
    let n = this.toString(),
      r;
    switch (e) {
      case `forward`:
        r = n.indexOf(
          `
`,
          t,
        );
        break;
      case `backward`:
        r = n.slice(0, t).lastIndexOf(`
`);
    }
    if (r !== -1) return r;
  }
  contentsForInspection() {
    return { text: this.text.inspect(), attributes: this.attributes };
  }
  toString() {
    return this.text.toString();
  }
  toJSON() {
    return {
      text: this.text,
      attributes: this.attributes,
      htmlAttributes: this.htmlAttributes,
    };
  }
  getDirection() {
    return this.text.getDirection();
  }
  isRTL() {
    return this.text.isRTL();
  }
  getLength() {
    return this.text.getLength();
  }
  canBeConsolidatedWith(e) {
    return (
      !this.hasAttributes() &&
      !e.hasAttributes() &&
      this.getDirection() === e.getDirection()
    );
  }
  consolidateWith(e) {
    let t = Xi.textForStringWithAttributes(`
`),
      n = this.getTextWithoutBlockBreak().appendText(t);
    return this.copyWithText(n.appendText(e.text));
  }
  splitAtOffset(e) {
    let t, n;
    return (
      e === 0
        ? ((t = null), (n = this))
        : e === this.getLength()
          ? ((t = this), (n = null))
          : ((t = this.copyWithText(this.text.getTextAtRange([0, e]))),
            (n = this.copyWithText(
              this.text.getTextAtRange([e, this.getLength()]),
            ))),
      [t, n]
    );
  }
  getBlockBreakPosition() {
    return this.text.getLength() - 1;
  }
  getTextWithoutBlockBreak() {
    return lr(this.text)
      ? this.text.getTextAtRange([0, this.getBlockBreakPosition()])
      : this.text.copy();
  }
  canBeGrouped(e) {
    return this.attributes[e];
  }
  canBeGroupedWith(e, t) {
    let n = e.getAttributes(),
      i = n[t],
      a = this.attributes[t];
    return (
      a === i &&
      !(
        !1 === M(a).group &&
        !(() => {
          if (!Ie) {
            Ie = [];
            for (let e in r) {
              let { listAttribute: t } = r[e];
              t != null && Ie.push(t);
            }
          }
          return Ie;
        })().includes(n[t + 1])
      ) &&
      (this.getDirection() === e.getDirection() || e.isEmpty())
    );
  }
}
const tr = function (e) {
    return (e = nr(e)), (e = sr(e));
  },
  nr = function (e) {
    let t = !1,
      n = e.getPieces(),
      r = n.slice(0, n.length - 1),
      i = n[n.length - 1];
    return i
      ? ((r = r.map((e) => (e.isBlockBreak() ? ((t = !0), ur(e)) : e))),
        t ? new Xi([...r, i]) : e)
      : e;
  },
  ar = Xi.textForStringWithAttributes(
    `
`,
    { blockBreak: !0 },
  ),
  sr = function (e) {
    return lr(e) ? e : e.appendText(ar);
  },
  lr = function (e) {
    let t = e.getLength();
    return t === 0 ? !1 : e.getTextAtRange([t - 1, t]).isBlockBreak();
  },
  ur = (e) => e.copyWithoutAttribute(`blockBreak`),
  dr = function (e) {
    let { listAttribute: t } = M(e);
    return t ? [t, e] : [e];
  },
  fr = (e) => e.slice(-1)[0],
  pr = function (e, t) {
    let n = e.lastIndexOf(t);
    return n === -1 ? e : Me(e, n, 1);
  };
class ln extends ot {
  static fromJSON(e) {
    return new this(Array.from(e).map((e) => $i.fromJSON(e)));
  }
  static fromString(e, t) {
    let n = Xi.textForStringWithAttributes(e, t);
    return new this([new $i(n)]);
  }
  constructor() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    super(...arguments),
      e.length === 0 && (e = [new $i()]),
      (this.blockList = Ji.box(e));
  }
  isEmpty() {
    let e = this.getBlockAtIndex(0);
    return this.blockList.length === 1 && e.isEmpty() && !e.hasAttributes();
  }
  copy() {
    let e = (arguments.length > 0 && arguments[0] !== void 0
      ? arguments[0]
      : {}
    ).consolidateBlocks
      ? this.blockList.consolidate().toArray()
      : this.blockList.toArray();
    return new this.constructor(e);
  }
  copyUsingObjectsFromDocument(e) {
    let t = new Qt(e.getObjects());
    return this.copyUsingObjectMap(t);
  }
  copyUsingObjectMap(e) {
    let t = this.getBlocks().map((t) => e.find(t) || t.copyUsingObjectMap(e));
    return new this.constructor(t);
  }
  copyWithBaseBlockAttributes() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [],
      t = this.getBlocks().map((t) => {
        let n = e.concat(t.getAttributes());
        return t.copyWithAttributes(n);
      });
    return new this.constructor(t);
  }
  replaceBlock(e, t) {
    let n = this.blockList.indexOf(e);
    return n === -1
      ? this
      : new this.constructor(this.blockList.replaceObjectAtIndex(t, n));
  }
  insertDocumentAtRange(e, t) {
    let { blockList: n } = e;
    t = P(t);
    let [r] = t,
      { index: i, offset: a } = this.locationFromPosition(r),
      o = this,
      s = this.getBlockAtPosition(r);
    return (
      F(t) && s.isEmpty() && !s.hasAttributes()
        ? (o = new this.constructor(o.blockList.removeObjectAtIndex(i)))
        : s.getBlockBreakPosition() === a && r++,
      (o = o.removeTextAtRange(t)),
      new this.constructor(o.blockList.insertSplittableListAtPosition(n, r))
    );
  }
  mergeDocumentAtRange(e, t) {
    let n, r;
    t = P(t);
    let [i] = t,
      a = this.locationFromPosition(i),
      o = this.getBlockAtIndex(a.index).getAttributes(),
      s = e.getBaseBlockAttributes();
    if (k(s, o.slice(-s.length))) {
      let t = o.slice(0, -s.length);
      n = e.copyWithBaseBlockAttributes(t);
    } else n = e.copy({ consolidateBlocks: !0 }).copyWithBaseBlockAttributes(o);
    let c = n.getBlockCount(),
      l = n.getBlockAtIndex(0);
    if (k(o, l.getAttributes())) {
      let e = l.getTextWithoutBlockBreak();
      if (((r = this.insertTextAtRange(e, t)), c > 1)) {
        n = new this.constructor(n.getBlocks().slice(1));
        let t = i + e.getLength();
        r = r.insertDocumentAtRange(n, t);
      }
    } else r = this.insertDocumentAtRange(n, t);
    return r;
  }
  insertTextAtRange(e, t) {
    t = P(t);
    let [n] = t,
      { index: r, offset: i } = this.locationFromPosition(n),
      a = this.removeTextAtRange(t);
    return new this.constructor(
      a.blockList.editObjectAtIndex(r, (t) =>
        t.copyWithText(t.text.insertTextAtPosition(e, i)),
      ),
    );
  }
  removeTextAtRange(e) {
    let t;
    e = P(e);
    let [n, r] = e;
    if (F(e)) return this;
    let [i, a] = Array.from(this.locationRangeFromRange(e)),
      o = i.index,
      s = i.offset,
      c = this.getBlockAtIndex(o),
      l = a.index,
      u = a.offset,
      d = this.getBlockAtIndex(l);
    if (
      r - n == 1 &&
      c.getBlockBreakPosition() === s &&
      d.getBlockBreakPosition() !== u &&
      d.text.getStringAtPosition(u) ===
        `
`
    )
      t = this.blockList.editObjectAtIndex(l, (e) =>
        e.copyWithText(e.text.removeTextAtRange([u, u + 1])),
      );
    else {
      let e,
        n = c.text.getTextAtRange([0, s]),
        r = d.text.getTextAtRange([u, d.getLength()]),
        i = n.appendText(r);
      e =
        o !== l && s === 0 && c.getAttributeLevel() >= d.getAttributeLevel()
          ? d.copyWithText(i)
          : c.copyWithText(i);
      let a = l + 1 - o;
      t = this.blockList.splice(o, a, e);
    }
    return new this.constructor(t);
  }
  moveTextFromRangeToPosition(e, t) {
    let n;
    e = P(e);
    let [r, i] = e;
    if (r <= t && t <= i) return this;
    let a = this.getDocumentAtRange(e),
      o = this.removeTextAtRange(e),
      s = r < t;
    s && (t -= a.getLength());
    let [c, ...l] = a.getBlocks();
    return (
      l.length === 0
        ? ((n = c.getTextWithoutBlockBreak()), s && (t += 1))
        : (n = c.text),
      (o = o.insertTextAtRange(n, t)),
      l.length === 0
        ? o
        : ((a = new this.constructor(l)),
          (t += n.getLength()),
          o.insertDocumentAtRange(a, t))
    );
  }
  addAttributeAtRange(e, t, n) {
    let { blockList: r } = this;
    return (
      this.eachBlockAtRange(
        n,
        (n, i, a) =>
          (r = r.editObjectAtIndex(a, function () {
            return M(e)
              ? n.addAttribute(e, t)
              : i[0] === i[1]
                ? n
                : n.copyWithText(n.text.addAttributeAtRange(e, t, i));
          })),
      ),
      new this.constructor(r)
    );
  }
  addAttribute(e, t) {
    let { blockList: n } = this;
    return (
      this.eachBlock(
        (r, i) => (n = n.editObjectAtIndex(i, () => r.addAttribute(e, t))),
      ),
      new this.constructor(n)
    );
  }
  removeAttributeAtRange(e, t) {
    let { blockList: n } = this;
    return (
      this.eachBlockAtRange(t, function (t, r, i) {
        M(e)
          ? (n = n.editObjectAtIndex(i, () => t.removeAttribute(e)))
          : r[0] !== r[1] &&
            (n = n.editObjectAtIndex(i, () =>
              t.copyWithText(t.text.removeAttributeAtRange(e, r)),
            ));
      }),
      new this.constructor(n)
    );
  }
  updateAttributesForAttachment(e, t) {
    let n = this.getRangeOfAttachment(t),
      [r] = Array.from(n),
      { index: i } = this.locationFromPosition(r),
      a = this.getTextAtIndex(i);
    return new this.constructor(
      this.blockList.editObjectAtIndex(i, (n) =>
        n.copyWithText(a.updateAttributesForAttachment(e, t)),
      ),
    );
  }
  removeAttributeForAttachment(e, t) {
    let n = this.getRangeOfAttachment(t);
    return this.removeAttributeAtRange(e, n);
  }
  setHTMLAttributeAtPosition(e, t, n) {
    let r = this.getBlockAtPosition(e),
      i = r.addHTMLAttribute(t, n);
    return this.replaceBlock(r, i);
  }
  insertBlockBreakAtRange(e) {
    let t;
    e = P(e);
    let [n] = e,
      { offset: r } = this.locationFromPosition(n),
      i = this.removeTextAtRange(e);
    return (
      r === 0 && (t = [new $i()]),
      new this.constructor(
        i.blockList.insertSplittableListAtPosition(new Ji(t), n),
      )
    );
  }
  applyBlockAttributeAtRange(e, t, n) {
    let r = this.expandRangeToLineBreaksAndSplitBlocks(n),
      i = r.document;
    n = r.range;
    let a = M(e);
    if (a.listAttribute) {
      i = i.removeLastListAttributeAtRange(n, { exceptAttributeName: e });
      let t = i.convertLineBreaksToBlockBreaksInRange(n);
      (i = t.document), (n = t.range);
    } else
      i = a.exclusive
        ? i.removeBlockAttributesAtRange(n)
        : a.terminal
          ? i.removeLastTerminalAttributeAtRange(n)
          : i.consolidateBlocksAtRange(n);
    return i.addAttributeAtRange(e, t, n);
  }
  removeLastListAttributeAtRange(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      { blockList: n } = this;
    return (
      this.eachBlockAtRange(e, function (e, r, i) {
        let a = e.getLastAttribute();
        a &&
          M(a).listAttribute &&
          a !== t.exceptAttributeName &&
          (n = n.editObjectAtIndex(i, () => e.removeAttribute(a)));
      }),
      new this.constructor(n)
    );
  }
  removeLastTerminalAttributeAtRange(e) {
    let { blockList: t } = this;
    return (
      this.eachBlockAtRange(e, function (e, n, r) {
        let i = e.getLastAttribute();
        i &&
          M(i).terminal &&
          (t = t.editObjectAtIndex(r, () => e.removeAttribute(i)));
      }),
      new this.constructor(t)
    );
  }
  removeBlockAttributesAtRange(e) {
    let { blockList: t } = this;
    return (
      this.eachBlockAtRange(e, function (e, n, r) {
        e.hasAttributes() &&
          (t = t.editObjectAtIndex(r, () => e.copyWithoutAttributes()));
      }),
      new this.constructor(t)
    );
  }
  expandRangeToLineBreaksAndSplitBlocks(e) {
    let t;
    e = P(e);
    let [n, r] = e,
      i = this.locationFromPosition(n),
      a = this.locationFromPosition(r),
      o = this;
    if (
      ((i.offset = o
        .getBlockAtIndex(i.index)
        .findLineBreakInDirectionFromPosition(`backward`, i.offset)),
      i.offset != null &&
        ((t = o.positionFromLocation(i)),
        (o = o.insertBlockBreakAtRange([t, t + 1])),
        (a.index += 1),
        (a.offset -= o.getBlockAtIndex(i.index).getLength()),
        (i.index += 1)),
      (i.offset = 0),
      a.offset === 0 && a.index > i.index)
    )
      --a.index,
        (a.offset = o.getBlockAtIndex(a.index).getBlockBreakPosition());
    else {
      let e = o.getBlockAtIndex(a.index);
      e.text.getStringAtRange([a.offset - 1, a.offset]) ===
      `
`
        ? --a.offset
        : (a.offset = e.findLineBreakInDirectionFromPosition(
            `forward`,
            a.offset,
          )),
        a.offset !== e.getBlockBreakPosition() &&
          ((t = o.positionFromLocation(a)),
          (o = o.insertBlockBreakAtRange([t, t + 1])));
    }
    return (
      (n = o.positionFromLocation(i)),
      (r = o.positionFromLocation(a)),
      { document: o, range: (e = P([n, r])) }
    );
  }
  convertLineBreaksToBlockBreaksInRange(e) {
    e = P(e);
    let [t] = e,
      n = this.getStringAtRange(e).slice(0, -1),
      r = this;
    return (
      n.replace(/.*?\n/g, function (e) {
        (t += e.length), (r = r.insertBlockBreakAtRange([t - 1, t]));
      }),
      { document: r, range: e }
    );
  }
  consolidateBlocksAtRange(e) {
    e = P(e);
    let [t, n] = e,
      r = this.locationFromPosition(t).index,
      i = this.locationFromPosition(n).index;
    return new this.constructor(
      this.blockList.consolidateFromIndexToIndex(r, i),
    );
  }
  getDocumentAtRange(e) {
    e = P(e);
    let t = this.blockList.getSplittableListInRange(e).toArray();
    return new this.constructor(t);
  }
  getStringAtRange(e) {
    let t,
      n = (e = P(e));
    return (
      n[n.length - 1] !== this.getLength() && (t = -1),
      this.getDocumentAtRange(e).toString().slice(0, t)
    );
  }
  getBlockAtIndex(e) {
    return this.blockList.getObjectAtIndex(e);
  }
  getBlockAtPosition(e) {
    let { index: t } = this.locationFromPosition(e);
    return this.getBlockAtIndex(t);
  }
  getTextAtIndex(e) {
    var t;
    return (t = this.getBlockAtIndex(e))?.text;
  }
  getTextAtPosition(e) {
    let { index: t } = this.locationFromPosition(e);
    return this.getTextAtIndex(t);
  }
  getPieceAtPosition(e) {
    let { index: t, offset: n } = this.locationFromPosition(e);
    return this.getTextAtIndex(t).getPieceAtPosition(n);
  }
  getCharacterAtPosition(e) {
    let { index: t, offset: n } = this.locationFromPosition(e);
    return this.getTextAtIndex(t).getStringAtRange([n, n + 1]);
  }
  getLength() {
    return this.blockList.getEndPosition();
  }
  getBlocks() {
    return this.blockList.toArray();
  }
  getBlockCount() {
    return this.blockList.length;
  }
  getEditCount() {
    return this.editCount;
  }
  eachBlock(e) {
    return this.blockList.eachObject(e);
  }
  eachBlockAtRange(e, t) {
    let n, r;
    e = P(e);
    let [i, a] = e,
      o = this.locationFromPosition(i),
      s = this.locationFromPosition(a);
    if (o.index === s.index)
      return (
        (n = this.getBlockAtIndex(o.index)),
        (r = [o.offset, s.offset]),
        t(n, r, o.index)
      );
    for (let e = o.index; e <= s.index; e++)
      if (((n = this.getBlockAtIndex(e)), n)) {
        switch (e) {
          case o.index:
            r = [o.offset, n.text.getLength()];
            break;
          case s.index:
            r = [0, s.offset];
            break;
          default:
            r = [0, n.text.getLength()];
        }
        t(n, r, e);
      }
  }
  getCommonAttributesAtRange(e) {
    e = P(e);
    let [t] = e;
    if (F(e)) return this.getCommonAttributesAtPosition(t);
    {
      let t = [],
        n = [];
      return (
        this.eachBlockAtRange(e, function (e, r) {
          if (r[0] !== r[1])
            return t.push(e.text.getCommonAttributesAtRange(r)), n.push(hr(e));
        }),
        Jt.fromCommonAttributesOfObjects(t)
          .merge(Jt.fromCommonAttributesOfObjects(n))
          .toObject()
      );
    }
  }
  getCommonAttributesAtPosition(e) {
    let t,
      n,
      { index: r, offset: i } = this.locationFromPosition(e),
      a = this.getBlockAtIndex(r);
    if (!a) return {};
    let o = hr(a),
      s = a.text.getAttributesAtPosition(i),
      c = a.text.getAttributesAtPosition(i - 1),
      l = Object.keys(C).filter((e) => C[e].inheritable);
    for (t in c) (n = c[t]), (n === s[t] || l.includes(t)) && (o[t] = n);
    return o;
  }
  getRangeOfCommonAttributeAtPosition(e, t) {
    let { index: n, offset: r } = this.locationFromPosition(t),
      i = this.getTextAtIndex(n),
      [a, o] = Array.from(i.getExpandedRangeForAttributeAtOffset(e, r));
    return P([
      this.positionFromLocation({ index: n, offset: a }),
      this.positionFromLocation({ index: n, offset: o }),
    ]);
  }
  getBaseBlockAttributes() {
    let e = this.getBlockAtIndex(0).getAttributes();
    for (let t = 1; t < this.getBlockCount(); t++) {
      let n = this.getBlockAtIndex(t).getAttributes(),
        r = Math.min(e.length, n.length);
      e = (() => {
        let t = [];
        for (let i = 0; i < r && n[i] === e[i]; i++) t.push(n[i]);
        return t;
      })();
    }
    return e;
  }
  getAttachmentById(e) {
    for (let t of this.getAttachments()) if (t.id === e) return t;
  }
  getAttachmentPieces() {
    let e = [];
    return (
      this.blockList.eachObject((t) => {
        let { text: n } = t;
        return (e = e.concat(n.getAttachmentPieces()));
      }),
      e
    );
  }
  getAttachments() {
    return this.getAttachmentPieces().map((e) => e.attachment);
  }
  getRangeOfAttachment(e) {
    let t = 0,
      n = this.blockList.toArray();
    for (let r = 0; r < n.length; r++) {
      let { text: i } = n[r],
        a = i.getRangeOfAttachment(e);
      if (a) return P([t + a[0], t + a[1]]);
      t += i.getLength();
    }
  }
  getLocationRangeOfAttachment(e) {
    let t = this.getRangeOfAttachment(e);
    return this.locationRangeFromRange(t);
  }
  getAttachmentPieceForAttachment(e) {
    for (let t of this.getAttachmentPieces()) if (t.attachment === e) return t;
  }
  findRangesForBlockAttribute(e) {
    let t = 0,
      n = [];
    return (
      this.getBlocks().forEach((r) => {
        let i = r.getLength();
        r.hasAttribute(e) && n.push([t, t + i]), (t += i);
      }),
      n
    );
  }
  findRangesForTextAttribute(e) {
    let { withValue: t } =
        arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      n = 0,
      r = [],
      i = [];
    return (
      this.getPieces().forEach((a) => {
        let o = a.getLength();
        (function (n) {
          return t ? n.getAttribute(e) === t : n.hasAttribute(e);
        })(a) && (r[1] === n ? (r[1] = n + o) : i.push((r = [n, n + o]))),
          (n += o);
      }),
      i
    );
  }
  locationFromPosition(e) {
    let t = this.blockList.findIndexAndOffsetAtPosition(Math.max(0, e));
    if (t.index != null) return t;
    {
      let e = this.getBlocks();
      return { index: e.length - 1, offset: e[e.length - 1].getLength() };
    }
  }
  positionFromLocation(e) {
    return this.blockList.findPositionAtIndexAndOffset(e.index, e.offset);
  }
  locationRangeFromPosition(e) {
    return P(this.locationFromPosition(e));
  }
  locationRangeFromRange(e) {
    if (!(e = P(e))) return;
    let [t, n] = Array.from(e);
    return P([this.locationFromPosition(t), this.locationFromPosition(n)]);
  }
  rangeFromLocationRange(e) {
    let t;
    e = P(e);
    let n = this.positionFromLocation(e[0]);
    return F(e) || (t = this.positionFromLocation(e[1])), P([n, t]);
  }
  isEqualTo(e) {
    return this.blockList.isEqualTo(e?.blockList);
  }
  getTexts() {
    return this.getBlocks().map((e) => e.text);
  }
  getPieces() {
    let e = [];
    return (
      Array.from(this.getTexts()).forEach((t) => {
        e.push(...Array.from(t.getPieces() || []));
      }),
      e
    );
  }
  getObjects() {
    return this.getBlocks().concat(this.getTexts()).concat(this.getPieces());
  }
  toSerializableDocument() {
    let e = [];
    return (
      this.blockList.eachObject((t) =>
        e.push(t.copyWithText(t.text.toSerializableText())),
      ),
      new this.constructor(e)
    );
  }
  toString() {
    return this.blockList.toString();
  }
  toJSON() {
    return this.blockList.toJSON();
  }
  toConsole() {
    return JSON.stringify(
      this.blockList.toArray().map((e) => JSON.parse(e.text.toConsole())),
    );
  }
}
const hr = function (e) {
    let t = {},
      n = e.getLastAttribute();
    return n && (t[n] = !0), t;
  },
  gr = function (e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return { string: (e = z(e)), attributes: t, type: `string` };
  },
  vr = (e, t) => {
    try {
      return JSON.parse(e.getAttribute(`data-trix-${t}`));
    } catch {
      return {};
    }
  };
class dn extends H {
  static parse(e, t) {
    let n = new this(e, t);
    return n.parse(), n;
  }
  constructor(e) {
    let { referenceElement: t, purifyOptions: n } =
      arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super(...arguments),
      (this.html = e),
      (this.referenceElement = t),
      (this.purifyOptions = n),
      (this.blocks = []),
      (this.blockElements = []),
      (this.processedElements = []);
  }
  getDocument() {
    return ln.fromJSON(this.blocks);
  }
  parse() {
    try {
      this.createHiddenContainer(),
        gi.setHTML(this.containerElement, this.html, {
          purifyOptions: this.purifyOptions,
        });
      let e = de(this.containerElement, { usingFilter: Cr });
      for (; e.nextNode(); ) this.processNode(e.currentNode);
      return this.translateBlockElementMarginsToNewlines();
    } finally {
      this.removeHiddenContainer();
    }
  }
  createHiddenContainer() {
    return this.referenceElement
      ? ((this.containerElement = this.referenceElement.cloneNode(!1)),
        this.containerElement.removeAttribute(`id`),
        this.containerElement.setAttribute(`data-trix-internal`, ``),
        (this.containerElement.style.display = `none`),
        this.referenceElement.parentNode.insertBefore(
          this.containerElement,
          this.referenceElement.nextSibling,
        ))
      : ((this.containerElement = b({
          tagName: `div`,
          style: { display: `none` },
        })),
        document.body.appendChild(this.containerElement));
  }
  removeHiddenContainer() {
    return v(this.containerElement);
  }
  processNode(e) {
    switch (e.nodeType) {
      case Node.TEXT_NODE:
        if (!this.isInsignificantTextNode(e))
          return this.appendBlockForTextNode(e), this.processTextNode(e);
        break;
      case Node.ELEMENT_NODE:
        return this.appendBlockForElement(e), this.processElement(e);
    }
  }
  appendBlockForTextNode(e) {
    let t = e.parentNode;
    if (
      t === this.currentBlockElement &&
      this.isBlockElement(e.previousSibling)
    )
      return this.appendStringWithAttributes(`
`);
    if (t === this.containerElement || this.isBlockElement(t)) {
      var n;
      let e = this.getBlockAttributes(t),
        r = this.getBlockHTMLAttributes(t);
      k(e, (n = this.currentBlock)?.attributes) ||
        ((this.currentBlock = this.appendBlockForAttributesWithElement(
          e,
          t,
          r,
        )),
        (this.currentBlockElement = t));
    }
  }
  appendBlockForElement(e) {
    let t = this.isBlockElement(e),
      n = _(this.currentBlockElement, e);
    if (t && !this.isBlockElement(e.firstChild)) {
      if (
        !this.isInsignificantTextNode(e.firstChild) ||
        !this.isBlockElement(e.firstElementChild)
      ) {
        let t = this.getBlockAttributes(e),
          r = this.getBlockHTMLAttributes(e);
        if (e.firstChild) {
          if (n && k(t, this.currentBlock.attributes))
            return this.appendStringWithAttributes(`
`);
          (this.currentBlock = this.appendBlockForAttributesWithElement(
            t,
            e,
            r,
          )),
            (this.currentBlockElement = e);
        }
      }
    } else if (this.currentBlockElement && !n && !t) {
      let t = this.findParentBlockElement(e);
      if (t) return this.appendBlockForElement(t);
      (this.currentBlock = this.appendEmptyBlock()),
        (this.currentBlockElement = null);
    }
  }
  findParentBlockElement(e) {
    let { parentElement: t } = e;
    for (; t && t !== this.containerElement; ) {
      if (this.isBlockElement(t) && this.blockElements.includes(t)) return t;
      t = t.parentElement;
    }
    return null;
  }
  processTextNode(e) {
    let t = e.data;
    var n;
    return (
      br(e.parentNode) ||
        ((t = B(t)), Er((n = e.previousSibling)?.textContent) && (t = wr(t))),
      this.appendStringWithAttributes(t, this.getTextAttributes(e.parentNode))
    );
  }
  processElement(e) {
    let t;
    if (ye(e)) {
      if (((t = vr(e, `attachment`)), Object.keys(t).length)) {
        let n = this.getTextAttributes(e);
        this.appendAttachmentWithAttributes(t, n), (e.innerHTML = ``);
      }
      return this.processedElements.push(e);
    }
    switch (y(e)) {
      case `br`:
        return (
          this.isExtraBR(e) ||
            this.isBlockElement(e.nextSibling) ||
            this.appendStringWithAttributes(
              `
`,
              this.getTextAttributes(e),
            ),
          this.processedElements.push(e)
        );
      case `img`:
        t = { url: e.getAttribute(`src`), contentType: `image` };
        let n = ((e) => {
          let t = e.getAttribute(`width`),
            n = e.getAttribute(`height`),
            r = {};
          return (
            t && (r.width = parseInt(t, 10)),
            n && (r.height = parseInt(n, 10)),
            r
          );
        })(e);
        for (let e in n) {
          let r = n[e];
          t[e] = r;
        }
        return (
          this.appendAttachmentWithAttributes(t, this.getTextAttributes(e)),
          this.processedElements.push(e)
        );
      case `tr`:
        if (this.needsTableSeparator(e))
          return this.appendStringWithAttributes(S.tableRowSeparator);
        break;
      case `td`:
        if (this.needsTableSeparator(e))
          return this.appendStringWithAttributes(S.tableCellSeparator);
    }
  }
  appendBlockForAttributesWithElement(e, t) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    this.blockElements.push(t);
    let r = (function () {
      return {
        text: [],
        attributes:
          arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
        htmlAttributes:
          arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      };
    })(e, n);
    return this.blocks.push(r), r;
  }
  appendEmptyBlock() {
    return this.appendBlockForAttributesWithElement([], null);
  }
  appendStringWithAttributes(e, t) {
    return this.appendPiece(gr(e, t));
  }
  appendAttachmentWithAttributes(e, t) {
    return this.appendPiece(
      (function (e) {
        return {
          attachment: e,
          attributes:
            arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
          type: `attachment`,
        };
      })(e, t),
    );
  }
  appendPiece(e) {
    return (
      this.blocks.length === 0 && this.appendEmptyBlock(),
      this.blocks[this.blocks.length - 1].text.push(e)
    );
  }
  appendStringToTextAtIndex(e, t) {
    let { text: n } = this.blocks[t],
      r = n[n.length - 1];
    if (r?.type !== `string`) return n.push(gr(e));
    r.string += e;
  }
  prependStringToTextAtIndex(e, t) {
    let { text: n } = this.blocks[t],
      r = n[0];
    if (r?.type !== `string`) return n.unshift(gr(e));
    r.string = e + r.string;
  }
  getTextAttributes(e) {
    let t,
      n = {};
    for (let r in C) {
      let i = C[r];
      if (
        i.tagName &&
        g(e, { matchingSelector: i.tagName, untilNode: this.containerElement })
      )
        n[r] = !0;
      else if (i.parser) {
        if (((t = i.parser(e)), t)) {
          let a = !1;
          for (let n of this.findBlockElementAncestors(e))
            if (i.parser(n) === t) {
              a = !0;
              break;
            }
          a || (n[r] = t);
        }
      } else
        i.styleProperty && ((t = e.style[i.styleProperty]), t && (n[r] = t));
    }
    if (ye(e)) {
      let r = vr(e, `attributes`);
      for (let e in r) (t = r[e]), (n[e] = t);
    }
    return n;
  }
  getBlockAttributes(e) {
    let t = [];
    for (; e && e !== this.containerElement; ) {
      for (let i in r) {
        let a = r[i];
        var n;
        !1 !== a.parse &&
          y(e) === a.tagName &&
          (((n = a.test) != null && n.call(a, e)) || !a.test) &&
          (t.push(i), a.listAttribute && t.push(a.listAttribute));
      }
      e = e.parentNode;
    }
    return t.reverse();
  }
  getBlockHTMLAttributes(e) {
    let t = {};
    return (
      (
        Object.values(r).find((t) => t.tagName === y(e))?.htmlAttributes || []
      ).forEach((n) => {
        e.hasAttribute(n) && (t[n] = e.getAttribute(n));
      }),
      t
    );
  }
  findBlockElementAncestors(e) {
    let t = [];
    for (; e && e !== this.containerElement; ) {
      let n = y(e);
      pe().includes(n) && t.push(e), (e = e.parentNode);
    }
    return t;
  }
  isBlockElement(e) {
    if (
      e?.nodeType === Node.ELEMENT_NODE &&
      !ye(e) &&
      !g(e, { matchingSelector: `td`, untilNode: this.containerElement })
    )
      return (
        pe().includes(y(e)) || window.getComputedStyle(e).display === `block`
      );
  }
  isInsignificantTextNode(e) {
    if (e?.nodeType !== Node.TEXT_NODE || !Tr(e.data)) return;
    let { parentNode: t, previousSibling: n, nextSibling: r } = e;
    return (xr(t.previousSibling) && !this.isBlockElement(t.previousSibling)) ||
      br(t)
      ? void 0
      : !n || this.isBlockElement(n) || !r || this.isBlockElement(r);
  }
  isExtraBR(e) {
    return (
      y(e) === `br` &&
      this.isBlockElement(e.parentNode) &&
      e.parentNode.lastChild === e
    );
  }
  needsTableSeparator(e) {
    if (S.removeBlankTableCells) {
      var t;
      let n = (t = e.previousSibling)?.textContent;
      return n && /\S/.test(n);
    }
    return e.previousSibling;
  }
  translateBlockElementMarginsToNewlines() {
    let e = this.getMarginOfDefaultBlockElement();
    for (let t = 0; t < this.blocks.length; t++) {
      let n = this.getMarginOfBlockElementAtIndex(t);
      n &&
        (n.top > 2 * e.top &&
          this.prependStringToTextAtIndex(
            `
`,
            t,
          ),
        n.bottom > 2 * e.bottom &&
          this.appendStringToTextAtIndex(
            `
`,
            t,
          ));
    }
  }
  getMarginOfBlockElementAtIndex(e) {
    let t = this.blockElements[e];
    if (
      t &&
      t.textContent &&
      !pe().includes(y(t)) &&
      !this.processedElements.includes(t)
    )
      return Sr(t);
  }
  getMarginOfDefaultBlockElement() {
    let e = b(r.default.tagName);
    return this.containerElement.appendChild(e), Sr(e);
  }
}
const br = function (e) {
    let { whiteSpace: t } = window.getComputedStyle(e);
    return [`pre`, `pre-wrap`, `pre-line`].includes(t);
  },
  xr = (e) => e && !Er(e.textContent),
  Sr = function (e) {
    let t = window.getComputedStyle(e);
    if (t.display === `block`)
      return { top: parseInt(t.marginTop), bottom: parseInt(t.marginBottom) };
  },
  Cr = function (e) {
    return y(e) === `style`
      ? NodeFilter.FILTER_REJECT
      : NodeFilter.FILTER_ACCEPT;
  },
  wr = (e) => e.replace(RegExp(`^${nt.source}+`), ``),
  Tr = (e) => RegExp(`^${nt.source}*\$`).test(e),
  Er = (e) => /\s$/.test(e),
  Dr = [
    `contenteditable`,
    `data-trix-id`,
    `data-trix-store-key`,
    `data-trix-mutable`,
    `data-trix-placeholder`,
    `tabindex`,
  ],
  Or = `data-trix-serialized-attributes`,
  kr = `[${Or}]`,
  Mr = /* @__PURE__ */ RegExp(`<!--block-->`, `g`),
  Nr = {
    "application/json": function (e) {
      let t;
      if (e instanceof ln) t = e;
      else {
        if (!(e instanceof HTMLElement)) throw Error(`unserializable object`);
        t = dn.parse(e.innerHTML).getDocument();
      }
      return t.toSerializableDocument().toJSONString();
    },
    "text/html": function (e) {
      let t;
      if (e instanceof ln) t = Ri.render(e);
      else {
        if (!(e instanceof HTMLElement)) throw Error(`unserializable object`);
        t = e.cloneNode(!0);
      }
      return (
        Array.from(t.querySelectorAll(`[data-trix-serialize=false]`)).forEach(
          (e) => {
            v(e);
          },
        ),
        Dr.forEach((e) => {
          Array.from(t.querySelectorAll(`[${e}]`)).forEach((t) => {
            t.removeAttribute(e);
          });
        }),
        Array.from(t.querySelectorAll(kr)).forEach((e) => {
          try {
            let t = JSON.parse(e.getAttribute(Or));
            e.removeAttribute(Or);
            for (let n in t) {
              let r = t[n];
              e.setAttribute(n, r);
            }
          } catch {}
        }),
        t.innerHTML.replace(Mr, ``)
      );
    },
  };
var Pr = Object.freeze({ __proto__: null });
class kn extends H {
  constructor(e, t) {
    super(...arguments),
      (this.attachmentManager = e),
      (this.attachment = t),
      (this.id = this.attachment.id),
      (this.file = this.attachment.file);
  }
  remove() {
    return this.attachmentManager.requestRemovalOfAttachment(this.attachment);
  }
}
kn.proxyMethod(`attachment.getAttribute`),
  kn.proxyMethod(`attachment.hasAttribute`),
  kn.proxyMethod(`attachment.setAttribute`),
  kn.proxyMethod(`attachment.getAttributes`),
  kn.proxyMethod(`attachment.setAttributes`),
  kn.proxyMethod(`attachment.isPending`),
  kn.proxyMethod(`attachment.isPreviewable`),
  kn.proxyMethod(`attachment.getURL`),
  kn.proxyMethod(`attachment.getPreviewURL`),
  kn.proxyMethod(`attachment.setPreviewURL`),
  kn.proxyMethod(`attachment.getHref`),
  kn.proxyMethod(`attachment.getFilename`),
  kn.proxyMethod(`attachment.getFilesize`),
  kn.proxyMethod(`attachment.getFormattedFilesize`),
  kn.proxyMethod(`attachment.getExtension`),
  kn.proxyMethod(`attachment.getContentType`),
  kn.proxyMethod(`attachment.getFile`),
  kn.proxyMethod(`attachment.setFile`),
  kn.proxyMethod(`attachment.releaseFile`),
  kn.proxyMethod(`attachment.getUploadProgress`),
  kn.proxyMethod(`attachment.setUploadProgress`);
class Tn extends H {
  constructor() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    super(...arguments),
      (this.managedAttachments = {}),
      Array.from(e).forEach((e) => {
        this.manageAttachment(e);
      });
  }
  getAttachments() {
    let e = [];
    for (let t in this.managedAttachments) {
      let n = this.managedAttachments[t];
      e.push(n);
    }
    return e;
  }
  manageAttachment(e) {
    return (
      this.managedAttachments[e.id] ||
        (this.managedAttachments[e.id] = new kn(this, e)),
      this.managedAttachments[e.id]
    );
  }
  attachmentIsManaged(e) {
    return e.id in this.managedAttachments;
  }
  requestRemovalOfAttachment(e) {
    var t, n;
    if (this.attachmentIsManaged(e))
      return (t = this.delegate) == null ||
        (n = t.attachmentManagerDidRequestRemovalOfAttachment) == null
        ? void 0
        : n.call(t, e);
  }
  unmanageAttachment(e) {
    let t = this.managedAttachments[e.id];
    return delete this.managedAttachments[e.id], t;
  }
}
class wn {
  constructor(e) {
    (this.composition = e), (this.document = this.composition.document);
    let t = this.composition.getSelectedRange();
    (this.startPosition = t[0]),
      (this.endPosition = t[1]),
      (this.startLocation = this.document.locationFromPosition(
        this.startPosition,
      )),
      (this.endLocation = this.document.locationFromPosition(this.endPosition)),
      (this.block = this.document.getBlockAtIndex(this.endLocation.index)),
      (this.breaksOnReturn = this.block.breaksOnReturn()),
      (this.previousCharacter = this.block.text.getStringAtPosition(
        this.endLocation.offset - 1,
      )),
      (this.nextCharacter = this.block.text.getStringAtPosition(
        this.endLocation.offset,
      ));
  }
  shouldInsertBlockBreak() {
    return this.block.hasAttributes() &&
      this.block.isListItem() &&
      !this.block.isEmpty()
      ? this.startLocation.offset !== 0
      : this.breaksOnReturn &&
          this.nextCharacter !==
            `
`;
  }
  shouldBreakFormattedBlock() {
    return (
      this.block.hasAttributes() &&
      !this.block.isListItem() &&
      ((this.breaksOnReturn &&
        this.nextCharacter ===
          `
`) ||
        this.previousCharacter ===
          `
`)
    );
  }
  shouldDecreaseListLevel() {
    return (
      this.block.hasAttributes() &&
      this.block.isListItem() &&
      this.block.isEmpty()
    );
  }
  shouldPrependListItem() {
    return (
      this.block.isListItem() &&
      this.startLocation.offset === 0 &&
      !this.block.isEmpty()
    );
  }
  shouldRemoveLastBlockAttribute() {
    return (
      this.block.hasAttributes() &&
      !this.block.isListItem() &&
      this.block.isEmpty()
    );
  }
}
class Ln extends H {
  constructor() {
    super(...arguments),
      (this.document = new ln()),
      (this.attachments = []),
      (this.currentAttributes = {}),
      (this.revision = 0);
  }
  setDocument(e) {
    var t, n;
    if (!e.isEqualTo(this.document))
      return (
        (this.document = e),
        this.refreshAttachments(),
        this.revision++,
        (t = this.delegate) == null ||
        (n = t.compositionDidChangeDocument) == null
          ? void 0
          : n.call(t, e)
      );
  }
  getSnapshot() {
    return { document: this.document, selectedRange: this.getSelectedRange() };
  }
  loadSnapshot(e) {
    var t, n, r, i;
    let { document: a, selectedRange: o } = e;
    return (
      (t = this.delegate) == null ||
        (n = t.compositionWillLoadSnapshot) == null ||
        n.call(t),
      this.setDocument(a ?? new ln()),
      this.setSelection(o ?? [0, 0]),
      (r = this.delegate) == null || (i = r.compositionDidLoadSnapshot) == null
        ? void 0
        : i.call(r)
    );
  }
  insertText(e) {
    let { updatePosition: t } =
        arguments.length > 1 && arguments[1] !== void 0
          ? arguments[1]
          : { updatePosition: !0 },
      n = this.getSelectedRange();
    this.setDocument(this.document.insertTextAtRange(e, n));
    let r = n[0],
      i = r + e.getLength();
    return (
      t && this.setSelection(i), this.notifyDelegateOfInsertionAtRange([r, i])
    );
  }
  insertBlock() {
    let e = new ln([
      arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : new $i(),
    ]);
    return this.insertDocument(e);
  }
  insertDocument() {
    let e =
        arguments.length > 0 && arguments[0] !== void 0
          ? arguments[0]
          : new ln(),
      t = this.getSelectedRange();
    this.setDocument(this.document.insertDocumentAtRange(e, t));
    let n = t[0],
      r = n + e.getLength();
    return this.setSelection(r), this.notifyDelegateOfInsertionAtRange([n, r]);
  }
  insertString(e, t) {
    let n = this.getCurrentTextAttributes(),
      r = Xi.textForStringWithAttributes(e, n);
    return this.insertText(r, t);
  }
  insertBlockBreak() {
    let e = this.getSelectedRange();
    this.setDocument(this.document.insertBlockBreakAtRange(e));
    let t = e[0],
      n = t + 1;
    return this.setSelection(n), this.notifyDelegateOfInsertionAtRange([t, n]);
  }
  insertLineBreak() {
    let e = new wn(this);
    if (e.shouldDecreaseListLevel())
      return this.decreaseListLevel(), this.setSelection(e.startPosition);
    if (e.shouldPrependListItem()) {
      let t = new ln([e.block.copyWithoutText()]);
      return this.insertDocument(t);
    }
    return e.shouldInsertBlockBreak()
      ? this.insertBlockBreak()
      : e.shouldRemoveLastBlockAttribute()
        ? this.removeLastBlockAttribute()
        : e.shouldBreakFormattedBlock()
          ? this.breakFormattedBlock(e)
          : this.insertString(`
`);
  }
  insertHTML(e) {
    let t = dn.parse(e, { purifyOptions: { SAFE_FOR_XML: !0 } }).getDocument(),
      n = this.getSelectedRange();
    this.setDocument(this.document.mergeDocumentAtRange(t, n));
    let r = n[0],
      i = r + t.getLength() - 1;
    return this.setSelection(i), this.notifyDelegateOfInsertionAtRange([r, i]);
  }
  replaceHTML(e) {
    let t = dn
        .parse(e)
        .getDocument()
        .copyUsingObjectsFromDocument(this.document),
      n = this.getLocationRange({ strict: !1 }),
      r = this.document.rangeFromLocationRange(n);
    return this.setDocument(t), this.setSelection(r);
  }
  insertFile(e) {
    return this.insertFiles([e]);
  }
  insertFiles(e) {
    let t = [];
    return (
      Array.from(e).forEach((e) => {
        var n;
        if ((n = this.delegate) != null && n.compositionShouldAcceptFile(e)) {
          let n = zi.attachmentForFile(e);
          t.push(n);
        }
      }),
      this.insertAttachments(t)
    );
  }
  insertAttachment(e) {
    return this.insertAttachments([e]);
  }
  insertAttachments(e) {
    let t = new Xi();
    return (
      Array.from(e).forEach((e) => {
        var r;
        let i = (r = n[e.getType()])?.presentation,
          a = this.getCurrentTextAttributes();
        i && (a.presentation = i);
        let o = Xi.textForAttachmentWithAttributes(e, a);
        t = t.appendText(o);
      }),
      this.insertText(t)
    );
  }
  shouldManageDeletingInDirection(e) {
    let t = this.getLocationRange();
    if (F(t)) {
      if (
        (e === `backward` && t[0].offset === 0) ||
        this.shouldManageMovingCursorInDirection(e)
      )
        return !0;
    } else if (t[0].index !== t[1].index) return !0;
    return !1;
  }
  deleteInDirection(e) {
    let t,
      n,
      r,
      { length: i } =
        arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      a = this.getLocationRange(),
      o = this.getSelectedRange(),
      s = F(o);
    if (
      (s
        ? (n = e === `backward` && a[0].offset === 0)
        : (r = a[0].index !== a[1].index),
      n && this.canDecreaseBlockAttributeLevel())
    ) {
      let e = this.getBlock();
      if (
        (e.isListItem()
          ? this.decreaseListLevel()
          : this.decreaseBlockAttributeLevel(),
        this.setSelection(o[0]),
        e.isEmpty())
      )
        return !1;
    }
    return (
      s &&
        ((o = this.getExpandedRangeInDirection(e, { length: i })),
        e === `backward` && (t = this.getAttachmentAtRange(o))),
      t
        ? (this.editAttachment(t), !1)
        : (this.setDocument(this.document.removeTextAtRange(o)),
          this.setSelection(o[0]),
          !n && !r && void 0)
    );
  }
  moveTextFromRange(e) {
    let [t] = Array.from(this.getSelectedRange());
    return (
      this.setDocument(this.document.moveTextFromRangeToPosition(e, t)),
      this.setSelection(t)
    );
  }
  removeAttachment(e) {
    let t = this.document.getRangeOfAttachment(e);
    if (t)
      return (
        this.stopEditingAttachment(),
        this.setDocument(this.document.removeTextAtRange(t)),
        this.setSelection(t[0])
      );
  }
  removeLastBlockAttribute() {
    let [e, t] = Array.from(this.getSelectedRange()),
      n = this.document.getBlockAtPosition(t);
    return (
      this.removeCurrentAttribute(n.getLastAttribute()), this.setSelection(e)
    );
  }
  insertPlaceholder() {
    return (
      (this.placeholderPosition = this.getPosition()), this.insertString(` `)
    );
  }
  selectPlaceholder() {
    if (this.placeholderPosition != null)
      return (
        this.setSelectedRange([
          this.placeholderPosition,
          this.placeholderPosition + 1,
        ]),
        this.getSelectedRange()
      );
  }
  forgetPlaceholder() {
    this.placeholderPosition = null;
  }
  hasCurrentAttribute(e) {
    let t = this.currentAttributes[e];
    return t != null && !1 !== t;
  }
  toggleCurrentAttribute(e) {
    let t = !this.currentAttributes[e];
    return t ? this.setCurrentAttribute(e, t) : this.removeCurrentAttribute(e);
  }
  canSetCurrentAttribute(e) {
    return M(e)
      ? this.canSetCurrentBlockAttribute(e)
      : this.canSetCurrentTextAttribute(e);
  }
  canSetCurrentTextAttribute(e) {
    let t = this.getSelectedDocument();
    if (t) {
      for (let e of Array.from(t.getAttachments()))
        if (!e.hasContent()) return !1;
      return !0;
    }
  }
  canSetCurrentBlockAttribute(e) {
    let t = this.getBlock();
    if (t) return !t.isTerminalBlock();
  }
  setCurrentAttribute(e, t) {
    return M(e)
      ? this.setBlockAttribute(e, t)
      : (this.setTextAttribute(e, t),
        (this.currentAttributes[e] = t),
        this.notifyDelegateOfCurrentAttributesChange());
  }
  setHTMLAtributeAtPosition(e, t, n) {
    var r;
    let i = this.document.getBlockAtPosition(e),
      a = (r = M(i.getLastAttribute()))?.htmlAttributes;
    if (i && a != null && a.includes(t)) {
      let r = this.document.setHTMLAttributeAtPosition(e, t, n);
      this.setDocument(r);
    }
  }
  setTextAttribute(e, t) {
    let n = this.getSelectedRange();
    if (!n) return;
    let [r, i] = Array.from(n);
    if (r !== i)
      return this.setDocument(this.document.addAttributeAtRange(e, t, n));
    if (e === `href`) {
      let e = Xi.textForStringWithAttributes(t, { href: t });
      return this.insertText(e);
    }
  }
  setBlockAttribute(e, t) {
    let n = this.getSelectedRange();
    if (this.canSetCurrentAttribute(e))
      return (
        this.setDocument(this.document.applyBlockAttributeAtRange(e, t, n)),
        this.setSelection(n)
      );
  }
  removeCurrentAttribute(e) {
    return M(e)
      ? (this.removeBlockAttribute(e), this.updateCurrentAttributes())
      : (this.removeTextAttribute(e),
        delete this.currentAttributes[e],
        this.notifyDelegateOfCurrentAttributesChange());
  }
  removeTextAttribute(e) {
    let t = this.getSelectedRange();
    if (t) return this.setDocument(this.document.removeAttributeAtRange(e, t));
  }
  removeBlockAttribute(e) {
    let t = this.getSelectedRange();
    if (t) return this.setDocument(this.document.removeAttributeAtRange(e, t));
  }
  canDecreaseNestingLevel() {
    var e;
    return (e = this.getBlock())?.getNestingLevel() > 0;
  }
  canIncreaseNestingLevel() {
    var e;
    let t = this.getBlock();
    if (t) {
      if ((e = M(t.getLastNestableAttribute())) == null || !e.listAttribute)
        return t.getNestingLevel() > 0;
      {
        let e = this.getPreviousBlock();
        if (e)
          return (function () {
            let e =
              arguments.length > 1 && arguments[1] !== void 0
                ? arguments[1]
                : [];
            return k(
              (arguments.length > 0 && arguments[0] !== void 0
                ? arguments[0]
                : []
              ).slice(0, e.length),
              e,
            );
          })(e.getListItemAttributes(), t.getListItemAttributes());
      }
    }
  }
  decreaseNestingLevel() {
    let e = this.getBlock();
    if (e)
      return this.setDocument(
        this.document.replaceBlock(e, e.decreaseNestingLevel()),
      );
  }
  increaseNestingLevel() {
    let e = this.getBlock();
    if (e)
      return this.setDocument(
        this.document.replaceBlock(e, e.increaseNestingLevel()),
      );
  }
  canDecreaseBlockAttributeLevel() {
    var e;
    return (e = this.getBlock())?.getAttributeLevel() > 0;
  }
  decreaseBlockAttributeLevel() {
    var e;
    let t = (e = this.getBlock())?.getLastAttribute();
    if (t) return this.removeCurrentAttribute(t);
  }
  decreaseListLevel() {
    let [e] = Array.from(this.getSelectedRange()),
      { index: t } = this.document.locationFromPosition(e),
      n = t,
      r = this.getBlock().getAttributeLevel(),
      i = this.document.getBlockAtIndex(n + 1);
    for (; i && i.isListItem() && !(i.getAttributeLevel() <= r); )
      n++, (i = this.document.getBlockAtIndex(n + 1));
    e = this.document.positionFromLocation({ index: t, offset: 0 });
    let a = this.document.positionFromLocation({ index: n, offset: 0 });
    return this.setDocument(
      this.document.removeLastListAttributeAtRange([e, a]),
    );
  }
  updateCurrentAttributes() {
    let e = this.getSelectedRange({ ignoreLock: !0 });
    if (e) {
      let t = this.document.getCommonAttributesAtRange(e);
      if (
        (Array.from(Le()).forEach((e) => {
          t[e] || this.canSetCurrentAttribute(e) || (t[e] = !1);
        }),
        !Ye(t, this.currentAttributes))
      )
        return (
          (this.currentAttributes = t),
          this.notifyDelegateOfCurrentAttributesChange()
        );
    }
  }
  getCurrentAttributes() {
    return f.call({}, this.currentAttributes);
  }
  getCurrentTextAttributes() {
    let e = {};
    for (let t in this.currentAttributes) {
      let n = this.currentAttributes[t];
      !1 !== n && ze(t) && (e[t] = n);
    }
    return e;
  }
  freezeSelection() {
    return this.setCurrentAttribute(`frozen`, !0);
  }
  thawSelection() {
    return this.removeCurrentAttribute(`frozen`);
  }
  hasFrozenSelection() {
    return this.hasCurrentAttribute(`frozen`);
  }
  setSelection(e) {
    var t;
    let n = this.document.locationRangeFromRange(e);
    return (t =
      this.delegate)?.compositionDidRequestChangingSelectionToLocationRange(n);
  }
  getSelectedRange() {
    let e = this.getLocationRange();
    if (e) return this.document.rangeFromLocationRange(e);
  }
  setSelectedRange(e) {
    let t = this.document.locationRangeFromRange(e);
    return this.getSelectionManager().setLocationRange(t);
  }
  getPosition() {
    let e = this.getLocationRange();
    if (e) return this.document.positionFromLocation(e[0]);
  }
  getLocationRange(e) {
    return this.targetLocationRange
      ? this.targetLocationRange
      : this.getSelectionManager().getLocationRange(e) ||
          P({ index: 0, offset: 0 });
  }
  withTargetLocationRange(e, t) {
    let n;
    this.targetLocationRange = e;
    try {
      n = t();
    } finally {
      this.targetLocationRange = null;
    }
    return n;
  }
  withTargetRange(e, t) {
    let n = this.document.locationRangeFromRange(e);
    return this.withTargetLocationRange(n, t);
  }
  withTargetDOMRange(e, t) {
    let n = this.createLocationRangeFromDOMRange(e, { strict: !1 });
    return this.withTargetLocationRange(n, t);
  }
  getExpandedRangeInDirection(e) {
    let { length: t } =
        arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      [n, r] = Array.from(this.getSelectedRange());
    return (
      e === `backward`
        ? t
          ? (n -= t)
          : (n = this.translateUTF16PositionFromOffset(n, -1))
        : t
          ? (r += t)
          : (r = this.translateUTF16PositionFromOffset(r, 1)),
      P([n, r])
    );
  }
  shouldManageMovingCursorInDirection(e) {
    if (this.editingAttachment) return !0;
    let t = this.getExpandedRangeInDirection(e);
    return this.getAttachmentAtRange(t) != null;
  }
  moveCursorInDirection(e) {
    let t, n;
    if (this.editingAttachment)
      n = this.document.getRangeOfAttachment(this.editingAttachment);
    else {
      let r = this.getSelectedRange();
      (n = this.getExpandedRangeInDirection(e)), (t = !Xe(r, n));
    }
    if (
      (e === `backward`
        ? this.setSelectedRange(n[0])
        : this.setSelectedRange(n[1]),
      t)
    ) {
      let e = this.getAttachmentAtRange(n);
      if (e) return this.editAttachment(e);
    }
  }
  expandSelectionInDirection(e) {
    let { length: t } =
        arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      n = this.getExpandedRangeInDirection(e, { length: t });
    return this.setSelectedRange(n);
  }
  expandSelectionForEditing() {
    if (this.hasCurrentAttribute(`href`))
      return this.expandSelectionAroundCommonAttribute(`href`);
  }
  expandSelectionAroundCommonAttribute(e) {
    let t = this.getPosition(),
      n = this.document.getRangeOfCommonAttributeAtPosition(e, t);
    return this.setSelectedRange(n);
  }
  selectionContainsAttachments() {
    var e;
    return (e = this.getSelectedAttachments())?.length > 0;
  }
  selectionIsInCursorTarget() {
    return (
      this.editingAttachment || this.positionIsCursorTarget(this.getPosition())
    );
  }
  positionIsCursorTarget(e) {
    let t = this.document.locationFromPosition(e);
    if (t) return this.locationIsCursorTarget(t);
  }
  positionIsBlockBreak(e) {
    var t;
    return (t = this.document.getPieceAtPosition(e))?.isBlockBreak();
  }
  getSelectedDocument() {
    let e = this.getSelectedRange();
    if (e) return this.document.getDocumentAtRange(e);
  }
  getSelectedAttachments() {
    var e;
    return (e = this.getSelectedDocument())?.getAttachments();
  }
  getAttachments() {
    return this.attachments.slice(0);
  }
  refreshAttachments() {
    let e = this.document.getAttachments(),
      { added: t, removed: n } = (function () {
        let e =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [],
          t =
            arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [],
          n = [],
          r = [],
          i = /* @__PURE__ */ new Set();
        e.forEach((e) => {
          i.add(e);
        });
        let a = /* @__PURE__ */ new Set();
        return (
          t.forEach((e) => {
            a.add(e), i.has(e) || n.push(e);
          }),
          e.forEach((e) => {
            a.has(e) || r.push(e);
          }),
          { added: n, removed: r }
        );
      })(this.attachments, e);
    return (
      (this.attachments = e),
      Array.from(n).forEach((e) => {
        var t, n;
        (e.delegate = null),
          (t = this.delegate) == null ||
            (n = t.compositionDidRemoveAttachment) == null ||
            n.call(t, e);
      }),
      (() => {
        let e = [];
        return (
          Array.from(t).forEach((t) => {
            var n, r;
            (t.delegate = this),
              e.push(
                (n = this.delegate) == null ||
                  (r = n.compositionDidAddAttachment) == null
                  ? void 0
                  : r.call(n, t),
              );
          }),
          e
        );
      })()
    );
  }
  attachmentDidChangeAttributes(e) {
    var t, n;
    return (
      this.revision++,
      (t = this.delegate) == null ||
      (n = t.compositionDidEditAttachment) == null
        ? void 0
        : n.call(t, e)
    );
  }
  attachmentDidChangePreviewURL(e) {
    var t, n;
    return (
      this.revision++,
      (t = this.delegate) == null ||
      (n = t.compositionDidChangeAttachmentPreviewURL) == null
        ? void 0
        : n.call(t, e)
    );
  }
  editAttachment(e, t) {
    var n, r;
    if (e !== this.editingAttachment)
      return (
        this.stopEditingAttachment(),
        (this.editingAttachment = e),
        (n = this.delegate) == null ||
        (r = n.compositionDidStartEditingAttachment) == null
          ? void 0
          : r.call(n, this.editingAttachment, t)
      );
  }
  stopEditingAttachment() {
    var e, t;
    this.editingAttachment &&=
      ((e = this.delegate) == null ||
        (t = e.compositionDidStopEditingAttachment) == null ||
        t.call(e, this.editingAttachment),
      null);
  }
  updateAttributesForAttachment(e, t) {
    return this.setDocument(this.document.updateAttributesForAttachment(e, t));
  }
  removeAttributeForAttachment(e, t) {
    return this.setDocument(this.document.removeAttributeForAttachment(e, t));
  }
  breakFormattedBlock(e) {
    let { document: t } = e,
      { block: n } = e,
      r = e.startPosition,
      i = [r - 1, r];
    n.getBlockBreakPosition() === e.startLocation.offset
      ? (n.breaksOnReturn() &&
        e.nextCharacter ===
          `
`
          ? (r += 1)
          : (t = t.removeTextAtRange(i)),
        (i = [r, r]))
      : e.nextCharacter ===
          `
`
        ? e.previousCharacter ===
          `
`
          ? (i = [r - 1, r + 1])
          : ((i = [r, r + 1]), (r += 1))
        : e.startLocation.offset - 1 != 0 && (r += 1);
    let a = new ln([n.removeLastAttribute().copyWithoutText()]);
    return (
      this.setDocument(t.insertDocumentAtRange(a, i)), this.setSelection(r)
    );
  }
  getPreviousBlock() {
    let e = this.getLocationRange();
    if (e) {
      let { index: t } = e[0];
      if (t > 0) return this.document.getBlockAtIndex(t - 1);
    }
  }
  getBlock() {
    let e = this.getLocationRange();
    if (e) return this.document.getBlockAtIndex(e[0].index);
  }
  getAttachmentAtRange(e) {
    let t = this.document.getDocumentAtRange(e);
    if (
      t.toString() ===
      `￼
`
    )
      return t.getAttachments()[0];
  }
  notifyDelegateOfCurrentAttributesChange() {
    var e, t;
    return (e = this.delegate) == null ||
      (t = e.compositionDidChangeCurrentAttributes) == null
      ? void 0
      : t.call(e, this.currentAttributes);
  }
  notifyDelegateOfInsertionAtRange(e) {
    var t, n;
    return (t = this.delegate) == null ||
      (n = t.compositionDidPerformInsertionAtRange) == null
      ? void 0
      : n.call(t, e);
  }
  translateUTF16PositionFromOffset(e, t) {
    let n = this.document.toUTF16String(),
      r = n.offsetFromUCS2Offset(e);
    return n.offsetToUCS2Offset(r + t);
  }
}
Ln.proxyMethod(`getSelectionManager().getPointRange`),
  Ln.proxyMethod(`getSelectionManager().setLocationRangeFromPointRange`),
  Ln.proxyMethod(`getSelectionManager().createLocationRangeFromDOMRange`),
  Ln.proxyMethod(`getSelectionManager().locationIsCursorTarget`),
  Ln.proxyMethod(`getSelectionManager().selectionIsExpanded`),
  Ln.proxyMethod(`delegate?.getSelectionManager`);
class Dn extends H {
  constructor(e) {
    super(...arguments),
      (this.composition = e),
      (this.undoEntries = []),
      (this.redoEntries = []);
  }
  recordUndoEntry(e) {
    let { context: t, consolidatable: n } =
        arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      r = this.undoEntries.slice(-1)[0];
    if (!n || !Fr(r, e, t)) {
      let n = this.createEntry({ description: e, context: t });
      this.undoEntries.push(n), (this.redoEntries = []);
    }
  }
  undo() {
    let e = this.undoEntries.pop();
    if (e) {
      let t = this.createEntry(e);
      return (
        this.redoEntries.push(t), this.composition.loadSnapshot(e.snapshot)
      );
    }
  }
  redo() {
    let e = this.redoEntries.pop();
    if (e) {
      let t = this.createEntry(e);
      return (
        this.undoEntries.push(t), this.composition.loadSnapshot(e.snapshot)
      );
    }
  }
  canUndo() {
    return this.undoEntries.length > 0;
  }
  canRedo() {
    return this.redoEntries.length > 0;
  }
  createEntry() {
    let { description: e, context: t } =
      arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return {
      description: e?.toString(),
      context: JSON.stringify(t),
      snapshot: this.composition.getSnapshot(),
    };
  }
}
const Fr = (e, t, n) =>
    e?.description === t?.toString() && e?.context === JSON.stringify(n),
  Ir = `attachmentGallery`;
class On {
  constructor(e) {
    (this.document = e.document), (this.selectedRange = e.selectedRange);
  }
  perform() {
    return this.removeBlockAttribute(), this.applyBlockAttribute();
  }
  getSnapshot() {
    return { document: this.document, selectedRange: this.selectedRange };
  }
  removeBlockAttribute() {
    return this.findRangesOfBlocks().map(
      (e) => (this.document = this.document.removeAttributeAtRange(Ir, e)),
    );
  }
  applyBlockAttribute() {
    let e = 0;
    this.findRangesOfPieces().forEach((t) => {
      t[1] - t[0] > 1 &&
        ((t[0] += e),
        (t[1] += e),
        this.document.getCharacterAtPosition(t[1]) !==
          `
` &&
          ((this.document = this.document.insertBlockBreakAtRange(t[1])),
          t[1] < this.selectedRange[1] && this.moveSelectedRangeForward(),
          t[1]++,
          e++),
        t[0] !== 0 &&
          this.document.getCharacterAtPosition(t[0] - 1) !==
            `
` &&
          ((this.document = this.document.insertBlockBreakAtRange(t[0])),
          t[0] < this.selectedRange[0] && this.moveSelectedRangeForward(),
          t[0]++,
          e++),
        (this.document = this.document.applyBlockAttributeAtRange(Ir, !0, t)));
    });
  }
  findRangesOfBlocks() {
    return this.document.findRangesForBlockAttribute(Ir);
  }
  findRangesOfPieces() {
    return this.document.findRangesForTextAttribute(`presentation`, {
      withValue: `gallery`,
    });
  }
  moveSelectedRangeForward() {
    (this.selectedRange[0] += 1), (this.selectedRange[1] += 1);
  }
}
const Lr = function (e) {
    let t = new On(e);
    return t.perform(), t.getSnapshot();
  },
  Rr = [Lr];
class Mn {
  constructor(e, t, n) {
    (this.insertFiles = this.insertFiles.bind(this)),
      (this.composition = e),
      (this.selectionManager = t),
      (this.element = n),
      (this.undoManager = new Dn(this.composition)),
      (this.filters = Rr.slice(0));
  }
  loadDocument(e) {
    return this.loadSnapshot({ document: e, selectedRange: [0, 0] });
  }
  loadHTML() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ``,
      t = dn.parse(e, { referenceElement: this.element }).getDocument();
    return this.loadDocument(t);
  }
  loadJSON(e) {
    let { document: t, selectedRange: n } = e;
    return (
      (t = ln.fromJSON(t)), this.loadSnapshot({ document: t, selectedRange: n })
    );
  }
  loadSnapshot(e) {
    return (
      (this.undoManager = new Dn(this.composition)),
      this.composition.loadSnapshot(e)
    );
  }
  getDocument() {
    return this.composition.document;
  }
  getSelectedDocument() {
    return this.composition.getSelectedDocument();
  }
  getSnapshot() {
    return this.composition.getSnapshot();
  }
  toJSON() {
    return this.getSnapshot();
  }
  deleteInDirection(e) {
    return this.composition.deleteInDirection(e);
  }
  insertAttachment(e) {
    return this.composition.insertAttachment(e);
  }
  insertAttachments(e) {
    return this.composition.insertAttachments(e);
  }
  insertDocument(e) {
    return this.composition.insertDocument(e);
  }
  insertFile(e) {
    return this.composition.insertFile(e);
  }
  insertFiles(e) {
    return this.composition.insertFiles(e);
  }
  insertHTML(e) {
    return this.composition.insertHTML(e);
  }
  insertString(e) {
    return this.composition.insertString(e);
  }
  insertText(e) {
    return this.composition.insertText(e);
  }
  insertLineBreak() {
    return this.composition.insertLineBreak();
  }
  getSelectedRange() {
    return this.composition.getSelectedRange();
  }
  getPosition() {
    return this.composition.getPosition();
  }
  getClientRectAtPosition(e) {
    let t = this.getDocument().locationRangeFromRange([e, e + 1]);
    return this.selectionManager.getClientRectAtLocationRange(t);
  }
  expandSelectionInDirection(e) {
    return this.composition.expandSelectionInDirection(e);
  }
  moveCursorInDirection(e) {
    return this.composition.moveCursorInDirection(e);
  }
  setSelectedRange(e) {
    return this.composition.setSelectedRange(e);
  }
  activateAttribute(e) {
    let t = !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
    return this.composition.setCurrentAttribute(e, t);
  }
  attributeIsActive(e) {
    return this.composition.hasCurrentAttribute(e);
  }
  canActivateAttribute(e) {
    return this.composition.canSetCurrentAttribute(e);
  }
  deactivateAttribute(e) {
    return this.composition.removeCurrentAttribute(e);
  }
  setHTMLAtributeAtPosition(e, t, n) {
    this.composition.setHTMLAtributeAtPosition(e, t, n);
  }
  canDecreaseNestingLevel() {
    return this.composition.canDecreaseNestingLevel();
  }
  canIncreaseNestingLevel() {
    return this.composition.canIncreaseNestingLevel();
  }
  decreaseNestingLevel() {
    if (this.canDecreaseNestingLevel())
      return this.composition.decreaseNestingLevel();
  }
  increaseNestingLevel() {
    if (this.canIncreaseNestingLevel())
      return this.composition.increaseNestingLevel();
  }
  canRedo() {
    return this.undoManager.canRedo();
  }
  canUndo() {
    return this.undoManager.canUndo();
  }
  recordUndoEntry(e) {
    let { context: t, consolidatable: n } =
      arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return this.undoManager.recordUndoEntry(e, {
      context: t,
      consolidatable: n,
    });
  }
  redo() {
    if (this.canRedo()) return this.undoManager.redo();
  }
  undo() {
    if (this.canUndo()) return this.undoManager.undo();
  }
}
class Bn {
  constructor(e) {
    this.element = e;
  }
  findLocationFromContainerAndOffset(e, t) {
    let { strict: n } =
        arguments.length > 2 && arguments[2] !== void 0
          ? arguments[2]
          : { strict: !0 },
      r = 0,
      i = !1,
      a = { index: 0, offset: 0 },
      o = this.findAttachmentElementParentForNode(e);
    o && ((e = o.parentNode), (t = ue(o)));
    let s = de(this.element, { usingFilter: Ur });
    for (; s.nextNode(); ) {
      let o = s.currentNode;
      if (o === e && x(e)) {
        ve(o) || (a.offset += t);
        break;
      }
      if (o.parentNode === e) {
        if (r++ === t) {
          !n &&
            he(o, { strict: n }) &&
            (i && a.index++, (a.offset = 0), (i = !0));
          break;
        }
      } else if (!_(e, o) && r > 0) break;
      he(o, { strict: n })
        ? (i && a.index++, (a.offset = 0), (i = !0))
        : (a.offset += Br(o));
    }
    return a;
  }
  findContainerAndOffsetFromLocation(e) {
    let t, n;
    if (e.index === 0 && e.offset === 0) {
      for (t = this.element, n = 0; t.firstChild; )
        if (((t = t.firstChild), me(t))) {
          n = 1;
          break;
        }
      return [t, n];
    }
    let [r, i] = this.findNodeAndOffsetFromLocation(e);
    if (r) {
      if (x(r))
        Br(r) === 0
          ? ((t = r.parentNode.parentNode),
            (n = ue(r.parentNode)),
            ve(r, { name: `right` }) && n++)
          : ((t = r), (n = e.offset - i));
      else {
        if (((t = r.parentNode), !he(r.previousSibling) && !me(t)))
          for (; r === t.lastChild && ((r = t), (t = t.parentNode), !me(t)); );
        (n = ue(r)), e.offset !== 0 && n++;
      }
      return [t, n];
    }
  }
  findNodeAndOffsetFromLocation(e) {
    let t,
      n,
      r = 0;
    for (let i of this.getSignificantNodesForIndex(e.index)) {
      let a = Br(i);
      if (e.offset <= r + a)
        if (x(i)) {
          if (((t = i), (n = r), e.offset === n && ve(t))) break;
        } else t || ((t = i), (n = r));
      if (((r += a), r > e.offset)) break;
    }
    return [t, n];
  }
  findAttachmentElementParentForNode(e) {
    for (; e && e !== this.element; ) {
      if (ye(e)) return e;
      e = e.parentNode;
    }
  }
  getSignificantNodesForIndex(e) {
    let t = [],
      n = de(this.element, { usingFilter: Vr }),
      r = !1;
    for (; n.nextNode(); ) {
      let a = n.currentNode;
      var i;
      if (ge(a)) {
        if ((i == null ? (i = 0) : i++, i === e)) r = !0;
        else if (r) break;
      } else r && t.push(a);
    }
    return t;
  }
}
const Br = function (e) {
    return e.nodeType === Node.TEXT_NODE
      ? ve(e)
        ? 0
        : e.textContent.length
      : y(e) === `br` || ye(e)
        ? 1
        : 0;
  },
  Vr = function (e) {
    return Hr(e) === NodeFilter.FILTER_ACCEPT
      ? Ur(e)
      : NodeFilter.FILTER_REJECT;
  },
  Hr = function (e) {
    return be(e) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
  },
  Ur = function (e) {
    return ye(e.parentNode)
      ? NodeFilter.FILTER_REJECT
      : NodeFilter.FILTER_ACCEPT;
  };
class Vn {
  createDOMRangeFromPoint(e) {
    let t,
      { x: n, y: r } = e;
    if (document.caretPositionFromPoint) {
      let { offsetNode: e, offset: i } = document.caretPositionFromPoint(n, r);
      return (t = document.createRange()), t.setStart(e, i), t;
    }
    if (document.caretRangeFromPoint) return document.caretRangeFromPoint(n, r);
    if (document.body.createTextRange) {
      let e = L();
      try {
        let e = document.body.createTextRange();
        e.moveToPoint(n, r), e.select();
      } catch {}
      return (t = L()), R(e), t;
    }
  }
  getClientRectsForDOMRange(e) {
    let t = Array.from(e.getClientRects());
    return [t[0], t[t.length - 1]];
  }
}
class zn extends H {
  constructor(e) {
    super(...arguments),
      (this.didMouseDown = this.didMouseDown.bind(this)),
      (this.selectionDidChange = this.selectionDidChange.bind(this)),
      (this.element = e),
      (this.locationMapper = new Bn(this.element)),
      (this.pointMapper = new Vn()),
      (this.lockCount = 0),
      m(`mousedown`, {
        onElement: this.element,
        withCallback: this.didMouseDown,
      });
  }
  getLocationRange() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return !1 === e.strict
      ? this.createLocationRangeFromDOMRange(L())
      : e.ignoreLock
        ? this.currentLocationRange
        : this.lockedLocationRange
          ? this.lockedLocationRange
          : this.currentLocationRange;
  }
  setLocationRange(e) {
    if (this.lockedLocationRange) return;
    e = P(e);
    let t = this.createDOMRangeFromLocationRange(e);
    t && (R(t), this.updateCurrentLocationRange(e));
  }
  setLocationRangeFromPointRange(e) {
    e = P(e);
    let t = this.getLocationAtPoint(e[0]),
      n = this.getLocationAtPoint(e[1]);
    this.setLocationRange([t, n]);
  }
  getClientRectAtLocationRange(e) {
    let t = this.createDOMRangeFromLocationRange(e);
    if (t) return this.getClientRectsForDOMRange(t)[1];
  }
  locationIsCursorTarget(e) {
    let t = Array.from(this.findNodeAndOffsetFromLocation(e))[0];
    return ve(t);
  }
  lock() {
    this.lockCount++ == 0 &&
      (this.updateCurrentLocationRange(),
      (this.lockedLocationRange = this.getLocationRange()));
  }
  unlock() {
    if (--this.lockCount == 0) {
      let { lockedLocationRange: e } = this;
      if (((this.lockedLocationRange = null), e != null))
        return this.setLocationRange(e);
    }
  }
  clearSelection() {
    var e;
    return (e = $e())?.removeAllRanges();
  }
  selectionIsCollapsed() {
    var e;
    return !0 === (e = L())?.collapsed;
  }
  selectionIsExpanded() {
    return !this.selectionIsCollapsed();
  }
  createLocationRangeFromDOMRange(e, t) {
    if (e == null || !this.domRangeWithinElement(e)) return;
    let n = this.findLocationFromContainerAndOffset(
      e.startContainer,
      e.startOffset,
      t,
    );
    return n
      ? P([
          n,
          e.collapsed
            ? void 0
            : this.findLocationFromContainerAndOffset(
                e.endContainer,
                e.endOffset,
                t,
              ),
        ])
      : void 0;
  }
  didMouseDown() {
    return this.pauseTemporarily();
  }
  pauseTemporarily() {
    let e;
    this.paused = !0;
    let t = () => {
        if (
          ((this.paused = !1),
          clearTimeout(n),
          Array.from(e).forEach((e) => {
            e.destroy();
          }),
          _(document, this.element))
        )
          return this.selectionDidChange();
      },
      n = setTimeout(t, 200);
    e = [`mousemove`, `keydown`].map((e) =>
      m(e, { onElement: document, withCallback: t }),
    );
  }
  selectionDidChange() {
    if (!this.paused && !le(this.element))
      return this.updateCurrentLocationRange();
  }
  updateCurrentLocationRange(e) {
    var t, n;
    if (
      (e ??= this.createLocationRangeFromDOMRange(L())) &&
      !Xe(e, this.currentLocationRange)
    )
      return (
        (this.currentLocationRange = e),
        (t = this.delegate) == null || (n = t.locationRangeDidChange) == null
          ? void 0
          : n.call(t, this.currentLocationRange.slice(0))
      );
  }
  createDOMRangeFromLocationRange(e) {
    let t = this.findContainerAndOffsetFromLocation(e[0]),
      n = F(e) ? t : this.findContainerAndOffsetFromLocation(e[1]) || t;
    if (t != null && n != null) {
      let e = document.createRange();
      return (
        e.setStart(...Array.from(t || [])), e.setEnd(...Array.from(n || [])), e
      );
    }
  }
  getLocationAtPoint(e) {
    let t = this.createDOMRangeFromPoint(e);
    var n;
    if (t) return (n = this.createLocationRangeFromDOMRange(t))?.[0];
  }
  domRangeWithinElement(e) {
    return e.collapsed
      ? _(this.element, e.startContainer)
      : _(this.element, e.startContainer) && _(this.element, e.endContainer);
  }
}
zn.proxyMethod(`locationMapper.findLocationFromContainerAndOffset`),
  zn.proxyMethod(`locationMapper.findContainerAndOffsetFromLocation`),
  zn.proxyMethod(`locationMapper.findNodeAndOffsetFromLocation`),
  zn.proxyMethod(`pointMapper.createDOMRangeFromPoint`),
  zn.proxyMethod(`pointMapper.getClientRectsForDOMRange`);
var Wr = Object.freeze({
    __proto__: null,
    Attachment: zi,
    AttachmentManager: Tn,
    AttachmentPiece: qi,
    Block: $i,
    Composition: Ln,
    Document: ln,
    Editor: Mn,
    HTMLParser: dn,
    HTMLSanitizer: gi,
    LineBreakInsertion: wn,
    LocationMapper: Bn,
    ManagedAttachment: kn,
    Piece: Ui,
    PointMapper: Vn,
    SelectionManager: zn,
    SplittableList: Ji,
    StringPiece: Hi,
    Text: Xi,
    UndoManager: Dn,
  }),
  Gr = Object.freeze({
    __proto__: null,
    ObjectView: ne,
    AttachmentView: fi,
    BlockView: Si,
    DocumentView: Ri,
    PieceView: yi,
    PreviewableAttachmentView: Ai,
    TextView: xi,
  });
const { lang: Kr, css: qr, keyNames: Jr } = E,
  Yr = function (e) {
    return function () {
      let t = e.apply(this, arguments);
      t.do(), (this.undos ||= []), this.undos.push(t.undo);
    };
  };
class Xn extends H {
  constructor(e, t, n) {
    let r = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    super(...arguments),
      Y(
        this,
        `makeElementMutable`,
        Yr(() => ({
          do: () => {
            this.element.dataset.trixMutable = !0;
          },
          undo: () => delete this.element.dataset.trixMutable,
        })),
      ),
      Y(
        this,
        `addToolbar`,
        Yr(() => {
          let e = b({
            tagName: `div`,
            className: qr.attachmentToolbar,
            data: { trixMutable: !0 },
            childNodes: b({
              tagName: `div`,
              className: `trix-button-row`,
              childNodes: b({
                tagName: `span`,
                className: `trix-button-group trix-button-group--actions`,
                childNodes: b({
                  tagName: `button`,
                  className: `trix-button trix-button--remove`,
                  textContent: Kr.remove,
                  attributes: { title: Kr.remove },
                  data: { trixAction: `remove` },
                }),
              }),
            }),
          });
          return (
            this.attachment.isPreviewable() &&
              e.appendChild(
                b({
                  tagName: `div`,
                  className: qr.attachmentMetadataContainer,
                  childNodes: b({
                    tagName: `span`,
                    className: qr.attachmentMetadata,
                    childNodes: [
                      b({
                        tagName: `span`,
                        className: qr.attachmentName,
                        textContent: this.attachment.getFilename(),
                        attributes: { title: this.attachment.getFilename() },
                      }),
                      b({
                        tagName: `span`,
                        className: qr.attachmentSize,
                        textContent: this.attachment.getFormattedFilesize(),
                      }),
                    ],
                  }),
                }),
              ),
            m(`click`, { onElement: e, withCallback: this.didClickToolbar }),
            m(`click`, {
              onElement: e,
              matchingSelector: `[data-trix-action]`,
              withCallback: this.didClickActionButton,
            }),
            h(`trix-attachment-before-toolbar`, {
              onElement: this.element,
              attributes: { toolbar: e, attachment: this.attachment },
            }),
            { do: () => this.element.appendChild(e), undo: () => v(e) }
          );
        }),
      ),
      Y(
        this,
        `installCaptionEditor`,
        Yr(() => {
          let e = b({
            tagName: `textarea`,
            className: qr.attachmentCaptionEditor,
            attributes: { placeholder: Kr.captionPlaceholder },
            data: { trixMutable: !0 },
          });
          e.value = this.attachmentPiece.getCaption();
          let t = e.cloneNode();
          t.classList.add(`trix-autoresize-clone`), (t.tabIndex = -1);
          let n = function () {
            (t.value = e.value), (e.style.height = t.scrollHeight + `px`);
          };
          m(`input`, { onElement: e, withCallback: n }),
            m(`input`, { onElement: e, withCallback: this.didInputCaption }),
            m(`keydown`, {
              onElement: e,
              withCallback: this.didKeyDownCaption,
            }),
            m(`change`, { onElement: e, withCallback: this.didChangeCaption }),
            m(`blur`, { onElement: e, withCallback: this.didBlurCaption });
          let r = this.element.querySelector(`figcaption`),
            i = r.cloneNode();
          return {
            do: () => {
              if (
                ((r.style.display = `none`),
                i.appendChild(e),
                i.appendChild(t),
                i.classList.add(`${qr.attachmentCaption}--editing`),
                r.parentElement.insertBefore(i, r),
                n(),
                this.options.editCaption)
              )
                return qe(() => e.focus());
            },
            undo() {
              v(i), (r.style.display = null);
            },
          };
        }),
      ),
      (this.didClickToolbar = this.didClickToolbar.bind(this)),
      (this.didClickActionButton = this.didClickActionButton.bind(this)),
      (this.didKeyDownCaption = this.didKeyDownCaption.bind(this)),
      (this.didInputCaption = this.didInputCaption.bind(this)),
      (this.didChangeCaption = this.didChangeCaption.bind(this)),
      (this.didBlurCaption = this.didBlurCaption.bind(this)),
      (this.attachmentPiece = e),
      (this.element = t),
      (this.container = n),
      (this.options = r),
      (this.attachment = this.attachmentPiece.attachment),
      y(this.element) === `a` && (this.element = this.element.firstChild),
      this.install();
  }
  install() {
    this.makeElementMutable(),
      this.addToolbar(),
      this.attachment.isPreviewable() && this.installCaptionEditor();
  }
  uninstall() {
    var e;
    let t = this.undos.pop();
    for (this.savePendingCaption(); t; ) t(), (t = this.undos.pop());
    (e = this.delegate) == null || e.didUninstallAttachmentEditor(this);
  }
  savePendingCaption() {
    if (this.pendingCaption != null) {
      let i = this.pendingCaption;
      var e, t, n, r;
      (this.pendingCaption = null),
        i
          ? (e = this.delegate) == null ||
            (t = e.attachmentEditorDidRequestUpdatingAttributesForAttachment) ==
              null ||
            t.call(e, { caption: i }, this.attachment)
          : (n = this.delegate) == null ||
            (r = n.attachmentEditorDidRequestRemovingAttributeForAttachment) ==
              null ||
            r.call(n, `caption`, this.attachment);
    }
  }
  didClickToolbar(e) {
    return e.preventDefault(), e.stopPropagation();
  }
  didClickActionButton(e) {
    var t;
    if (e.target.getAttribute(`data-trix-action`) === `remove`)
      return (t = this.delegate)?.attachmentEditorDidRequestRemovalOfAttachment(
        this.attachment,
      );
  }
  didKeyDownCaption(e) {
    var t, n;
    if (Jr[e.keyCode] === `return`)
      return (
        e.preventDefault(),
        this.savePendingCaption(),
        (t = this.delegate) == null ||
        (n = t.attachmentEditorDidRequestDeselectingAttachment) == null
          ? void 0
          : n.call(t, this.attachment)
      );
  }
  didInputCaption(e) {
    this.pendingCaption = e.target.value.replace(/\s/g, ` `).trim();
  }
  didChangeCaption(e) {
    return this.savePendingCaption();
  }
  didBlurCaption(e) {
    return this.savePendingCaption();
  }
}
class $n extends H {
  constructor(e, n) {
    super(...arguments),
      (this.didFocus = this.didFocus.bind(this)),
      (this.didBlur = this.didBlur.bind(this)),
      (this.didClickAttachment = this.didClickAttachment.bind(this)),
      (this.element = e),
      (this.composition = n),
      (this.documentView = new Ri(this.composition.document, {
        element: this.element,
      })),
      m(`focus`, { onElement: this.element, withCallback: this.didFocus }),
      m(`blur`, { onElement: this.element, withCallback: this.didBlur }),
      m(`click`, {
        onElement: this.element,
        matchingSelector: `a[contenteditable=false]`,
        preventDefault: !0,
      }),
      m(`mousedown`, {
        onElement: this.element,
        matchingSelector: t,
        withCallback: this.didClickAttachment,
      }),
      m(`click`, {
        onElement: this.element,
        matchingSelector: `a${t}`,
        preventDefault: !0,
      });
  }
  didFocus(e) {
    var t;
    let n = () => {
      var e, t;
      if (!this.focused)
        return (
          (this.focused = !0),
          (e = this.delegate) == null ||
          (t = e.compositionControllerDidFocus) == null
            ? void 0
            : t.call(e)
        );
    };
    return (t = this.blurPromise)?.then(n) || n();
  }
  didBlur(e) {
    this.blurPromise = new Promise((e) =>
      qe(() => {
        var t, n;
        return (
          le(this.element) ||
            ((this.focused = null),
            (t = this.delegate) == null ||
              (n = t.compositionControllerDidBlur) == null ||
              n.call(t)),
          (this.blurPromise = null),
          e()
        );
      }),
    );
  }
  didClickAttachment(e, t) {
    var n, r;
    let i = this.findAttachmentForElement(t),
      a = !!g(e.target, { matchingSelector: `figcaption` });
    return (n = this.delegate) == null ||
      (r = n.compositionControllerDidSelectAttachment) == null
      ? void 0
      : r.call(n, i, { editCaption: a });
  }
  getSerializableElement() {
    return this.isEditingAttachment()
      ? this.documentView.shadowElement
      : this.element;
  }
  render() {
    var e, t, n, r, i, a;
    return (
      (this.revision !== this.composition.revision &&
        (this.documentView.setDocument(this.composition.document),
        this.documentView.render(),
        (this.revision = this.composition.revision)),
      this.canSyncDocumentView() && !this.documentView.isSynced()) &&
        ((n = this.delegate) == null ||
          (r = n.compositionControllerWillSyncDocumentView) == null ||
          r.call(n),
        this.documentView.sync(),
        (i = this.delegate) == null ||
          (a = i.compositionControllerDidSyncDocumentView) == null ||
          a.call(i)),
      (e = this.delegate) == null ||
      (t = e.compositionControllerDidRender) == null
        ? void 0
        : t.call(e)
    );
  }
  rerenderViewForObject(e) {
    return this.invalidateViewForObject(e), this.render();
  }
  invalidateViewForObject(e) {
    return this.documentView.invalidateViewForObject(e);
  }
  isViewCachingEnabled() {
    return this.documentView.isViewCachingEnabled();
  }
  enableViewCaching() {
    return this.documentView.enableViewCaching();
  }
  disableViewCaching() {
    return this.documentView.disableViewCaching();
  }
  refreshViewCache() {
    return this.documentView.garbageCollectCachedViews();
  }
  isEditingAttachment() {
    return !!this.attachmentEditor;
  }
  installAttachmentEditorForAttachment(e, t) {
    var n;
    if ((n = this.attachmentEditor)?.attachment === e) return;
    let r = this.documentView.findElementForObject(e);
    r &&
      (this.uninstallAttachmentEditor(),
      (this.attachmentEditor = new Xn(
        this.composition.document.getAttachmentPieceForAttachment(e),
        r,
        this.element,
        t,
      )),
      (this.attachmentEditor.delegate = this));
  }
  uninstallAttachmentEditor() {
    var e;
    return (e = this.attachmentEditor)?.uninstall();
  }
  didUninstallAttachmentEditor() {
    return (this.attachmentEditor = null), this.render();
  }
  attachmentEditorDidRequestUpdatingAttributesForAttachment(e, t) {
    var n, r;
    return (
      (n = this.delegate) == null ||
        (r = n.compositionControllerWillUpdateAttachment) == null ||
        r.call(n, t),
      this.composition.updateAttributesForAttachment(e, t)
    );
  }
  attachmentEditorDidRequestRemovingAttributeForAttachment(e, t) {
    var n, r;
    return (
      (n = this.delegate) == null ||
        (r = n.compositionControllerWillUpdateAttachment) == null ||
        r.call(n, t),
      this.composition.removeAttributeForAttachment(e, t)
    );
  }
  attachmentEditorDidRequestRemovalOfAttachment(e) {
    var t, n;
    return (t = this.delegate) == null ||
      (n = t.compositionControllerDidRequestRemovalOfAttachment) == null
      ? void 0
      : n.call(t, e);
  }
  attachmentEditorDidRequestDeselectingAttachment(e) {
    var t, n;
    return (t = this.delegate) == null ||
      (n = t.compositionControllerDidRequestDeselectingAttachment) == null
      ? void 0
      : n.call(t, e);
  }
  canSyncDocumentView() {
    return !this.isEditingAttachment();
  }
  findAttachmentForElement(e) {
    return this.composition.document.getAttachmentById(
      parseInt(e.dataset.trixId, 10),
    );
  }
}
class Zn extends H {}
const Xr = `data-trix-mutable`,
  Zr = `[${Xr}]`,
  $r = {
    attributes: !0,
    childList: !0,
    characterData: !0,
    characterDataOldValue: !0,
    subtree: !0,
  };
class ir extends H {
  constructor(e) {
    super(e),
      (this.didMutate = this.didMutate.bind(this)),
      (this.element = e),
      (this.observer = new window.MutationObserver(this.didMutate)),
      this.start();
  }
  start() {
    return this.reset(), this.observer.observe(this.element, $r);
  }
  stop() {
    return this.observer.disconnect();
  }
  didMutate(e) {
    var t, n;
    if (
      (this.mutations.push(
        ...Array.from(this.findSignificantMutations(e) || []),
      ),
      this.mutations.length)
    )
      return (
        (t = this.delegate) == null ||
          (n = t.elementDidMutate) == null ||
          n.call(t, this.getMutationSummary()),
        this.reset()
      );
  }
  reset() {
    this.mutations = [];
  }
  findSignificantMutations(e) {
    return e.filter((e) => this.mutationIsSignificant(e));
  }
  mutationIsSignificant(e) {
    if (this.nodeIsMutable(e.target)) return !1;
    for (let t of Array.from(this.nodesModifiedByMutation(e)))
      if (this.nodeIsSignificant(t)) return !0;
    return !1;
  }
  nodeIsSignificant(e) {
    return e !== this.element && !this.nodeIsMutable(e) && !be(e);
  }
  nodeIsMutable(e) {
    return g(e, { matchingSelector: Zr });
  }
  nodesModifiedByMutation(e) {
    let t = [];
    switch (e.type) {
      case `attributes`:
        e.attributeName !== Xr && t.push(e.target);
        break;
      case `characterData`:
        t.push(e.target.parentNode), t.push(e.target);
        break;
      case `childList`:
        t.push(...Array.from(e.addedNodes || [])),
          t.push(...Array.from(e.removedNodes || []));
    }
    return t;
  }
  getMutationSummary() {
    return this.getTextMutationSummary();
  }
  getTextMutationSummary() {
    let { additions: e, deletions: t } = this.getTextChangesFromCharacterData(),
      n = this.getTextChangesFromChildList();
    Array.from(n.additions).forEach((t) => {
      Array.from(e).includes(t) || e.push(t);
    }),
      t.push(...Array.from(n.deletions || []));
    let r = {},
      i = e.join(``);
    i && (r.textAdded = i);
    let a = t.join(``);
    return a && (r.textDeleted = a), r;
  }
  getMutationsByType(e) {
    return Array.from(this.mutations).filter((t) => t.type === e);
  }
  getTextChangesFromChildList() {
    let e,
      t,
      n = [],
      r = [];
    return (
      Array.from(this.getMutationsByType(`childList`)).forEach((e) => {
        n.push(...Array.from(e.addedNodes || [])),
          r.push(...Array.from(e.removedNodes || []));
      }),
      n.length === 0 && r.length === 1 && ge(r[0])
        ? ((e = []),
          (t = [
            `
`,
          ]))
        : ((e = ei(n)), (t = ei(r))),
      {
        additions: e.filter((e, n) => e !== t[n]).map(z),
        deletions: t.filter((t, n) => t !== e[n]).map(z),
      }
    );
  }
  getTextChangesFromCharacterData() {
    let e,
      t,
      n = this.getMutationsByType(`characterData`);
    if (n.length) {
      let r = n[0],
        i = n[n.length - 1],
        a = (function (e, t) {
          let n, r;
          return (
            (e = Z.box(e)),
            (t = Z.box(t)).length < e.length
              ? ([r, n] = rt(e, t))
              : ([n, r] = rt(t, e)),
            { added: n, removed: r }
          );
        })(z(r.oldValue), z(i.target.data));
      (e = a.added), (t = a.removed);
    }
    return { additions: e ? [e] : [], deletions: t ? [t] : [] };
  }
}
const ei = function () {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [],
    t = [];
  for (let n of Array.from(e))
    switch (n.nodeType) {
      case Node.TEXT_NODE:
        t.push(n.data);
        break;
      case Node.ELEMENT_NODE:
        y(n) === `br`
          ? t.push(`
`)
          : t.push(...Array.from(ei(n.childNodes) || []));
    }
  return t;
};
class rr extends ie {
  constructor(e) {
    super(...arguments), (this.file = e);
  }
  perform(e) {
    let t = new FileReader();
    return (
      (t.onerror = () => e(!1)),
      (t.onload = () => {
        t.onerror = null;
        try {
          t.abort();
        } catch {}
        return e(!0, this.file);
      }),
      t.readAsArrayBuffer(this.file)
    );
  }
}
class or {
  constructor(e) {
    this.element = e;
  }
  shouldIgnore(e) {
    return (
      !!s.samsungAndroid &&
      ((this.previousEvent = this.event),
      (this.event = e),
      this.checkSamsungKeyboardBuggyModeStart(),
      this.checkSamsungKeyboardBuggyModeEnd(),
      this.buggyMode)
    );
  }
  checkSamsungKeyboardBuggyModeStart() {
    this.insertingLongTextAfterUnidentifiedChar() &&
      ti(this.element.innerText, this.event.data) &&
      ((this.buggyMode = !0), this.event.preventDefault());
  }
  checkSamsungKeyboardBuggyModeEnd() {
    this.buggyMode &&
      this.event.inputType !== `insertText` &&
      (this.buggyMode = !1);
  }
  insertingLongTextAfterUnidentifiedChar() {
    var e;
    return (
      this.isBeforeInputInsertText() &&
      this.previousEventWasUnidentifiedKeydown() &&
      (e = this.event.data)?.length > 50
    );
  }
  isBeforeInputInsertText() {
    return (
      this.event.type === `beforeinput` && this.event.inputType === `insertText`
    );
  }
  previousEventWasUnidentifiedKeydown() {
    var e, t;
    return (
      (e = this.previousEvent)?.type === `keydown` &&
      (t = this.previousEvent)?.key === `Unidentified`
    );
  }
}
const ti = (e, t) => ri(e) === ri(t),
  ni = RegExp(`(￼|﻿|\xA0|\\s)+`, `g`),
  ri = (e) => e.replace(ni, ` `).trim();
class cr extends H {
  constructor(e) {
    super(...arguments),
      (this.element = e),
      (this.mutationObserver = new ir(this.element)),
      (this.mutationObserver.delegate = this),
      (this.flakyKeyboardDetector = new or(this.element));
    for (let e in this.constructor.events)
      m(e, { onElement: this.element, withCallback: this.handlerFor(e) });
  }
  elementDidMutate(e) {}
  editorWillSyncDocumentView() {
    return this.mutationObserver.stop();
  }
  editorDidSyncDocumentView() {
    return this.mutationObserver.start();
  }
  requestRender() {
    var e, t;
    return (e = this.delegate) == null ||
      (t = e.inputControllerDidRequestRender) == null
      ? void 0
      : t.call(e);
  }
  requestReparse() {
    var e, t;
    return (
      (e = this.delegate) == null ||
        (t = e.inputControllerDidRequestReparse) == null ||
        t.call(e),
      this.requestRender()
    );
  }
  attachFiles(e) {
    let t = Array.from(e).map((e) => new rr(e));
    return Promise.all(t).then((e) => {
      this.handleInput(function () {
        var t, n;
        return (
          (t = this.delegate) == null || t.inputControllerWillAttachFiles(),
          (n = this.responder) == null || n.insertFiles(e),
          this.requestRender()
        );
      });
    });
  }
  handlerFor(e) {
    return (t) => {
      t.defaultPrevented ||
        this.handleInput(() => {
          if (!le(this.element)) {
            if (this.flakyKeyboardDetector.shouldIgnore(t)) return;
            (this.eventName = e), this.constructor.events[e].call(this, t);
          }
        });
    };
  }
  handleInput(e) {
    try {
      var t;
      (t = this.delegate) == null || t.inputControllerWillHandleInput(),
        e.call(this);
    } finally {
      var n;
      (n = this.delegate) == null || n.inputControllerDidHandleInput();
    }
  }
  createLinkHTML(e, t) {
    let n = document.createElement(`a`);
    return (n.href = e), (n.textContent = t || e), n.outerHTML;
  }
}
var ii;
Y(cr, `events`, {});
const { browser: ai, keyNames: oi } = E;
let si = 0;
class mr extends cr {
  constructor() {
    super(...arguments), this.resetInputSummary();
  }
  setInputSummary() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.inputSummary.eventName = this.eventName;
    for (let t in e) {
      let n = e[t];
      this.inputSummary[t] = n;
    }
    return this.inputSummary;
  }
  resetInputSummary() {
    this.inputSummary = {};
  }
  reset() {
    return this.resetInputSummary(), I.reset();
  }
  elementDidMutate(e) {
    var t, n;
    return this.isComposing()
      ? (t = this.delegate) == null ||
        (n = t.inputControllerDidAllowUnhandledInput) == null
        ? void 0
        : n.call(t)
      : this.handleInput(function () {
          return (
            this.mutationIsSignificant(e) &&
              (this.mutationIsExpected(e)
                ? this.requestRender()
                : this.requestReparse()),
            this.reset()
          );
        });
  }
  mutationIsExpected(e) {
    let { textAdded: t, textDeleted: n } = e;
    if (this.inputSummary.preferDocument) return !0;
    let r =
        t == null
          ? !this.inputSummary.textAdded
          : t === this.inputSummary.textAdded,
      i =
        n == null ? !this.inputSummary.didDelete : this.inputSummary.didDelete,
      a =
        [
          `
`,
          ` 
`,
        ].includes(t) && !r,
      o =
        n ===
          `
` && !i;
    if ((a && !o) || (o && !a)) {
      let e = this.getSelectedRange();
      if (e) {
        var s;
        let n = a ? t.replace(/\n$/, ``).length || -1 : t?.length || 1;
        if ((s = this.responder) != null && s.positionIsBlockBreak(e[1] + n))
          return !0;
      }
    }
    return r && i;
  }
  mutationIsSignificant(e) {
    var t;
    let n = Object.keys(e).length > 0,
      r = (t = this.compositionInput)?.getEndData() === ``;
    return n || !r;
  }
  getCompositionInput() {
    if (this.isComposing()) return this.compositionInput;
    this.compositionInput = new Ar(this);
  }
  isComposing() {
    return this.compositionInput && !this.compositionInput.isEnded();
  }
  deleteInDirection(e, t) {
    var n;
    return !1 === (n = this.responder)?.deleteInDirection(e)
      ? t
        ? (t.preventDefault(), this.requestRender())
        : void 0
      : this.setInputSummary({ didDelete: !0 });
  }
  serializeSelectionToDataTransfer(e) {
    var t;
    if (
      !(function (e) {
        if (e == null || !e.setData) return !1;
        for (let t in We) {
          let n = We[t];
          try {
            if ((e.setData(t, n), !e.getData(t) === n)) return !1;
          } catch {
            return !1;
          }
        }
        return !0;
      })(e)
    )
      return;
    let n = (t = this.responder)
      ?.getSelectedDocument()
      .toSerializableDocument();
    return (
      e.setData(`application/x-trix-document`, JSON.stringify(n)),
      e.setData(`text/html`, Ri.render(n).innerHTML),
      e.setData(`text/plain`, n.toString().replace(/\n$/, ``)),
      !0
    );
  }
  canAcceptDataTransfer(e) {
    let t = {};
    return (
      Array.from(e?.types || []).forEach((e) => {
        t[e] = !0;
      }),
      t.Files ||
        t[`application/x-trix-document`] ||
        t[`text/html`] ||
        t[`text/plain`]
    );
  }
  getPastedHTMLUsingHiddenElement(e) {
    let t = this.getSelectedRange(),
      n = b({
        style: {
          position: `absolute`,
          left: `${window.pageXOffset}px`,
          top: `${window.pageYOffset}px`,
          opacity: 0,
        },
        tagName: `div`,
        editable: !0,
      });
    return (
      document.body.appendChild(n),
      n.focus(),
      requestAnimationFrame(() => {
        let r = n.innerHTML;
        return v(n), this.setSelectedRange(t), e(r);
      })
    );
  }
}
Y(mr, `events`, {
  keydown(e) {
    this.isComposing() || this.resetInputSummary(),
      (this.inputSummary.didInput = !0);
    let t = oi[e.keyCode];
    if (t) {
      var n;
      let r = this.keys;
      [`ctrl`, `alt`, `shift`, `meta`].forEach((t) => {
        var n;
        e[`${t}Key`] && (t === `ctrl` && (t = `control`), (r = (n = r)?.[t]));
      }),
        (n = r)?.[t] != null &&
          (this.setInputSummary({ keyName: t }), I.reset(), r[t].call(this, e));
    }
    if (Ke(e)) {
      let t = String.fromCharCode(e.keyCode).toLowerCase();
      if (t) {
        var r;
        let n = [`alt`, `shift`]
          .map((t) => {
            if (e[`${t}Key`]) return t;
          })
          .filter((e) => e);
        n.push(t),
          (r = this.delegate) != null &&
            r.inputControllerDidReceiveKeyboardCommand(n) &&
            e.preventDefault();
      }
    }
  },
  keypress(e) {
    if (
      this.inputSummary.eventName != null ||
      e.metaKey ||
      (e.ctrlKey && !e.altKey)
    )
      return;
    let t = ui(e);
    var n, r;
    return t
      ? ((n = this.delegate) == null || n.inputControllerWillPerformTyping(),
        (r = this.responder) == null || r.insertString(t),
        this.setInputSummary({
          textAdded: t,
          didDelete: this.selectionIsExpanded(),
        }))
      : void 0;
  },
  textInput(e) {
    let { data: t } = e,
      { textAdded: n } = this.inputSummary;
    if (n && n !== t && n.toUpperCase() === t) {
      var r;
      let e = this.getSelectedRange();
      return (
        this.setSelectedRange([e[0], e[1] + n.length]),
        (r = this.responder) == null || r.insertString(t),
        this.setInputSummary({ textAdded: t }),
        this.setSelectedRange(e)
      );
    }
  },
  dragenter(e) {
    e.preventDefault();
  },
  dragstart(e) {
    var t, n;
    return (
      this.serializeSelectionToDataTransfer(e.dataTransfer),
      (this.draggedRange = this.getSelectedRange()),
      (t = this.delegate) == null || (n = t.inputControllerDidStartDrag) == null
        ? void 0
        : n.call(t)
    );
  },
  dragover(e) {
    if (this.draggedRange || this.canAcceptDataTransfer(e.dataTransfer)) {
      e.preventDefault();
      let r = { x: e.clientX, y: e.clientY };
      var t, n;
      if (!Ye(r, this.draggingPoint))
        return (
          (this.draggingPoint = r),
          (t = this.delegate) == null ||
          (n = t.inputControllerDidReceiveDragOverPoint) == null
            ? void 0
            : n.call(t, this.draggingPoint)
        );
    }
  },
  dragend(e) {
    var t, n;
    (t = this.delegate) == null ||
      (n = t.inputControllerDidCancelDrag) == null ||
      n.call(t),
      (this.draggedRange = null),
      (this.draggingPoint = null);
  },
  drop(e) {
    var t, n;
    e.preventDefault();
    let r = (t = e.dataTransfer)?.files,
      i = e.dataTransfer.getData(`application/x-trix-document`),
      a = { x: e.clientX, y: e.clientY };
    if (
      ((n = this.responder) == null || n.setLocationRangeFromPointRange(a),
      r != null && r.length)
    )
      this.attachFiles(r);
    else if (this.draggedRange) {
      var o, s;
      (o = this.delegate) == null || o.inputControllerWillMoveText(),
        (s = this.responder) == null || s.moveTextFromRange(this.draggedRange),
        (this.draggedRange = null),
        this.requestRender();
    } else if (i) {
      var c;
      let e = ln.fromJSONString(i);
      (c = this.responder) == null || c.insertDocument(e), this.requestRender();
    }
    (this.draggedRange = null), (this.draggingPoint = null);
  },
  cut(e) {
    var t, n;
    if (
      (t = this.responder) != null &&
      t.selectionIsExpanded() &&
      (this.serializeSelectionToDataTransfer(e.clipboardData) &&
        e.preventDefault(),
      (n = this.delegate) == null || n.inputControllerWillCutText(),
      this.deleteInDirection(`backward`),
      e.defaultPrevented)
    )
      return this.requestRender();
  },
  copy(e) {
    var t;
    (t = this.responder) != null &&
      t.selectionIsExpanded() &&
      this.serializeSelectionToDataTransfer(e.clipboardData) &&
      e.preventDefault();
  },
  paste(e) {
    let t = e.clipboardData || e.testClipboardData,
      n = { clipboard: t };
    if (!t || di(e))
      return void this.getPastedHTMLUsingHiddenElement((e) => {
        var t, r, i;
        return (
          (n.type = `text/html`),
          (n.html = e),
          (t = this.delegate) == null || t.inputControllerWillPaste(n),
          (r = this.responder) == null || r.insertHTML(n.html),
          this.requestRender(),
          (i = this.delegate)?.inputControllerDidPaste(n)
        );
      });
    let r = t.getData(`URL`),
      i = t.getData(`text/html`),
      a = t.getData(`public.url-name`);
    if (r) {
      var o, s, c;
      let e;
      (n.type = `text/html`),
        (e = a ? B(a).trim() : r),
        (n.html = this.createLinkHTML(r, e)),
        (o = this.delegate) == null || o.inputControllerWillPaste(n),
        this.setInputSummary({
          textAdded: e,
          didDelete: this.selectionIsExpanded(),
        }),
        (s = this.responder) == null || s.insertHTML(n.html),
        this.requestRender(),
        (c = this.delegate) == null || c.inputControllerDidPaste(n);
    } else if (Ge(t)) {
      var l, u, d;
      (n.type = `text/plain`),
        (n.string = t.getData(`text/plain`)),
        (l = this.delegate) == null || l.inputControllerWillPaste(n),
        this.setInputSummary({
          textAdded: n.string,
          didDelete: this.selectionIsExpanded(),
        }),
        (u = this.responder) == null || u.insertString(n.string),
        this.requestRender(),
        (d = this.delegate) == null || d.inputControllerDidPaste(n);
    } else if (i) {
      var ee, ae, f;
      (n.type = `text/html`),
        (n.html = i),
        (ee = this.delegate) == null || ee.inputControllerWillPaste(n),
        (ae = this.responder) == null || ae.insertHTML(n.html),
        this.requestRender(),
        (f = this.delegate) == null || f.inputControllerDidPaste(n);
    } else if (Array.from(t.types).includes(`Files`)) {
      var p, oe;
      let e =
        (p = t.items) == null ||
        (p = p[0]) == null ||
        (oe = p.getAsFile) == null
          ? void 0
          : oe.call(p);
      if (e) {
        var m, se, h;
        let t = ci(e);
        !e.name && t && (e.name = `pasted-file-${++si}.${t}`),
          (n.type = `File`),
          (n.file = e),
          (m = this.delegate) == null || m.inputControllerWillAttachFiles(),
          (se = this.responder) == null || se.insertFile(n.file),
          this.requestRender(),
          (h = this.delegate) == null || h.inputControllerDidPaste(n);
      }
    }
    e.preventDefault();
  },
  compositionstart(e) {
    return this.getCompositionInput().start(e.data);
  },
  compositionupdate(e) {
    return this.getCompositionInput().update(e.data);
  },
  compositionend(e) {
    return this.getCompositionInput().end(e.data);
  },
  beforeinput(e) {
    this.inputSummary.didInput = !0;
  },
  input(e) {
    return (this.inputSummary.didInput = !0), e.stopPropagation();
  },
}),
  Y(mr, `keys`, {
    backspace(e) {
      var t;
      return (
        (t = this.delegate) == null || t.inputControllerWillPerformTyping(),
        this.deleteInDirection(`backward`, e)
      );
    },
    delete(e) {
      var t;
      return (
        (t = this.delegate) == null || t.inputControllerWillPerformTyping(),
        this.deleteInDirection(`forward`, e)
      );
    },
    return(e) {
      var t, n;
      return (
        this.setInputSummary({ preferDocument: !0 }),
        (t = this.delegate) == null || t.inputControllerWillPerformTyping(),
        (n = this.responder)?.insertLineBreak()
      );
    },
    tab(e) {
      var t, n;
      (t = this.responder) != null &&
        t.canIncreaseNestingLevel() &&
        ((n = this.responder) == null || n.increaseNestingLevel(),
        this.requestRender(),
        e.preventDefault());
    },
    left(e) {
      var t;
      if (this.selectionIsInCursorTarget())
        return (
          e.preventDefault(),
          (t = this.responder)?.moveCursorInDirection(`backward`)
        );
    },
    right(e) {
      var t;
      if (this.selectionIsInCursorTarget())
        return (
          e.preventDefault(),
          (t = this.responder)?.moveCursorInDirection(`forward`)
        );
    },
    control: {
      d(e) {
        var t;
        return (
          (t = this.delegate) == null || t.inputControllerWillPerformTyping(),
          this.deleteInDirection(`forward`, e)
        );
      },
      h(e) {
        var t;
        return (
          (t = this.delegate) == null || t.inputControllerWillPerformTyping(),
          this.deleteInDirection(`backward`, e)
        );
      },
      o(e) {
        var t, n;
        return (
          e.preventDefault(),
          (t = this.delegate) == null || t.inputControllerWillPerformTyping(),
          (n = this.responder) == null ||
            n.insertString(
              `
`,
              { updatePosition: !1 },
            ),
          this.requestRender()
        );
      },
    },
    shift: {
      return(e) {
        var t, n;
        (t = this.delegate) == null || t.inputControllerWillPerformTyping(),
          (n = this.responder) == null ||
            n.insertString(`
`),
          this.requestRender(),
          e.preventDefault();
      },
      tab(e) {
        var t, n;
        (t = this.responder) != null &&
          t.canDecreaseNestingLevel() &&
          ((n = this.responder) == null || n.decreaseNestingLevel(),
          this.requestRender(),
          e.preventDefault());
      },
      left(e) {
        if (this.selectionIsInCursorTarget())
          return (
            e.preventDefault(), this.expandSelectionInDirection(`backward`)
          );
      },
      right(e) {
        if (this.selectionIsInCursorTarget())
          return e.preventDefault(), this.expandSelectionInDirection(`forward`);
      },
    },
    alt: {
      backspace(e) {
        var t;
        return (
          this.setInputSummary({ preferDocument: !1 }),
          (t = this.delegate)?.inputControllerWillPerformTyping()
        );
      },
    },
    meta: {
      backspace(e) {
        var t;
        return (
          this.setInputSummary({ preferDocument: !1 }),
          (t = this.delegate)?.inputControllerWillPerformTyping()
        );
      },
    },
  }),
  mr.proxyMethod(`responder?.getSelectedRange`),
  mr.proxyMethod(`responder?.setSelectedRange`),
  mr.proxyMethod(`responder?.expandSelectionInDirection`),
  mr.proxyMethod(`responder?.selectionIsInCursorTarget`),
  mr.proxyMethod(`responder?.selectionIsExpanded`);
const ci = (e) => {
    var t;
    return (t = e.type) == null || (t = t.match(/\/(\w+)$/)) == null
      ? void 0
      : t[1];
  },
  li = !((ii = ` `.codePointAt) == null || !ii.call(` `, 0)),
  ui = function (e) {
    if (e.key && li && e.key.codePointAt(0) === e.keyCode) return e.key;
    {
      let t;
      if (
        (e.which === null
          ? (t = e.keyCode)
          : e.which !== 0 && e.charCode !== 0 && (t = e.charCode),
        t != null && oi[t] !== `escape`)
      )
        return Z.fromCodepoints([t]).toString();
    }
  },
  di = function (e) {
    let t = e.clipboardData;
    if (t) {
      if (t.types.includes(`text/html`)) {
        for (let e of t.types) {
          let n = /^CorePasteboardFlavorType/.test(e),
            r = /^dyn\./.test(e) && t.getData(e);
          if (n || r) return !0;
        }
        return !1;
      }
      {
        let e = t.types.includes(`com.apple.webarchive`),
          n = t.types.includes(`com.apple.flat-rtfd`);
        return e || n;
      }
    }
  };
class Ar extends H {
  constructor(e) {
    super(...arguments),
      (this.inputController = e),
      (this.responder = this.inputController.responder),
      (this.delegate = this.inputController.delegate),
      (this.inputSummary = this.inputController.inputSummary),
      (this.data = {});
  }
  start(e) {
    if (((this.data.start = e), this.isSignificant())) {
      var t, n;
      this.inputSummary.eventName === `keypress` &&
        this.inputSummary.textAdded &&
        ((n = this.responder) == null || n.deleteInDirection(`left`)),
        this.selectionIsExpanded() ||
          (this.insertPlaceholder(), this.requestRender()),
        (this.range = (t = this.responder)?.getSelectedRange());
    }
  }
  update(e) {
    if (((this.data.update = e), this.isSignificant())) {
      let e = this.selectPlaceholder();
      e && (this.forgetPlaceholder(), (this.range = e));
    }
  }
  end(e) {
    return (
      (this.data.end = e),
      this.isSignificant()
        ? (this.forgetPlaceholder(),
          this.canApplyToDocument()
            ? (this.setInputSummary({ preferDocument: !0, didInput: !1 }),
              (t = this.delegate) == null ||
                t.inputControllerWillPerformTyping(),
              (n = this.responder) == null || n.setSelectedRange(this.range),
              (r = this.responder) == null || r.insertString(this.data.end),
              (i = this.responder)?.setSelectedRange(
                this.range[0] + this.data.end.length,
              ))
            : this.data.start != null || this.data.update != null
              ? (this.requestReparse(), this.inputController.reset())
              : void 0)
        : this.inputController.reset()
    );
    var t, n, r, i;
  }
  getEndData() {
    return this.data.end;
  }
  isEnded() {
    return this.getEndData() != null;
  }
  isSignificant() {
    return !ai.composesExistingText || this.inputSummary.didInput;
  }
  canApplyToDocument() {
    var e, t;
    return (
      (e = this.data.start)?.length === 0 &&
      (t = this.data.end)?.length > 0 &&
      this.range
    );
  }
}
Ar.proxyMethod(`inputController.setInputSummary`),
  Ar.proxyMethod(`inputController.requestRender`),
  Ar.proxyMethod(`inputController.requestReparse`),
  Ar.proxyMethod(`responder?.selectionIsExpanded`),
  Ar.proxyMethod(`responder?.insertPlaceholder`),
  Ar.proxyMethod(`responder?.selectPlaceholder`),
  Ar.proxyMethod(`responder?.forgetPlaceholder`);
class yr extends cr {
  constructor() {
    super(...arguments), (this.render = this.render.bind(this));
  }
  elementDidMutate() {
    return this.scheduledRender
      ? this.composing
        ? (e = this.delegate) == null ||
          (t = e.inputControllerDidAllowUnhandledInput) == null
          ? void 0
          : t.call(e)
        : void 0
      : this.reparse();
    var e, t;
  }
  scheduleRender() {
    return this.scheduledRender
      ? this.scheduledRender
      : (this.scheduledRender = requestAnimationFrame(this.render));
  }
  render() {
    var e, t;
    (cancelAnimationFrame(this.scheduledRender),
    (this.scheduledRender = null),
    this.composing) ||
      (t = this.delegate) == null ||
      t.render(),
      (e = this.afterRender) == null || e.call(this),
      (this.afterRender = null);
  }
  reparse() {
    var e;
    return (e = this.delegate)?.reparse();
  }
  insertString() {
    var e;
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ``,
      n = arguments.length > 1 ? arguments[1] : void 0;
    return (
      (e = this.delegate) == null || e.inputControllerWillPerformTyping(),
      this.withTargetDOMRange(function () {
        var e;
        return (e = this.responder)?.insertString(t, n);
      })
    );
  }
  toggleAttributeIfSupported(e) {
    var t;
    if (Le().includes(e))
      return (
        (t = this.delegate) == null ||
          t.inputControllerWillPerformFormatting(e),
        this.withTargetDOMRange(function () {
          var t;
          return (t = this.responder)?.toggleCurrentAttribute(e);
        })
      );
  }
  activateAttributeIfSupported(e, t) {
    var n;
    if (Le().includes(e))
      return (
        (n = this.delegate) == null ||
          n.inputControllerWillPerformFormatting(e),
        this.withTargetDOMRange(function () {
          var n;
          return (n = this.responder)?.setCurrentAttribute(e, t);
        })
      );
  }
  deleteInDirection(e) {
    let { recordUndoEntry: t } =
      arguments.length > 1 && arguments[1] !== void 0
        ? arguments[1]
        : { recordUndoEntry: !0 };
    var n;
    t && ((n = this.delegate) == null || n.inputControllerWillPerformTyping());
    let r = () => {
        var t;
        return (t = this.responder)?.deleteInDirection(e);
      },
      i = this.getTargetDOMRange({ minLength: this.composing ? 1 : 2 });
    return i ? this.withTargetDOMRange(i, r) : r();
  }
  withTargetDOMRange(e, t) {
    var n;
    return (
      typeof e == `function` && ((t = e), (e = this.getTargetDOMRange())),
      e
        ? (n = this.responder)?.withTargetDOMRange(e, t.bind(this))
        : (I.reset(), t.call(this))
    );
  }
  getTargetDOMRange() {
    var e, t;
    let { minLength: n } =
        arguments.length > 0 && arguments[0] !== void 0
          ? arguments[0]
          : { minLength: 0 },
      r = (e = (t = this.event).getTargetRanges)?.call(t);
    if (r && r.length) {
      let e = pi(r[0]);
      if (n === 0 || e.toString().length >= n) return e;
    }
  }
  withEvent(e, t) {
    let n;
    this.event = e;
    try {
      n = t.call(this);
    } finally {
      this.event = null;
    }
    return n;
  }
}
Y(yr, `events`, {
  keydown(e) {
    if (Ke(e)) {
      var t;
      let n = bi(e);
      (t = this.delegate) != null &&
        t.inputControllerDidReceiveKeyboardCommand(n) &&
        e.preventDefault();
    } else {
      let t = e.key;
      e.altKey && (t += `+Alt`), e.shiftKey && (t += `+Shift`);
      let n = this.constructor.keys[t];
      if (n) return this.withEvent(e, n);
    }
  },
  paste(e) {
    var t;
    let n,
      r = (t = e.clipboardData)?.getData(`URL`);
    return _i(e)
      ? (e.preventDefault(), this.attachFiles(e.clipboardData.files))
      : vi(e)
        ? (e.preventDefault(),
          (n = {
            type: `text/plain`,
            string: e.clipboardData.getData(`text/plain`),
          }),
          (i = this.delegate) == null || i.inputControllerWillPaste(n),
          (a = this.responder) == null || a.insertString(n.string),
          this.render(),
          (o = this.delegate)?.inputControllerDidPaste(n))
        : r
          ? (e.preventDefault(),
            (n = { type: `text/html`, html: this.createLinkHTML(r) }),
            (s = this.delegate) == null || s.inputControllerWillPaste(n),
            (c = this.responder) == null || c.insertHTML(n.html),
            this.render(),
            (l = this.delegate)?.inputControllerDidPaste(n))
          : void 0;
    var i, a, o, s, c, l;
  },
  beforeinput(e) {
    let t = this.constructor.inputTypes[e.inputType],
      n =
        ((r = e),
        !(
          !/iPhone|iPad/.test(navigator.userAgent) ||
          (r.inputType && r.inputType !== `insertParagraph`)
        ));
    var r;
    t && (this.withEvent(e, t), n || this.scheduleRender()), n && this.render();
  },
  input(e) {
    I.reset();
  },
  dragstart(e) {
    var t, n;
    (t = this.responder) != null &&
      t.selectionContainsAttachments() &&
      (e.dataTransfer.setData(`application/x-trix-dragging`, !0),
      (this.dragging = {
        range: (n = this.responder)?.getSelectedRange(),
        point: Ci(e),
      }));
  },
  dragenter(e) {
    mi(e) && e.preventDefault();
  },
  dragover(e) {
    if (this.dragging) {
      e.preventDefault();
      let n = Ci(e);
      var t;
      if (!Ye(n, this.dragging.point))
        return (
          (this.dragging.point = n),
          (t = this.responder)?.setLocationRangeFromPointRange(n)
        );
    } else mi(e) && e.preventDefault();
  },
  drop(e) {
    var t, n;
    if (this.dragging)
      return (
        e.preventDefault(),
        (t = this.delegate) == null || t.inputControllerWillMoveText(),
        (n = this.responder) == null ||
          n.moveTextFromRange(this.dragging.range),
        (this.dragging = null),
        this.scheduleRender()
      );
    if (mi(e)) {
      var r;
      e.preventDefault();
      let t = Ci(e);
      return (
        (r = this.responder) == null || r.setLocationRangeFromPointRange(t),
        this.attachFiles(e.dataTransfer.files)
      );
    }
  },
  dragend() {
    var e;
    this.dragging &&=
      ((e = this.responder) == null || e.setSelectedRange(this.dragging.range),
      null);
  },
  compositionend(e) {
    this.composing &&
      ((this.composing = !1), s.recentAndroid || this.scheduleRender());
  },
}),
  Y(yr, `keys`, {
    ArrowLeft() {
      var e, t;
      if (
        (e = this.responder) != null &&
        e.shouldManageMovingCursorInDirection(`backward`)
      )
        return (
          this.event.preventDefault(),
          (t = this.responder)?.moveCursorInDirection(`backward`)
        );
    },
    ArrowRight() {
      var e, t;
      if (
        (e = this.responder) != null &&
        e.shouldManageMovingCursorInDirection(`forward`)
      )
        return (
          this.event.preventDefault(),
          (t = this.responder)?.moveCursorInDirection(`forward`)
        );
    },
    Backspace() {
      var e, t, n;
      if (
        (e = this.responder) != null &&
        e.shouldManageDeletingInDirection(`backward`)
      )
        return (
          this.event.preventDefault(),
          (t = this.delegate) == null || t.inputControllerWillPerformTyping(),
          (n = this.responder) == null || n.deleteInDirection(`backward`),
          this.render()
        );
    },
    Tab() {
      var e, t;
      if ((e = this.responder) != null && e.canIncreaseNestingLevel())
        return (
          this.event.preventDefault(),
          (t = this.responder) == null || t.increaseNestingLevel(),
          this.render()
        );
    },
    "Tab+Shift"() {
      var e, t;
      if ((e = this.responder) != null && e.canDecreaseNestingLevel())
        return (
          this.event.preventDefault(),
          (t = this.responder) == null || t.decreaseNestingLevel(),
          this.render()
        );
    },
  }),
  Y(yr, `inputTypes`, {
    deleteByComposition() {
      return this.deleteInDirection(`backward`, { recordUndoEntry: !1 });
    },
    deleteByCut() {
      return this.deleteInDirection(`backward`);
    },
    deleteByDrag() {
      return (
        this.event.preventDefault(),
        this.withTargetDOMRange(function () {
          var e;
          this.deleteByDragRange = (e = this.responder)?.getSelectedRange();
        })
      );
    },
    deleteCompositionText() {
      return this.deleteInDirection(`backward`, { recordUndoEntry: !1 });
    },
    deleteContent() {
      return this.deleteInDirection(`backward`);
    },
    deleteContentBackward() {
      return this.deleteInDirection(`backward`);
    },
    deleteContentForward() {
      return this.deleteInDirection(`forward`);
    },
    deleteEntireSoftLine() {
      return this.deleteInDirection(`forward`);
    },
    deleteHardLineBackward() {
      return this.deleteInDirection(`backward`);
    },
    deleteHardLineForward() {
      return this.deleteInDirection(`forward`);
    },
    deleteSoftLineBackward() {
      return this.deleteInDirection(`backward`);
    },
    deleteSoftLineForward() {
      return this.deleteInDirection(`forward`);
    },
    deleteWordBackward() {
      return this.deleteInDirection(`backward`);
    },
    deleteWordForward() {
      return this.deleteInDirection(`forward`);
    },
    formatBackColor() {
      return this.activateAttributeIfSupported(
        `backgroundColor`,
        this.event.data,
      );
    },
    formatBold() {
      return this.toggleAttributeIfSupported(`bold`);
    },
    formatFontColor() {
      return this.activateAttributeIfSupported(`color`, this.event.data);
    },
    formatFontName() {
      return this.activateAttributeIfSupported(`font`, this.event.data);
    },
    formatIndent() {
      var e;
      if ((e = this.responder) != null && e.canIncreaseNestingLevel())
        return this.withTargetDOMRange(function () {
          var e;
          return (e = this.responder)?.increaseNestingLevel();
        });
    },
    formatItalic() {
      return this.toggleAttributeIfSupported(`italic`);
    },
    formatJustifyCenter() {
      return this.toggleAttributeIfSupported(`justifyCenter`);
    },
    formatJustifyFull() {
      return this.toggleAttributeIfSupported(`justifyFull`);
    },
    formatJustifyLeft() {
      return this.toggleAttributeIfSupported(`justifyLeft`);
    },
    formatJustifyRight() {
      return this.toggleAttributeIfSupported(`justifyRight`);
    },
    formatOutdent() {
      var e;
      if ((e = this.responder) != null && e.canDecreaseNestingLevel())
        return this.withTargetDOMRange(function () {
          var e;
          return (e = this.responder)?.decreaseNestingLevel();
        });
    },
    formatRemove() {
      this.withTargetDOMRange(function () {
        for (let n in (e = this.responder)?.getCurrentAttributes()) {
          var e, t;
          (t = this.responder) == null || t.removeCurrentAttribute(n);
        }
      });
    },
    formatSetBlockTextDirection() {
      return this.activateAttributeIfSupported(`blockDir`, this.event.data);
    },
    formatSetInlineTextDirection() {
      return this.activateAttributeIfSupported(`textDir`, this.event.data);
    },
    formatStrikeThrough() {
      return this.toggleAttributeIfSupported(`strike`);
    },
    formatSubscript() {
      return this.toggleAttributeIfSupported(`sub`);
    },
    formatSuperscript() {
      return this.toggleAttributeIfSupported(`sup`);
    },
    formatUnderline() {
      return this.toggleAttributeIfSupported(`underline`);
    },
    historyRedo() {
      var e;
      return (e = this.delegate)?.inputControllerWillPerformRedo();
    },
    historyUndo() {
      var e;
      return (e = this.delegate)?.inputControllerWillPerformUndo();
    },
    insertCompositionText() {
      return (this.composing = !0), this.insertString(this.event.data);
    },
    insertFromComposition() {
      return (this.composing = !1), this.insertString(this.event.data);
    },
    insertFromDrop() {
      let e = this.deleteByDragRange;
      var t;
      if (e)
        return (
          (this.deleteByDragRange = null),
          (t = this.delegate) == null || t.inputControllerWillMoveText(),
          this.withTargetDOMRange(function () {
            var t;
            return (t = this.responder)?.moveTextFromRange(e);
          })
        );
    },
    insertFromPaste() {
      let { dataTransfer: e } = this.event,
        t = { dataTransfer: e },
        n = e.getData(`URL`),
        r = e.getData(`text/html`);
      if (n) {
        var i;
        let r;
        this.event.preventDefault(), (t.type = `text/html`);
        let a = e.getData(`public.url-name`);
        (r = a ? B(a).trim() : n),
          (t.html = this.createLinkHTML(n, r)),
          (i = this.delegate) == null || i.inputControllerWillPaste(t),
          this.withTargetDOMRange(function () {
            var e;
            return (e = this.responder)?.insertHTML(t.html);
          }),
          (this.afterRender = () => {
            var e;
            return (e = this.delegate)?.inputControllerDidPaste(t);
          });
      } else if (Ge(e)) {
        var a;
        (t.type = `text/plain`),
          (t.string = e.getData(`text/plain`)),
          (a = this.delegate) == null || a.inputControllerWillPaste(t),
          this.withTargetDOMRange(function () {
            var e;
            return (e = this.responder)?.insertString(t.string);
          }),
          (this.afterRender = () => {
            var e;
            return (e = this.delegate)?.inputControllerDidPaste(t);
          });
      } else if (hi(this.event)) {
        var o;
        (t.type = `File`),
          (t.file = e.files[0]),
          (o = this.delegate) == null || o.inputControllerWillPaste(t),
          this.withTargetDOMRange(function () {
            var e;
            return (e = this.responder)?.insertFile(t.file);
          }),
          (this.afterRender = () => {
            var e;
            return (e = this.delegate)?.inputControllerDidPaste(t);
          });
      } else if (r) {
        var s;
        this.event.preventDefault(),
          (t.type = `text/html`),
          (t.html = r),
          (s = this.delegate) == null || s.inputControllerWillPaste(t),
          this.withTargetDOMRange(function () {
            var e;
            return (e = this.responder)?.insertHTML(t.html);
          }),
          (this.afterRender = () => {
            var e;
            return (e = this.delegate)?.inputControllerDidPaste(t);
          });
      }
    },
    insertFromYank() {
      return this.insertString(this.event.data);
    },
    insertLineBreak() {
      return this.insertString(`
`);
    },
    insertLink() {
      return this.activateAttributeIfSupported(`href`, this.event.data);
    },
    insertOrderedList() {
      return this.toggleAttributeIfSupported(`number`);
    },
    insertParagraph() {
      var e;
      return (
        (e = this.delegate) == null || e.inputControllerWillPerformTyping(),
        this.withTargetDOMRange(function () {
          var e;
          return (e = this.responder)?.insertLineBreak();
        })
      );
    },
    insertReplacementText() {
      let e = this.event.dataTransfer.getData(`text/plain`),
        t = this.event.getTargetRanges()[0];
      this.withTargetDOMRange(t, () => {
        this.insertString(e, { updatePosition: !1 });
      });
    },
    insertText() {
      var e;
      return this.insertString(
        this.event.data || (e = this.event.dataTransfer)?.getData(`text/plain`),
      );
    },
    insertTranspose() {
      return this.insertString(this.event.data);
    },
    insertUnorderedList() {
      return this.toggleAttributeIfSupported(`bullet`);
    },
  });
const pi = function (e) {
    let t = document.createRange();
    return (
      t.setStart(e.startContainer, e.startOffset),
      t.setEnd(e.endContainer, e.endOffset),
      t
    );
  },
  mi = (e) => {
    var t;
    return Array.from((t = e.dataTransfer)?.types || []).includes(`Files`);
  },
  hi = (e) => {
    var t;
    return (
      (t = e.dataTransfer.files)?.[0] &&
      !_i(e) &&
      !((e) => {
        let { dataTransfer: t } = e;
        return (
          t.types.includes(`Files`) &&
          t.types.includes(`text/html`) &&
          t
            .getData(`text/html`)
            .includes(`urn:schemas-microsoft-com:office:office`)
        );
      })(e)
    );
  },
  _i = function (e) {
    let t = e.clipboardData;
    if (t)
      return (
        Array.from(t.types).filter((e) => e.match(/file/i)).length ===
          t.types.length && t.files.length >= 1
      );
  },
  vi = function (e) {
    let t = e.clipboardData;
    if (t) return t.types.includes(`text/plain`) && t.types.length === 1;
  },
  bi = function (e) {
    let t = [];
    return (
      e.altKey && t.push(`alt`), e.shiftKey && t.push(`shift`), t.push(e.key), t
    );
  },
  Ci = (e) => ({ x: e.clientX, y: e.clientY }),
  wi = `[data-trix-attribute]`,
  Ti = `[data-trix-action]`,
  Ei = `${wi}, ${Ti}`,
  Di = `[data-trix-dialog]`,
  Oi = `${Di}[data-trix-active]`,
  ki = `${Di} [data-trix-method]`,
  ji = `${Di} [data-trix-input]`,
  Mi = (e, t) => (
    (t ||= Pi(e)), e.querySelector(`[data-trix-input][name='${t}']`)
  ),
  Ni = (e) => e.getAttribute(`data-trix-action`),
  Pi = (e) =>
    e.getAttribute(`data-trix-attribute`) ||
    e.getAttribute(`data-trix-dialog-attribute`);
class _r extends H {
  constructor(e) {
    super(e),
      (this.didClickActionButton = this.didClickActionButton.bind(this)),
      (this.didClickAttributeButton = this.didClickAttributeButton.bind(this)),
      (this.didClickDialogButton = this.didClickDialogButton.bind(this)),
      (this.didKeyDownDialogInput = this.didKeyDownDialogInput.bind(this)),
      (this.element = e),
      (this.attributes = {}),
      (this.actions = {}),
      this.resetDialogInputs(),
      m(`mousedown`, {
        onElement: this.element,
        matchingSelector: Ti,
        withCallback: this.didClickActionButton,
      }),
      m(`mousedown`, {
        onElement: this.element,
        matchingSelector: wi,
        withCallback: this.didClickAttributeButton,
      }),
      m(`click`, {
        onElement: this.element,
        matchingSelector: Ei,
        preventDefault: !0,
      }),
      m(`click`, {
        onElement: this.element,
        matchingSelector: ki,
        withCallback: this.didClickDialogButton,
      }),
      m(`keydown`, {
        onElement: this.element,
        matchingSelector: ji,
        withCallback: this.didKeyDownDialogInput,
      });
  }
  didClickActionButton(e, t) {
    var n;
    (n = this.delegate) == null || n.toolbarDidClickButton(),
      e.preventDefault();
    let r = Ni(t);
    return this.getDialog(r)
      ? this.toggleDialog(r)
      : (i = this.delegate)?.toolbarDidInvokeAction(r, t);
    var i;
  }
  didClickAttributeButton(e, t) {
    var n;
    (n = this.delegate) == null || n.toolbarDidClickButton(),
      e.preventDefault();
    let r = Pi(t);
    var i;
    return (
      this.getDialog(r)
        ? this.toggleDialog(r)
        : (i = this.delegate) == null || i.toolbarDidToggleAttribute(r),
      this.refreshAttributeButtons()
    );
  }
  didClickDialogButton(e, t) {
    let n = g(t, { matchingSelector: Di });
    return this[t.getAttribute(`data-trix-method`)].call(this, n);
  }
  didKeyDownDialogInput(e, t) {
    if (e.keyCode === 13) {
      e.preventDefault();
      let n = t.getAttribute(`name`),
        r = this.getDialog(n);
      this.setAttribute(r);
    }
    if (e.keyCode === 27) return e.preventDefault(), this.hideDialog();
  }
  updateActions(e) {
    return (this.actions = e), this.refreshActionButtons();
  }
  refreshActionButtons() {
    return this.eachActionButton((e, t) => {
      e.disabled = !1 === this.actions[t];
    });
  }
  eachActionButton(e) {
    return Array.from(this.element.querySelectorAll(Ti)).map((t) =>
      e(t, Ni(t)),
    );
  }
  updateAttributes(e) {
    return (this.attributes = e), this.refreshAttributeButtons();
  }
  refreshAttributeButtons() {
    return this.eachAttributeButton(
      (e, t) => (
        (e.disabled = !1 === this.attributes[t]),
        this.attributes[t] || this.dialogIsVisible(t)
          ? (e.setAttribute(`data-trix-active`, ``),
            e.classList.add(`trix-active`))
          : (e.removeAttribute(`data-trix-active`),
            e.classList.remove(`trix-active`))
      ),
    );
  }
  eachAttributeButton(e) {
    return Array.from(this.element.querySelectorAll(wi)).map((t) =>
      e(t, Pi(t)),
    );
  }
  applyKeyboardCommand(e) {
    let t = JSON.stringify(e.sort());
    for (let e of Array.from(
      this.element.querySelectorAll(`[data-trix-key]`),
    )) {
      let n = e.getAttribute(`data-trix-key`).split(`+`);
      if (JSON.stringify(n.sort()) === t)
        return h(`mousedown`, { onElement: e }), !0;
    }
    return !1;
  }
  dialogIsVisible(e) {
    let t = this.getDialog(e);
    if (t) return t.hasAttribute(`data-trix-active`);
  }
  toggleDialog(e) {
    return this.dialogIsVisible(e) ? this.hideDialog() : this.showDialog(e);
  }
  showDialog(e) {
    var t, n;
    this.hideDialog(), (t = this.delegate) == null || t.toolbarWillShowDialog();
    let r = this.getDialog(e);
    r.setAttribute(`data-trix-active`, ``),
      r.classList.add(`trix-active`),
      Array.from(r.querySelectorAll(`input[disabled]`)).forEach((e) => {
        e.removeAttribute(`disabled`);
      });
    let i = Pi(r);
    if (i) {
      let t = Mi(r, e);
      t && ((t.value = this.attributes[i] || ``), t.select());
    }
    return (n = this.delegate)?.toolbarDidShowDialog(e);
  }
  setAttribute(e) {
    var t;
    let n = Pi(e),
      r = Mi(e, n);
    return !r.willValidate ||
      (r.setCustomValidity(``), r.checkValidity() && this.isSafeAttribute(r))
      ? ((t = this.delegate) == null || t.toolbarDidUpdateAttribute(n, r.value),
        this.hideDialog())
      : (r.setCustomValidity(`Invalid value`),
        r.setAttribute(`data-trix-validate`, ``),
        r.classList.add(`trix-validate`),
        r.focus());
  }
  isSafeAttribute(e) {
    return (
      !e.hasAttribute(`data-trix-validate-href`) ||
      gn.isValidAttribute(`a`, `href`, e.value)
    );
  }
  removeAttribute(e) {
    var t;
    let n = Pi(e);
    return (
      (t = this.delegate) == null || t.toolbarDidRemoveAttribute(n),
      this.hideDialog()
    );
  }
  hideDialog() {
    let e = this.element.querySelector(Oi);
    var t;
    if (e)
      return (
        e.removeAttribute(`data-trix-active`),
        e.classList.remove(`trix-active`),
        this.resetDialogInputs(),
        (t = this.delegate)?.toolbarDidHideDialog(
          ((e) => e.getAttribute(`data-trix-dialog`))(e),
        )
      );
  }
  resetDialogInputs() {
    Array.from(this.element.querySelectorAll(ji)).forEach((e) => {
      e.setAttribute(`disabled`, `disabled`),
        e.removeAttribute(`data-trix-validate`),
        e.classList.remove(`trix-validate`);
    });
  }
  getDialog(e) {
    return this.element.querySelector(`[data-trix-dialog=${e}]`);
  }
}
class jr extends Zn {
  constructor(e) {
    let { editorElement: t, document: n, html: r } = e;
    super(...arguments),
      (this.editorElement = t),
      (this.selectionManager = new zn(this.editorElement)),
      (this.selectionManager.delegate = this),
      (this.composition = new Ln()),
      (this.composition.delegate = this),
      (this.attachmentManager = new Tn(this.composition.getAttachments())),
      (this.attachmentManager.delegate = this),
      (this.inputController =
        xe.getLevel() === 2
          ? new yr(this.editorElement)
          : new mr(this.editorElement)),
      (this.inputController.delegate = this),
      (this.inputController.responder = this.composition),
      (this.compositionController = new $n(
        this.editorElement,
        this.composition,
      )),
      (this.compositionController.delegate = this),
      (this.toolbarController = new _r(this.editorElement.toolbarElement)),
      (this.toolbarController.delegate = this),
      (this.editor = new Mn(
        this.composition,
        this.selectionManager,
        this.editorElement,
      )),
      n ? this.editor.loadDocument(n) : this.editor.loadHTML(r);
  }
  registerSelectionManager() {
    return I.registerSelectionManager(this.selectionManager);
  }
  unregisterSelectionManager() {
    return I.unregisterSelectionManager(this.selectionManager);
  }
  render() {
    return this.compositionController.render();
  }
  reparse() {
    return this.composition.replaceHTML(this.editorElement.innerHTML);
  }
  compositionDidChangeDocument(e) {
    if ((this.notifyEditorElement(`document-change`), !this.handlingInput))
      return this.render();
  }
  compositionDidChangeCurrentAttributes(e) {
    return (
      (this.currentAttributes = e),
      this.toolbarController.updateAttributes(this.currentAttributes),
      this.updateCurrentActions(),
      this.notifyEditorElement(`attributes-change`, {
        attributes: this.currentAttributes,
      })
    );
  }
  compositionDidPerformInsertionAtRange(e) {
    this.pasting && (this.pastedRange = e);
  }
  compositionShouldAcceptFile(e) {
    return this.notifyEditorElement(`file-accept`, { file: e });
  }
  compositionDidAddAttachment(e) {
    let t = this.attachmentManager.manageAttachment(e);
    return this.notifyEditorElement(`attachment-add`, { attachment: t });
  }
  compositionDidEditAttachment(e) {
    this.compositionController.rerenderViewForObject(e);
    let t = this.attachmentManager.manageAttachment(e);
    return (
      this.notifyEditorElement(`attachment-edit`, { attachment: t }),
      this.notifyEditorElement(`change`)
    );
  }
  compositionDidChangeAttachmentPreviewURL(e) {
    return (
      this.compositionController.invalidateViewForObject(e),
      this.notifyEditorElement(`change`)
    );
  }
  compositionDidRemoveAttachment(e) {
    let t = this.attachmentManager.unmanageAttachment(e);
    return this.notifyEditorElement(`attachment-remove`, { attachment: t });
  }
  compositionDidStartEditingAttachment(e, t) {
    return (
      (this.attachmentLocationRange =
        this.composition.document.getLocationRangeOfAttachment(e)),
      this.compositionController.installAttachmentEditorForAttachment(e, t),
      this.selectionManager.setLocationRange(this.attachmentLocationRange)
    );
  }
  compositionDidStopEditingAttachment(e) {
    this.compositionController.uninstallAttachmentEditor(),
      (this.attachmentLocationRange = null);
  }
  compositionDidRequestChangingSelectionToLocationRange(e) {
    if (!this.loadingSnapshot || this.isFocused())
      return (
        (this.requestedLocationRange = e),
        (this.compositionRevisionWhenLocationRangeRequested =
          this.composition.revision),
        this.handlingInput ? void 0 : this.render()
      );
  }
  compositionWillLoadSnapshot() {
    this.loadingSnapshot = !0;
  }
  compositionDidLoadSnapshot() {
    this.compositionController.refreshViewCache(),
      this.render(),
      (this.loadingSnapshot = !1);
  }
  getSelectionManager() {
    return this.selectionManager;
  }
  attachmentManagerDidRequestRemovalOfAttachment(e) {
    return this.removeAttachment(e);
  }
  compositionControllerWillSyncDocumentView() {
    return (
      this.inputController.editorWillSyncDocumentView(),
      this.selectionManager.lock(),
      this.selectionManager.clearSelection()
    );
  }
  compositionControllerDidSyncDocumentView() {
    return (
      this.inputController.editorDidSyncDocumentView(),
      this.selectionManager.unlock(),
      this.updateCurrentActions(),
      this.notifyEditorElement(`sync`)
    );
  }
  compositionControllerDidRender() {
    this.requestedLocationRange &&
      (this.compositionRevisionWhenLocationRangeRequested ===
        this.composition.revision &&
        this.selectionManager.setLocationRange(this.requestedLocationRange),
      (this.requestedLocationRange = null),
      (this.compositionRevisionWhenLocationRangeRequested = null)),
      this.renderedCompositionRevision !== this.composition.revision &&
        (this.runEditorFilters(),
        this.composition.updateCurrentAttributes(),
        this.notifyEditorElement(`render`)),
      (this.renderedCompositionRevision = this.composition.revision);
  }
  compositionControllerDidFocus() {
    return (
      this.isFocusedInvisibly() &&
        this.setLocationRange({ index: 0, offset: 0 }),
      this.toolbarController.hideDialog(),
      this.notifyEditorElement(`focus`)
    );
  }
  compositionControllerDidBlur() {
    return this.notifyEditorElement(`blur`);
  }
  compositionControllerDidSelectAttachment(e, t) {
    return (
      this.toolbarController.hideDialog(), this.composition.editAttachment(e, t)
    );
  }
  compositionControllerDidRequestDeselectingAttachment(e) {
    let t =
      this.attachmentLocationRange ||
      this.composition.document.getLocationRangeOfAttachment(e);
    return this.selectionManager.setLocationRange(t[1]);
  }
  compositionControllerWillUpdateAttachment(e) {
    return this.editor.recordUndoEntry(`Edit Attachment`, {
      context: e.id,
      consolidatable: !0,
    });
  }
  compositionControllerDidRequestRemovalOfAttachment(e) {
    return this.removeAttachment(e);
  }
  inputControllerWillHandleInput() {
    (this.handlingInput = !0), (this.requestedRender = !1);
  }
  inputControllerDidRequestRender() {
    this.requestedRender = !0;
  }
  inputControllerDidHandleInput() {
    if (((this.handlingInput = !1), this.requestedRender))
      return (this.requestedRender = !1), this.render();
  }
  inputControllerDidAllowUnhandledInput() {
    return this.notifyEditorElement(`change`);
  }
  inputControllerDidRequestReparse() {
    return this.reparse();
  }
  inputControllerWillPerformTyping() {
    return this.recordTypingUndoEntry();
  }
  inputControllerWillPerformFormatting(e) {
    return this.recordFormattingUndoEntry(e);
  }
  inputControllerWillCutText() {
    return this.editor.recordUndoEntry(`Cut`);
  }
  inputControllerWillPaste(e) {
    return (
      this.editor.recordUndoEntry(`Paste`),
      (this.pasting = !0),
      this.notifyEditorElement(`before-paste`, { paste: e })
    );
  }
  inputControllerDidPaste(e) {
    return (
      (e.range = this.pastedRange),
      (this.pastedRange = null),
      (this.pasting = null),
      this.notifyEditorElement(`paste`, { paste: e })
    );
  }
  inputControllerWillMoveText() {
    return this.editor.recordUndoEntry(`Move`);
  }
  inputControllerWillAttachFiles() {
    return this.editor.recordUndoEntry(`Drop Files`);
  }
  inputControllerWillPerformUndo() {
    return this.editor.undo();
  }
  inputControllerWillPerformRedo() {
    return this.editor.redo();
  }
  inputControllerDidReceiveKeyboardCommand(e) {
    return this.toolbarController.applyKeyboardCommand(e);
  }
  inputControllerDidStartDrag() {
    this.locationRangeBeforeDrag = this.selectionManager.getLocationRange();
  }
  inputControllerDidReceiveDragOverPoint(e) {
    return this.selectionManager.setLocationRangeFromPointRange(e);
  }
  inputControllerDidCancelDrag() {
    this.selectionManager.setLocationRange(this.locationRangeBeforeDrag),
      (this.locationRangeBeforeDrag = null);
  }
  locationRangeDidChange(e) {
    return (
      this.composition.updateCurrentAttributes(),
      this.updateCurrentActions(),
      this.attachmentLocationRange &&
        !Xe(this.attachmentLocationRange, e) &&
        this.composition.stopEditingAttachment(),
      this.notifyEditorElement(`selection-change`)
    );
  }
  toolbarDidClickButton() {
    if (!this.getLocationRange())
      return this.setLocationRange({ index: 0, offset: 0 });
  }
  toolbarDidInvokeAction(e, t) {
    return this.invokeAction(e, t);
  }
  toolbarDidToggleAttribute(e) {
    if (
      (this.recordFormattingUndoEntry(e),
      this.composition.toggleCurrentAttribute(e),
      this.render(),
      !this.selectionFrozen)
    )
      return this.editorElement.focus();
  }
  toolbarDidUpdateAttribute(e, t) {
    if (
      (this.recordFormattingUndoEntry(e),
      this.composition.setCurrentAttribute(e, t),
      this.render(),
      !this.selectionFrozen)
    )
      return this.editorElement.focus();
  }
  toolbarDidRemoveAttribute(e) {
    if (
      (this.recordFormattingUndoEntry(e),
      this.composition.removeCurrentAttribute(e),
      this.render(),
      !this.selectionFrozen)
    )
      return this.editorElement.focus();
  }
  toolbarWillShowDialog(e) {
    return this.composition.expandSelectionForEditing(), this.freezeSelection();
  }
  toolbarDidShowDialog(e) {
    return this.notifyEditorElement(`toolbar-dialog-show`, { dialogName: e });
  }
  toolbarDidHideDialog(e) {
    return (
      this.thawSelection(),
      this.editorElement.focus(),
      this.notifyEditorElement(`toolbar-dialog-hide`, { dialogName: e })
    );
  }
  freezeSelection() {
    if (!this.selectionFrozen)
      return (
        this.selectionManager.lock(),
        this.composition.freezeSelection(),
        (this.selectionFrozen = !0),
        this.render()
      );
  }
  thawSelection() {
    if (this.selectionFrozen)
      return (
        this.composition.thawSelection(),
        this.selectionManager.unlock(),
        (this.selectionFrozen = !1),
        this.render()
      );
  }
  canInvokeAction(e) {
    return (
      !!this.actionIsExternal(e) ||
      !((t = this.actions[e]) == null || (t = t.test) == null || !t.call(this))
    );
    var t;
  }
  invokeAction(e, t) {
    return this.actionIsExternal(e)
      ? this.notifyEditorElement(`action-invoke`, {
          actionName: e,
          invokingElement: t,
        })
      : (n = this.actions[e]) == null || (n = n.perform) == null
        ? void 0
        : n.call(this);
    var n;
  }
  actionIsExternal(e) {
    return /^x-./.test(e);
  }
  getCurrentActions() {
    let e = {};
    for (let t in this.actions) e[t] = this.canInvokeAction(t);
    return e;
  }
  updateCurrentActions() {
    let e = this.getCurrentActions();
    if (!Ye(e, this.currentActions))
      return (
        (this.currentActions = e),
        this.toolbarController.updateActions(this.currentActions),
        this.notifyEditorElement(`actions-change`, {
          actions: this.currentActions,
        })
      );
  }
  runEditorFilters() {
    let e = this.composition.getSnapshot();
    if (
      (Array.from(this.editor.filters).forEach((t) => {
        let { document: n, selectedRange: r } = e;
        (e = t.call(this.editor, e) || {}),
          (e.document ||= n),
          (e.selectedRange ||= r);
      }),
      (t = e),
      (n = this.composition.getSnapshot()),
      !Xe(t.selectedRange, n.selectedRange) ||
        !t.document.isEqualTo(n.document))
    )
      return this.composition.loadSnapshot(e);
    var t, n;
  }
  updateInputElement() {
    let e = (function (e, t) {
      let n = Nr[t];
      if (n) return n(e);
      throw Error(`unknown content type: ${t}`);
    })(this.compositionController.getSerializableElement(), `text/html`);
    return this.editorElement.setFormValue(e);
  }
  notifyEditorElement(e, t) {
    switch (e) {
      case `document-change`:
        this.documentChangedSinceLastRender = !0;
        break;
      case `render`:
        this.documentChangedSinceLastRender &&
          ((this.documentChangedSinceLastRender = !1),
          this.notifyEditorElement(`change`));
        break;
      case `change`:
      case `attachment-add`:
      case `attachment-edit`:
      case `attachment-remove`:
        this.updateInputElement();
    }
    return this.editorElement.notify(e, t);
  }
  removeAttachment(e) {
    return (
      this.editor.recordUndoEntry(`Delete Attachment`),
      this.composition.removeAttachment(e),
      this.render()
    );
  }
  recordFormattingUndoEntry(e) {
    let t = M(e),
      n = this.selectionManager.getLocationRange();
    if (t || !F(n))
      return this.editor.recordUndoEntry(`Formatting`, {
        context: this.getUndoContext(),
        consolidatable: !0,
      });
  }
  recordTypingUndoEntry() {
    return this.editor.recordUndoEntry(`Typing`, {
      context: this.getUndoContext(this.currentAttributes),
      consolidatable: !0,
    });
  }
  getUndoContext() {
    var e = [...arguments];
    return [this.getLocationContext(), this.getTimeContext(), ...Array.from(e)];
  }
  getLocationContext() {
    let e = this.selectionManager.getLocationRange();
    return F(e) ? e[0].index : e;
  }
  getTimeContext() {
    return T.interval > 0
      ? Math.floor(/* @__PURE__ */ new Date().getTime() / T.interval)
      : 0;
  }
  isFocused() {
    var e;
    return (
      this.editorElement ===
      (e = this.editorElement.ownerDocument)?.activeElement
    );
  }
  isFocusedInvisibly() {
    return this.isFocused() && !this.getLocationRange();
  }
  get actions() {
    return this.constructor.actions;
  }
}
Y(jr, `actions`, {
  undo: {
    test() {
      return this.editor.canUndo();
    },
    perform() {
      return this.editor.undo();
    },
  },
  redo: {
    test() {
      return this.editor.canRedo();
    },
    perform() {
      return this.editor.redo();
    },
  },
  link: {
    test() {
      return this.editor.canActivateAttribute(`href`);
    },
  },
  increaseNestingLevel: {
    test() {
      return this.editor.canIncreaseNestingLevel();
    },
    perform() {
      return this.editor.increaseNestingLevel() && this.render();
    },
  },
  decreaseNestingLevel: {
    test() {
      return this.editor.canDecreaseNestingLevel();
    },
    perform() {
      return this.editor.decreaseNestingLevel() && this.render();
    },
  },
  attachFiles: {
    test: () => !0,
    perform() {
      return xe.pickFiles(this.editor.insertFiles);
    },
  },
}),
  jr.proxyMethod(`getSelectionManager().setLocationRange`),
  jr.proxyMethod(`getSelectionManager().getLocationRange`);
var Fi = Object.freeze({
    __proto__: null,
    AttachmentEditorController: Xn,
    CompositionController: $n,
    Controller: Zn,
    EditorController: jr,
    InputController: cr,
    Level0InputController: mr,
    Level2InputController: yr,
    ToolbarController: _r,
  }),
  Ii = Object.freeze({
    __proto__: null,
    MutationObserver: ir,
    SelectionChangeObserver: Ft,
  }),
  Li = Object.freeze({
    __proto__: null,
    FileVerificationOperation: rr,
    ImagePreloadOperation: Vi,
  });
N(
  `trix-toolbar`,
  `%t {
  display: block;
}

%t {
  white-space: nowrap;
}

%t [data-trix-dialog] {
  display: none;
}

%t [data-trix-dialog][data-trix-active] {
  display: block;
}

%t [data-trix-dialog] [data-trix-validate]:invalid {
  background-color: #ffdddd;
}`,
);
class zr extends HTMLElement {
  connectedCallback() {
    this.innerHTML === `` && (this.innerHTML = w.getDefaultHTML());
  }
  get editorElements() {
    if (this.id) {
      var e;
      let t = (e = this.ownerDocument)?.querySelectorAll(
        `trix-editor[toolbar="${this.id}"]`,
      );
      return Array.from(t);
    }
    return [];
  }
  get editorElement() {
    let [e] = this.editorElements;
    return e;
  }
}
let Bi = 0;
const Wi = function (e) {
    if (!e.hasAttribute(`contenteditable`))
      return (
        e.toggleAttribute(`contenteditable`, !e.disabled),
        (function (e) {
          let t =
            arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return (t.times = 1), m(e, t);
        })(`focus`, { onElement: e, withCallback: () => Gi(e) })
      );
  },
  Gi = function (e) {
    return Ki(e), Yi(e);
  },
  Ki = function (e) {
    var t, n;
    if (
      (t = (n = document).queryCommandSupported) != null &&
      t.call(n, `enableObjectResizing`)
    )
      return (
        document.execCommand(`enableObjectResizing`, !1, !1),
        m(`mscontrolselect`, { onElement: e, preventDefault: !0 })
      );
  },
  Yi = function (e) {
    var t, n;
    if (
      (t = (n = document).queryCommandSupported) != null &&
      t.call(n, `DefaultParagraphSeparator`)
    ) {
      let { tagName: e } = r.default;
      if ([`div`, `p`].includes(e))
        return document.execCommand(`DefaultParagraphSeparator`, !1, e);
    }
  },
  Zi = s.forcesObjectResizing
    ? { display: `inline`, width: `auto` }
    : { display: `inline-block`, width: `1px` };
N(
  `trix-editor`,
  `%t {
    display: block;
}

%t:empty::before {
    content: attr(placeholder);
    color: graytext;
    cursor: text;
    pointer-events: none;
    white-space: pre-line;
}

%t a[contenteditable=false] {
    cursor: text;
}

%t img {
    max-width: 100%;
    height: auto;
}

%t ${t} figcaption textarea {
    resize: none;
}

%t ${t} figcaption textarea.trix-autoresize-clone {
    position: absolute;
    left: -9999px;
    max-height: 0px;
}

%t ${t} figcaption[data-trix-placeholder]:empty::before {
    content: attr(data-trix-placeholder);
    color: graytext;
}

%t [data-trix-cursor-target] {
    display: ${Zi.display} !important;
    width: ${Zi.width} !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
}

%t [data-trix-cursor-target=left] {
    vertical-align: top !important;
    margin-left: -1px !important;
}

%t [data-trix-cursor-target=right] {
    vertical-align: bottom !important;
    margin-right: -1px !important;
}`,
);
var Q = /* @__PURE__ */ new WeakMap(),
  Qi = /* @__PURE__ */ new WeakMap(),
  ea = /* @__PURE__ */ new WeakSet();
class Qr {
  constructor(e) {
    var t, n;
    qn((t = this), (n = ea)),
      n.add(t),
      Y(this, `value`, ``),
      Jn(this, Q, { writable: !0, value: void 0 }),
      Jn(this, Qi, { writable: !0, value: void 0 }),
      (this.element = e),
      Hn(this, Q, e.attachInternals()),
      Hn(this, Qi, !1);
  }
  connectedCallback() {
    Kn(this, ea, ta).call(this);
  }
  disconnectedCallback() {}
  get form() {
    return X(this, Q).form;
  }
  get name() {
    return this.element.getAttribute(`name`);
  }
  set name(e) {
    this.element.setAttribute(`name`, e);
  }
  get labels() {
    return X(this, Q).labels;
  }
  get disabled() {
    return X(this, Qi) || this.element.hasAttribute(`disabled`);
  }
  set disabled(e) {
    this.element.toggleAttribute(`disabled`, e);
  }
  get required() {
    return this.element.hasAttribute(`required`);
  }
  set required(e) {
    this.element.toggleAttribute(`required`, e), Kn(this, ea, ta).call(this);
  }
  get validity() {
    return X(this, Q).validity;
  }
  get validationMessage() {
    return X(this, Q).validationMessage;
  }
  get willValidate() {
    return X(this, Q).willValidate;
  }
  formDisabledCallback(e) {
    Hn(this, Qi, e);
  }
  setFormValue(e) {
    (this.value = e),
      Kn(this, ea, ta).call(this),
      X(this, Q).setFormValue(this.element.disabled ? void 0 : this.value);
  }
  checkValidity() {
    return X(this, Q).checkValidity();
  }
  reportValidity() {
    return X(this, Q).reportValidity();
  }
  setCustomValidity(e) {
    Kn(this, ea, ta).call(this, e);
  }
}
function ta() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ``,
    { required: t, value: n } = this.element,
    r = t && !n,
    i = !!e,
    a = b(`input`, { required: t }),
    o = e || a.validationMessage;
  X(this, Q).setValidity({ valueMissing: r, customError: i }, o);
}
var na = /* @__PURE__ */ new WeakMap(),
  ra = /* @__PURE__ */ new WeakMap(),
  ia = /* @__PURE__ */ new WeakMap();
class ro {
  constructor(e) {
    Jn(this, na, { writable: !0, value: void 0 }),
      Jn(this, ra, {
        writable: !0,
        value: (e) => {
          e.defaultPrevented ||
            (e.target === this.element.form && this.element.reset());
        },
      }),
      Jn(this, ia, {
        writable: !0,
        value: (e) => {
          if (e.defaultPrevented || this.element.contains(e.target)) return;
          let t = g(e.target, { matchingSelector: `label` });
          t && Array.from(this.labels).includes(t) && this.element.focus();
        },
      }),
      (this.element = e);
  }
  connectedCallback() {
    Hn(
      this,
      na,
      (function (e) {
        if (e.hasAttribute(`aria-label`) || e.hasAttribute(`aria-labelledby`))
          return;
        let t = function () {
          let t = Array.from(e.labels)
            .map((t) => {
              if (!t.contains(e)) return t.textContent;
            })
            .filter((e) => e)
            .join(` `);
          return t
            ? e.setAttribute(`aria-label`, t)
            : e.removeAttribute(`aria-label`);
        };
        return t(), m(`focus`, { onElement: e, withCallback: t });
      })(this.element),
    ),
      window.addEventListener(`reset`, X(this, ra), !1),
      window.addEventListener(`click`, X(this, ia), !1);
  }
  disconnectedCallback() {
    var e;
    (e = X(this, na)) == null || e.destroy(),
      window.removeEventListener(`reset`, X(this, ra), !1),
      window.removeEventListener(`click`, X(this, ia), !1);
  }
  get labels() {
    let e = [];
    this.element.id &&
      this.element.ownerDocument &&
      e.push(
        ...Array.from(
          this.element.ownerDocument.querySelectorAll(
            `label[for='${this.element.id}']`,
          ) || [],
        ),
      );
    let t = g(this.element, { matchingSelector: `label` });
    return t && [this.element, null].includes(t.control) && e.push(t), e;
  }
  get form() {
    return (
      console.warn(
        `This browser does not support the .form property for trix-editor elements.`,
      ),
      null
    );
  }
  get name() {
    return (
      console.warn(
        `This browser does not support the .name property for trix-editor elements.`,
      ),
      null
    );
  }
  set name(e) {
    console.warn(
      `This browser does not support the .name property for trix-editor elements.`,
    );
  }
  get disabled() {
    return (
      console.warn(
        `This browser does not support the [disabled] attribute for trix-editor elements.`,
      ),
      !1
    );
  }
  set disabled(e) {
    console.warn(
      `This browser does not support the [disabled] attribute for trix-editor elements.`,
    );
  }
  get required() {
    return (
      console.warn(
        `This browser does not support the [required] attribute for trix-editor elements.`,
      ),
      !1
    );
  }
  set required(e) {
    console.warn(
      `This browser does not support the [required] attribute for trix-editor elements.`,
    );
  }
  get validity() {
    return (
      console.warn(
        `This browser does not support the validity property for trix-editor elements.`,
      ),
      null
    );
  }
  get validationMessage() {
    return (
      console.warn(
        `This browser does not support the validationMessage property for trix-editor elements.`,
      ),
      ``
    );
  }
  get willValidate() {
    return (
      console.warn(
        `This browser does not support the willValidate property for trix-editor elements.`,
      ),
      !1
    );
  }
  formDisabledCallback(e) {}
  setFormValue(e) {}
  checkValidity() {
    return (
      console.warn(
        `This browser does not support checkValidity() for trix-editor elements.`,
      ),
      !0
    );
  }
  reportValidity() {
    return (
      console.warn(
        `This browser does not support reportValidity() for trix-editor elements.`,
      ),
      !0
    );
  }
  setCustomValidity(e) {
    console.warn(
      `This browser does not support setCustomValidity(validationMessage) for trix-editor elements.`,
    );
  }
}
var $ = /* @__PURE__ */ new WeakMap();
class so extends HTMLElement {
  constructor() {
    super(),
      Jn(this, $, { writable: !0, value: void 0 }),
      (this.willCreateInput = !0),
      Hn(
        this,
        $,
        this.constructor.formAssociated ? new Qr(this) : new ro(this),
      );
  }
  get trixId() {
    return this.hasAttribute(`trix-id`)
      ? this.getAttribute(`trix-id`)
      : (this.setAttribute(`trix-id`, ++Bi), this.trixId);
  }
  get labels() {
    return X(this, $).labels;
  }
  get disabled() {
    let { inputElement: e } = this;
    return e ? e.disabled : X(this, $).disabled;
  }
  set disabled(e) {
    let { inputElement: t } = this;
    t && (t.disabled = e), (X(this, $).disabled = e);
  }
  get required() {
    return X(this, $).required;
  }
  set required(e) {
    X(this, $).required = e;
  }
  get validity() {
    return X(this, $).validity;
  }
  get validationMessage() {
    return X(this, $).validationMessage;
  }
  get willValidate() {
    return X(this, $).willValidate;
  }
  get type() {
    return this.localName;
  }
  get toolbarElement() {
    var e;
    if (this.hasAttribute(`toolbar`))
      return (e = this.ownerDocument)?.getElementById(
        this.getAttribute(`toolbar`),
      );
    if (this.parentNode) {
      let e = `trix-toolbar-${this.trixId}`;
      return (
        this.setAttribute(`toolbar`, e),
        (this.internalToolbar = b(`trix-toolbar`, { id: e })),
        this.parentNode.insertBefore(this.internalToolbar, this),
        this.internalToolbar
      );
    }
  }
  get form() {
    let { inputElement: e } = this;
    return e ? e.form : X(this, $).form;
  }
  get inputElement() {
    var e;
    return this.hasAttribute(`input`)
      ? (e = this.ownerDocument)?.getElementById(this.getAttribute(`input`))
      : void 0;
  }
  get editor() {
    var e;
    return (e = this.editorController)?.editor;
  }
  get name() {
    let { inputElement: e } = this;
    return e ? e.name : X(this, $).name;
  }
  set name(e) {
    let { inputElement: t } = this;
    t ? (t.name = e) : (X(this, $).name = e);
  }
  get value() {
    let { inputElement: e } = this;
    return e ? e.value : X(this, $).value;
  }
  set value(e) {
    var t;
    (this.defaultValue = e),
      (t = this.editor) == null || t.loadHTML(this.defaultValue);
  }
  attributeChangedCallback(e, t, n) {
    e === `connected` &&
      this.isConnected &&
      t != null &&
      t !== n &&
      requestAnimationFrame(() => this.reconnect());
  }
  notify(e, t) {
    if (this.editorController)
      return h(`trix-${e}`, { onElement: this, attributes: t });
  }
  setFormValue(e) {
    let { inputElement: t } = this;
    t && (t.value = e), X(this, $).setFormValue(e);
  }
  connectedCallback() {
    if (!this.hasAttribute(`data-trix-internal`)) {
      if (
        (Wi(this),
        (function (e) {
          e.hasAttribute(`role`) || e.setAttribute(`role`, `textbox`);
        })(this),
        !this.editorController)
      ) {
        if (
          (h(`trix-before-initialize`, { onElement: this }),
          (this.defaultValue = this.inputElement
            ? this.inputElement.value
            : this.innerHTML),
          !this.hasAttribute(`input`) &&
            this.parentNode &&
            this.willCreateInput)
        ) {
          let e = `trix-input-${this.trixId}`;
          this.setAttribute(`input`, e);
          let t = b(`input`, { type: `hidden`, id: e });
          this.parentNode.insertBefore(t, this.nextElementSibling);
        }
        (this.editorController = new jr({
          editorElement: this,
          html: this.defaultValue,
        })),
          requestAnimationFrame(() =>
            h(`trix-initialize`, { onElement: this }),
          );
      }
      this.editorController.registerSelectionManager(),
        X(this, $).connectedCallback(),
        this.toggleAttribute(`connected`, !0),
        (function (e) {
          !document.querySelector(`:focus`) &&
            e.hasAttribute(`autofocus`) &&
            document.querySelector(`[autofocus]`) === e &&
            e.focus();
        })(this);
    }
  }
  disconnectedCallback() {
    var e;
    (e = this.editorController) == null || e.unregisterSelectionManager(),
      X(this, $).disconnectedCallback(),
      this.toggleAttribute(`connected`, !1);
  }
  reconnect() {
    this.removeInternalToolbar(),
      this.disconnectedCallback(),
      this.connectedCallback();
  }
  removeInternalToolbar() {
    var e;
    (e = this.internalToolbar) == null || e.remove(),
      (this.internalToolbar = null);
  }
  checkValidity() {
    return X(this, $).checkValidity();
  }
  reportValidity() {
    return X(this, $).reportValidity();
  }
  setCustomValidity(e) {
    X(this, $).setCustomValidity(e);
  }
  formDisabledCallback(e) {
    let { inputElement: t } = this;
    t && (t.disabled = e),
      this.toggleAttribute(`contenteditable`, !e),
      X(this, $).formDisabledCallback(e);
  }
  formResetCallback() {
    this.reset();
  }
  reset() {
    this.value = this.defaultValue;
  }
}
Y(so, `formAssociated`, `ElementInternals` in window),
  Y(so, `observedAttributes`, [`connected`]);
const aa = {
  VERSION: e,
  config: E,
  core: Pr,
  models: Wr,
  views: Gr,
  controllers: Fi,
  observers: Ii,
  operations: Li,
  elements: Object.freeze({
    __proto__: null,
    TrixEditorElement: so,
    TrixToolbarElement: zr,
  }),
  filters: Object.freeze({
    __proto__: null,
    Filter: On,
    attachmentGalleryFilter: Lr,
  }),
};
Object.assign(aa, Wr),
  (window.Trix = aa),
  setTimeout(function () {
    customElements.get(`trix-toolbar`) ||
      customElements.define(`trix-toolbar`, zr),
      customElements.get(`trix-editor`) ||
        customElements.define(`trix-editor`, so);
  }, 0);
export { aa as default };
//# sourceMappingURL=trix.esm.min.js.map
