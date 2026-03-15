// intl-tel-input@26.8.0 downloaded from https://ga.jspm.io/npm:intl-tel-input@26.8.0/build/js/intlTelInput.js

var t = {};
(function (e) {
  t ? (t = e()) : (window.intlTelInput = e());
})(() => {
  var t = (() => {
    var t = Object.defineProperty;
    var e = Object.getOwnPropertyDescriptor;
    var s = Object.getOwnPropertyNames;
    var i = Object.prototype.hasOwnProperty;
    var n = (e, s) => {
      for (var i in s) t(e, i, { get: s[i], enumerable: true });
    };
    var o = (n, o, r, l) => {
      if ((o && typeof o === "object") || typeof o === "function")
        for (let a of s(o))
          i.call(n, a) ||
            a === r ||
            t(n, a, {
              get: () => o[a],
              enumerable: !(l = e(o, a)) || l.enumerable,
            });
      return n;
    };
    var r = (e) => o(t({}, "__esModule", { value: true }), e);
    var l = {};
    n(l, { Iti: () => wt, default: () => Et });
    var a = [
      ["af", "93", 0, null, "0"],
      ["ax", "358", 1, ["18", "4"], "0"],
      ["al", "355", 0, null, "0"],
      ["dz", "213", 0, null, "0"],
      ["as", "1", 5, ["684"], "1"],
      ["ad", "376"],
      ["ao", "244"],
      ["ai", "1", 6, ["264"], "1"],
      ["ag", "1", 7, ["268"], "1"],
      ["ar", "54", 0, null, "0"],
      ["am", "374", 0, null, "0"],
      ["aw", "297"],
      ["ac", "247"],
      ["au", "61", 0, ["4"], "0"],
      ["at", "43", 0, null, "0"],
      ["az", "994", 0, null, "0"],
      ["bs", "1", 8, ["242"], "1"],
      ["bh", "973"],
      ["bd", "880", 0, null, "0"],
      ["bb", "1", 9, ["246"], "1"],
      ["by", "375", 0, null, "8"],
      ["be", "32", 0, null, "0"],
      ["bz", "501"],
      ["bj", "229"],
      ["bm", "1", 10, ["441"], "1"],
      ["bt", "975"],
      ["bo", "591", 0, null, "0"],
      ["ba", "387", 0, null, "0"],
      ["bw", "267"],
      ["br", "55", 0, null, "0"],
      ["io", "246"],
      ["vg", "1", 11, ["284"], "1"],
      ["bn", "673"],
      ["bg", "359", 0, null, "0"],
      ["bf", "226"],
      ["bi", "257"],
      ["kh", "855", 0, null, "0"],
      ["cm", "237"],
      [
        "ca",
        "1",
        1,
        [
          "204",
          "226",
          "236",
          "249",
          "250",
          "257",
          "263",
          "289",
          "306",
          "343",
          "354",
          "365",
          "367",
          "368",
          "382",
          "403",
          "416",
          "418",
          "428",
          "431",
          "437",
          "438",
          "450",
          "468",
          "474",
          "506",
          "514",
          "519",
          "548",
          "579",
          "581",
          "584",
          "587",
          "604",
          "613",
          "639",
          "647",
          "672",
          "683",
          "705",
          "709",
          "742",
          "753",
          "778",
          "780",
          "782",
          "807",
          "819",
          "825",
          "867",
          "873",
          "879",
          "902",
          "905",
          "942",
        ],
        "1",
      ],
      ["cv", "238"],
      ["bq", "599", 1, ["3", "4", "7"]],
      ["ky", "1", 12, ["345"], "1"],
      ["cf", "236"],
      ["td", "235"],
      ["cl", "56"],
      ["cn", "86", 0, null, "0"],
      ["cx", "61", 2, ["4", "89164"], "0"],
      ["cc", "61", 1, ["4", "89162"], "0"],
      ["co", "57", 0, null, "0"],
      ["km", "269"],
      ["cg", "242"],
      ["cd", "243", 0, null, "0"],
      ["ck", "682"],
      ["cr", "506"],
      ["ci", "225"],
      ["hr", "385", 0, null, "0"],
      ["cu", "53", 0, null, "0"],
      ["cw", "599", 0],
      ["cy", "357"],
      ["cz", "420"],
      ["dk", "45"],
      ["dj", "253"],
      ["dm", "1", 13, ["767"], "1"],
      ["do", "1", 2, ["809", "829", "849"], "1"],
      ["ec", "593", 0, null, "0"],
      ["eg", "20", 0, null, "0"],
      ["sv", "503"],
      ["gq", "240"],
      ["er", "291", 0, null, "0"],
      ["ee", "372"],
      ["sz", "268"],
      ["et", "251", 0, null, "0"],
      ["fk", "500"],
      ["fo", "298"],
      ["fj", "679"],
      ["fi", "358", 0, ["4"], "0"],
      ["fr", "33", 0, null, "0"],
      ["gf", "594", 0, null, "0"],
      ["pf", "689"],
      ["ga", "241"],
      ["gm", "220"],
      ["ge", "995", 0, null, "0"],
      ["de", "49", 0, null, "0"],
      ["gh", "233", 0, null, "0"],
      ["gi", "350"],
      ["gr", "30"],
      ["gl", "299"],
      ["gd", "1", 14, ["473"], "1"],
      ["gp", "590", 0, null, "0"],
      ["gu", "1", 15, ["671"], "1"],
      ["gt", "502"],
      ["gg", "44", 1, ["1481", "7781", "7839", "7911"], "0"],
      ["gn", "224"],
      ["gw", "245"],
      ["gy", "592"],
      ["ht", "509"],
      ["hn", "504"],
      ["hk", "852"],
      ["hu", "36", 0, null, "06"],
      ["is", "354"],
      ["in", "91", 0, null, "0"],
      ["id", "62", 0, null, "0"],
      ["ir", "98", 0, null, "0"],
      ["iq", "964", 0, null, "0"],
      ["ie", "353", 0, null, "0"],
      ["im", "44", 2, ["1624", "74576", "7524", "7624", "7924"], "0"],
      ["il", "972", 0, null, "0"],
      ["it", "39", 0, ["3"]],
      ["jm", "1", 4, ["658", "876"], "1"],
      ["jp", "81", 0, null, "0"],
      ["je", "44", 3, ["1534", "7509", "7700", "7797", "7829", "7937"], "0"],
      ["jo", "962", 0, null, "0"],
      ["kz", "7", 1, ["33", "7"], "8"],
      ["ke", "254", 0, null, "0"],
      ["ki", "686", 0, null, "0"],
      ["xk", "383", 0, null, "0"],
      ["kw", "965"],
      ["kg", "996", 0, null, "0"],
      ["la", "856", 0, null, "0"],
      ["lv", "371"],
      ["lb", "961", 0, null, "0"],
      ["ls", "266"],
      ["lr", "231", 0, null, "0"],
      ["ly", "218", 0, null, "0"],
      ["li", "423", 0, null, "0"],
      ["lt", "370", 0, null, "0"],
      ["lu", "352"],
      ["mo", "853"],
      ["mg", "261", 0, null, "0"],
      ["mw", "265", 0, null, "0"],
      ["my", "60", 0, null, "0"],
      ["mv", "960"],
      ["ml", "223"],
      ["mt", "356"],
      ["mh", "692", 0, null, "1"],
      ["mq", "596", 0, null, "0"],
      ["mr", "222"],
      ["mu", "230"],
      ["yt", "262", 1, ["269", "639"], "0"],
      ["mx", "52"],
      ["fm", "691"],
      ["md", "373", 0, null, "0"],
      ["mc", "377", 0, null, "0"],
      ["mn", "976", 0, null, "0"],
      ["me", "382", 0, null, "0"],
      ["ms", "1", 16, ["664"], "1"],
      ["ma", "212", 0, ["6", "7"], "0"],
      ["mz", "258"],
      ["mm", "95", 0, null, "0"],
      ["na", "264", 0, null, "0"],
      ["nr", "674"],
      ["np", "977", 0, null, "0"],
      ["nl", "31", 0, null, "0"],
      ["nc", "687"],
      ["nz", "64", 0, null, "0"],
      ["ni", "505"],
      ["ne", "227"],
      ["ng", "234", 0, null, "0"],
      ["nu", "683"],
      ["nf", "672"],
      ["kp", "850", 0, null, "0"],
      ["mk", "389", 0, null, "0"],
      ["mp", "1", 17, ["670"], "1"],
      ["no", "47", 0, ["4", "9"]],
      ["om", "968"],
      ["pk", "92", 0, null, "0"],
      ["pw", "680"],
      ["ps", "970", 0, null, "0"],
      ["pa", "507"],
      ["pg", "675"],
      ["py", "595", 0, null, "0"],
      ["pe", "51", 0, null, "0"],
      ["ph", "63", 0, null, "0"],
      ["pl", "48"],
      ["pt", "351"],
      ["pr", "1", 3, ["787", "939"], "1"],
      ["qa", "974"],
      ["re", "262", 0, null, "0"],
      ["ro", "40", 0, null, "0"],
      ["ru", "7", 0, ["33"], "8"],
      ["rw", "250", 0, null, "0"],
      ["ws", "685"],
      ["sm", "378"],
      ["st", "239"],
      ["sa", "966", 0, null, "0"],
      ["sn", "221"],
      ["rs", "381", 0, null, "0"],
      ["sc", "248"],
      ["sl", "232", 0, null, "0"],
      ["sg", "65"],
      ["sx", "1", 21, ["721"], "1"],
      ["sk", "421", 0, null, "0"],
      ["si", "386", 0, null, "0"],
      ["sb", "677"],
      ["so", "252", 0, null, "0"],
      ["za", "27", 0, null, "0"],
      ["kr", "82", 0, null, "0"],
      ["ss", "211", 0, null, "0"],
      ["es", "34"],
      ["lk", "94", 0, null, "0"],
      ["bl", "590", 1, null, "0"],
      ["sh", "290"],
      ["kn", "1", 18, ["869"], "1"],
      ["lc", "1", 19, ["758"], "1"],
      ["mf", "590", 2, null, "0"],
      ["pm", "508", 0, null, "0"],
      ["vc", "1", 20, ["784"], "1"],
      ["sd", "249", 0, null, "0"],
      ["sr", "597"],
      ["sj", "47", 1, ["4", "79", "9"]],
      ["se", "46", 0, null, "0"],
      ["ch", "41", 0, null, "0"],
      ["sy", "963", 0, null, "0"],
      ["tw", "886", 0, null, "0"],
      ["tj", "992"],
      ["tz", "255", 0, null, "0"],
      ["th", "66", 0, null, "0"],
      ["tl", "670"],
      ["tg", "228"],
      ["tk", "690"],
      ["to", "676"],
      ["tt", "1", 22, ["868"], "1"],
      ["tn", "216"],
      ["tr", "90", 0, null, "0"],
      ["tm", "993", 0, null, "8"],
      ["tc", "1", 23, ["649"], "1"],
      ["tv", "688"],
      ["vi", "1", 24, ["340"], "1"],
      ["ug", "256", 0, null, "0"],
      ["ua", "380", 0, null, "0"],
      ["ae", "971", 0, null, "0"],
      ["gb", "44", 0, null, "0"],
      ["us", "1", 0, null, "1"],
      ["uy", "598", 0, null, "0"],
      ["uz", "998"],
      ["vu", "678"],
      ["va", "39", 1, ["06698", "3"]],
      ["ve", "58", 0, null, "0"],
      ["vn", "84", 0, null, "0"],
      ["wf", "681"],
      ["eh", "212", 1, ["5288", "5289", "6", "7"], "0"],
      ["ye", "967", 0, null, "0"],
      ["zm", "260", 0, null, "0"],
      ["zw", "263", 0, null, "0"],
    ];
    var u = [];
    for (const t of a)
      u.push({
        name: "",
        iso2: t[0],
        dialCode: t[1],
        priority: t[2] || 0,
        areaCodes: t[3] || null,
        nodeById: {},
        nationalPrefix: t[4] || null,
        normalisedName: "",
        initials: "",
        dialCodePlus: "",
      });
    var c = u;
    var d = {
      OPEN_COUNTRY_DROPDOWN: "open:countrydropdown",
      CLOSE_COUNTRY_DROPDOWN: "close:countrydropdown",
      COUNTRY_CHANGE: "countrychange",
      INPUT: "input",
    };
    var h = {
      HIDE: "iti__hide",
      V_HIDE: "iti__v-hide",
      ARROW_UP: "iti__arrow--up",
      GLOBE: "iti__globe",
      FLAG: "iti__flag",
      LOADING: "iti__loading",
      COUNTRY_ITEM: "iti__country",
      HIGHLIGHT: "iti__highlight",
    };
    var p = {
      ARROW_UP: "ArrowUp",
      ARROW_DOWN: "ArrowDown",
      SPACE: " ",
      ENTER: "Enter",
      ESC: "Escape",
      TAB: "Tab",
    };
    var C = { PASTE: "insertFromPaste", DELETE_FWD: "deleteContentForward" };
    var y = {
      ALPHA_UNICODE: /\p{L}/u,
      NON_PLUS_NUMERIC: /[^+0-9]/,
      NON_PLUS_NUMERIC_GLOBAL: /[^+0-9]/g,
      HIDDEN_SEARCH_CHAR: /^[a-zA-ZÀ-ÿа-яА-Я ]$/,
    };
    var m = {
      SEARCH_DEBOUNCE_MS: 100,
      HIDDEN_SEARCH_RESET_MS: 1e3,
      NEXT_TICK: 0,
    };
    var f = { UNKNOWN_NUMBER_TYPE: -99, UNKNOWN_VALIDATION_ERROR: -99 };
    var g = {
      NARROW_VIEWPORT_WIDTH: 500,
      SANE_SELECTED_WITH_DIAL_WIDTH: 78,
      SANE_SELECTED_NO_DIAL_WIDTH: 42,
      INPUT_PADDING_EXTRA_LEFT: 6,
      DROPDOWN_MARGIN: 3,
      SANE_DROPDOWN_HEIGHT: 200,
    };
    var I = { PLUS: "+", NANP: "1" };
    var b = {
      ISO2: "gb",
      DIAL_CODE: "44",
      MOBILE_PREFIX: "7",
      MOBILE_CORE_LENGTH: 10,
    };
    var w = { ISO2: "us", DIAL_CODE: "1" };
    var D = { AGGRESSIVE: "aggressive", POLITE: "polite", OFF: "off" };
    var N = { AUTO: "auto" };
    var E = [
      "FIXED_LINE",
      "MOBILE",
      "FIXED_LINE_OR_MOBILE",
      "TOLL_FREE",
      "PREMIUM_RATE",
      "SHARED_COST",
      "VOIP",
      "PERSONAL_NUMBER",
      "PAGER",
      "UAN",
      "VOICEMAIL",
      "UNKNOWN",
    ];
    var L = new Set(E);
    var A = { COUNTRY_CODE: "countryCode", DIAL_CODE: "dialCode" };
    var v = {
      EXPANDED: "aria-expanded",
      LABEL: "aria-label",
      SELECTED: "aria-selected",
      ACTIVE_DESCENDANT: "aria-activedescendant",
      HASPOPUP: "aria-haspopup",
      CONTROLS: "aria-controls",
      HIDDEN: "aria-hidden",
      AUTOCOMPLETE: "aria-autocomplete",
      MODAL: "aria-modal",
    };
    var _ = {
      selectedCountryAriaLabel:
        "Change country, selected ${countryName} (${dialCode})",
      noCountrySelected: "Select country",
      countryListAriaLabel: "List of countries",
      searchPlaceholder: "Search",
      clearSearchAriaLabel: "Clear search",
      searchEmptyState: "No results found",
      searchSummaryAria(t) {
        return t === 0
          ? "No results found"
          : t === 1
            ? "1 result found"
            : `${t} results found`;
      },
    };
    var T = _;
    var O = (t) =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia(t).matches;
    var P = () => O(`(max-width: ${g.NARROW_VIEWPORT_WIDTH}px)`);
    var S = () => {
      if (typeof navigator !== "undefined" && typeof window !== "undefined") {
        const t = O("(max-height: 600px)");
        const e = O("(pointer: coarse)");
        return P() || (e && t);
      }
      return false;
    };
    var R = {
      allowDropdown: true,
      allowedNumberTypes: ["MOBILE", "FIXED_LINE"],
      allowNumberExtensions: false,
      allowPhonewords: false,
      autoPlaceholder: D.POLITE,
      containerClass: "",
      countryNameLocale: "en",
      countryOrder: null,
      countrySearch: true,
      customPlaceholder: null,
      dropdownAlwaysOpen: false,
      dropdownContainer: null,
      excludeCountries: [],
      fixDropdownWidth: true,
      formatAsYouType: true,
      formatOnDisplay: true,
      geoIpLookup: null,
      hiddenInput: null,
      i18n: {},
      initialCountry: "",
      loadUtils: null,
      nationalMode: true,
      onlyCountries: [],
      placeholderNumberType: "MOBILE",
      searchInputClass: "",
      separateDialCode: false,
      showFlags: true,
      strictMode: false,
      useFullscreenPopup: S(),
    };
    var U = (t) => JSON.stringify(t);
    var H = (t) => Boolean(t) && typeof t === "object" && !Array.isArray(t);
    var k = (t) => typeof t === "function";
    var x = (t) => {
      if (!t || typeof t !== "object") return false;
      const e = t;
      return (
        e.nodeType === 1 &&
        typeof e.tagName === "string" &&
        typeof e.appendChild === "function"
      );
    };
    var F = new Set(c.map((t) => t.iso2));
    var W = (t) => F.has(t);
    var M = new Set(Object.values(D));
    var B = (t) => {
      console.warn(`[intl-tel-input] ${t}`);
    };
    var $ = (t, e, s) => {
      B(`Option '${t}' must be ${e}; got ${U(s)}. Ignoring.`);
    };
    var j = (t, e) => Object.prototype.hasOwnProperty.call(t, e);
    var V = (t, e) => {
      const s = "an array of ISO2 country code strings";
      if (!Array.isArray(e)) {
        $(t, s, e);
        return false;
      }
      for (const i of e) {
        if (typeof i !== "string") {
          $(t, s, e);
          return false;
        }
        const n = i.toLowerCase();
        if (!W(n)) {
          B(`Invalid country code in '${t}': '${i}'. Ignoring.`);
          return false;
        }
      }
      return true;
    };
    var G = (t) => {
      if (t === void 0) return {};
      if (!H(t)) {
        const e = `The second argument must be an options object; got ${U(t)}. Using defaults.`;
        B(e);
        return {};
      }
      const e = {};
      for (const [s, i] of Object.entries(t))
        if (j(R, s))
          switch (s) {
            case "allowDropdown":
            case "allowNumberExtensions":
            case "allowPhonewords":
            case "countrySearch":
            case "dropdownAlwaysOpen":
            case "fixDropdownWidth":
            case "formatAsYouType":
            case "formatOnDisplay":
            case "nationalMode":
            case "showFlags":
            case "separateDialCode":
            case "strictMode":
            case "useFullscreenPopup":
              if (typeof i !== "boolean") {
                $(s, "a boolean", i);
                break;
              }
              e[s] = i;
              break;
            case "autoPlaceholder":
              if (typeof i !== "string" || !M.has(i)) {
                const t = Array.from(M).join(", ");
                $("autoPlaceholder", `one of ${t}`, i);
                break;
              }
              e[s] = i;
              break;
            case "containerClass":
            case "searchInputClass":
            case "countryNameLocale":
              if (typeof i !== "string") {
                $(s, "a string", i);
                break;
              }
              e[s] = i;
              break;
            case "countryOrder":
              (i === null || V(s, i)) && (e[s] = i);
              break;
            case "customPlaceholder":
            case "geoIpLookup":
            case "hiddenInput":
            case "loadUtils":
              if (i !== null && !k(i)) {
                $(s, "a function or null", i);
                break;
              }
              e[s] = i;
              break;
            case "dropdownContainer":
              if (i !== null && !x(i)) {
                $("dropdownContainer", "an HTMLElement or null", i);
                break;
              }
              e[s] = i;
              break;
            case "excludeCountries":
            case "onlyCountries":
              V(s, i) && (e[s] = i);
              break;
            case "i18n":
              if (i && !H(i)) {
                $("i18n", "an object", i);
                break;
              }
              e[s] = i;
              break;
            case "initialCountry": {
              if (typeof i !== "string") {
                $("initialCountry", "a string", i);
                break;
              }
              const t = i.toLowerCase();
              if (t && t !== N.AUTO && !W(t)) {
                $("initialCountry", "a valid ISO2 country code or 'auto'", i);
                break;
              }
              e[s] = i;
              break;
            }
            case "placeholderNumberType":
              if (typeof i !== "string" || !L.has(i)) {
                const t = Array.from(L).join(", ");
                $("placeholderNumberType", `one of ${t}`, i);
                break;
              }
              e[s] = i;
              break;
            case "allowedNumberTypes":
              if (i !== null) {
                if (!Array.isArray(i)) {
                  $(
                    "allowedNumberTypes",
                    "an array of number types or null",
                    i,
                  );
                  break;
                }
                let t = true;
                for (const e of i)
                  if (typeof e !== "string" || !L.has(e)) {
                    const s = Array.from(L).join(", ");
                    $(
                      "allowedNumberTypes",
                      `an array of valid number types (${s})`,
                      e,
                    );
                    t = false;
                    break;
                  }
                t && (e[s] = i);
              } else e[s] = null;
              break;
          }
        else B(`Unknown option '${s}'. Ignoring.`);
      return e;
    };
    var z = (t) => {
      if (t.dropdownAlwaysOpen) {
        t.useFullscreenPopup = false;
        t.allowDropdown = true;
      }
      t.useFullscreenPopup
        ? (t.fixDropdownWidth = false)
        : P() && (t.fixDropdownWidth = true);
      t.onlyCountries.length === 1 && (t.initialCountry = t.onlyCountries[0]);
      t.separateDialCode && (t.nationalMode = false);
      !t.allowDropdown ||
        t.showFlags ||
        t.separateDialCode ||
        (t.nationalMode = false);
      t.useFullscreenPopup &&
        !t.dropdownContainer &&
        (t.dropdownContainer = document.body);
      t.i18n = { ...T, ...t.i18n };
    };
    var K = (t) => t.replace(/\D/g, "");
    var Y = (t = "") =>
      t
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    var X = () =>
      typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
    var q = (t, e) => {
      const s = Y(e);
      const i = [];
      const n = [];
      const o = [];
      const r = [];
      const l = [];
      const a = [];
      for (const e of t)
        e.iso2 === s
          ? i.push(e)
          : e.normalisedName.startsWith(s)
            ? n.push(e)
            : e.normalisedName.includes(s)
              ? o.push(e)
              : s === e.dialCode || s === e.dialCodePlus
                ? r.push(e)
                : e.dialCodePlus.includes(s)
                  ? l.push(e)
                  : e.initials.includes(s) && a.push(e);
      const u = (t, e) => t.priority - e.priority;
      return [
        ...i.sort(u),
        ...n.sort(u),
        ...o.sort(u),
        ...r.sort(u),
        ...l.sort(u),
        ...a.sort(u),
      ];
    };
    var Q = (t, e) => {
      const s = e.toLowerCase();
      for (const e of t) {
        const t = e.name.toLowerCase();
        if (t.startsWith(s)) return e;
      }
      return null;
    };
    var J = (t) =>
      Object.keys(t)
        .filter((e) => Boolean(t[e]))
        .join(" ");
    var Z = (t, e, s) => {
      const i = document.createElement(t);
      e && Object.entries(e).forEach(([t, e]) => i.setAttribute(t, e));
      s && s.appendChild(i);
      return i;
    };
    var tt = () =>
      `\n  <svg class="iti__search-icon-svg" width="14" height="14" viewBox="0 0 24 24" focusable="false" ${v.HIDDEN}="true">\n    <circle cx="11" cy="11" r="7" />\n    <line x1="21" y1="21" x2="16.65" y2="16.65" />\n  </svg>`;
    var et = (t) => {
      const e = `iti-${t}-clear-mask`;
      return `\n    <svg class="iti__search-clear-svg" width="12" height="12" viewBox="0 0 16 16" ${v.HIDDEN}="true" focusable="false">\n      <mask id="${e}" maskUnits="userSpaceOnUse">\n        <rect width="16" height="16" fill="white" />\n        <path d="M5.2 5.2 L10.8 10.8 M10.8 5.2 L5.2 10.8" stroke="black" stroke-linecap="round" class="iti__search-clear-x" />\n      </mask>\n      <circle cx="8" cy="8" r="8" class="iti__search-clear-bg" mask="url(#${e})" />\n    </svg>`;
    };
    var st = () =>
      `\n  <svg class="iti__country-check-svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor" focusable="false" ${v.HIDDEN}="true">\n    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>\n  </svg>`;
    var it = () =>
      '\n  <svg width="256" height="256" viewBox="0 0 512 512" class="iti__globe-svg">\n    <path d="M508 213a240 240 0 0 0-449-87l-2 5-2 5c-8 14-13 30-17 46a65 65 0 0 1 56 4c16-10 35-19 56-27l9-3c-6 23-10 48-10 74h-16l4 6c3 4 5 8 6 13h6c0 22 3 44 8 65l2 10-25-10-4 5 12 18 9 3 6 2 8 3 9 26 1 2 16-7h1l-5-13-1-2c24 6 49 9 75 10v26l11 10 7 7v-30l1-13c22 0 44-3 65-8l10-2-21 48-1 1a317 317 0 0 1-14 23l-21 5h-2c6 16 7 33 1 50a240 240 0 0 0 211-265m-401-56-11 6c19-44 54-79 98-98-11 20-21 44-29 69-21 6-40 15-58 23m154 182v4c-29-1-57-6-81-13-7-25-12-52-13-81h94zm0-109h-94c1-29 6-56 13-81 24-7 52-12 81-13zm0-112c-22 1-44 4-65 8l-10 2 12-30 9-17 1-2a332 332 0 0 1 13-23c13-4 26-6 40-7zm187 69 6 4c4 12 6 25 6 38v1h-68c-1-26-4-51-10-74l48 20 1 1 14 8zm-14-44 10 20c-20-11-43-21-68-29-8-25-18-49-29-69 37 16 67 44 87 78M279 49h1c13 1 27 3 39 7l14 23 1 2a343 343 0 0 1 12 26l2 5 6 16c-23-6-48-9-74-10h-1zm0 87h1c29 1 56 6 81 13 7 24 12 51 12 80v1h-94zm2 207h-2v-94h95c-1 29-6 56-13 81-24 7-51 12-80 13m86 60-20 10c11-20 21-43 29-68 25-8 48-18 68-29-16 37-43 67-77 87m87-115-7 5-16 9-2 1a337 337 0 0 1-47 21c6-24 9-49 10-75h68c0 13-2 27-6 39"/>\n    <path d="m261 428-2-2-22-21a40 40 0 0 0-32-11h-1a37 37 0 0 0-18 8l-1 1-4 2-2 2-5 4c-9-3-36-31-47-44s-32-45-34-55l3-2a151 151 0 0 0 11-9v-1a39 39 0 0 0 5-48l-3-3-11-19-3-4-5-7h-1l-3-3-4-3-5-2a35 35 0 0 0-16-3h-5c-4 1-14 5-24 11l-4 2-4 3-4 2c-9 8-17 17-18 27a380 380 0 0 0 212 259h3c12 0 25-10 36-21l10-12 6-11a39 39 0 0 0-8-40"/>\n  </svg>';
    var nt = class _UI {
      constructor(t, e, s) {
        this.#t = null;
        this.#e = null;
        this.#s = null;
        this.#i = null;
        this.highlightedItem = null;
        t.dataset.intlTelInputId = s.toString();
        this.telInput = t;
        this.#n = e;
        this.#o = s;
        this.hadInitialPlaceholder = Boolean(t.getAttribute("placeholder"));
        this.#r = !!this.telInput.closest("[dir=rtl]");
        this.#n.separateDialCode && (this.#l = this.telInput.style.paddingLeft);
      }
      #n;
      #o;
      #r;
      #l;
      #a;
      #t;
      #e;
      #u;
      #c;
      #d;
      #h;
      #p;
      #C;
      #s;
      #i;
      static validateInput(t) {
        const e = t?.tagName;
        const s =
          Boolean(t) &&
          typeof t === "object" &&
          e === "INPUT" &&
          typeof t.setAttribute === "function";
        if (!s) {
          const e = Object.prototype.toString.call(t);
          throw new TypeError(
            `The first argument must be an HTMLInputElement, not ${e}`,
          );
        }
      }
      generateMarkup(t) {
        this.#a = t;
        this.telInput.classList.add("iti__tel-input");
        this.telInput.hasAttribute("autocomplete") ||
          this.telInput.setAttribute("autocomplete", "tel");
        this.telInput.hasAttribute("inputmode") ||
          this.telInput.setAttribute("inputmode", "tel");
        const e = this.#y();
        this.#m(e);
        e.appendChild(this.telInput);
        this.#f();
        this.#g(e);
      }
      #y() {
        const {
          allowDropdown: t,
          showFlags: e,
          containerClass: s,
          useFullscreenPopup: i,
        } = this.#n;
        const n = J({
          iti: true,
          "iti--allow-dropdown": t,
          "iti--show-flags": e,
          "iti--inline-dropdown": !i,
          [s]: Boolean(s),
        });
        const o = Z("div", { class: n });
        this.#r && o.setAttribute("dir", "ltr");
        this.telInput.before(o);
        return o;
      }
      #m(t) {
        const { allowDropdown: e, separateDialCode: s, showFlags: i } = this.#n;
        if (e || i || s) {
          this.countryContainer = Z(
            "div",
            { class: `iti__country-container ${h.V_HIDE}` },
            t,
          );
          if (e) {
            this.selectedCountry = Z(
              "button",
              {
                type: "button",
                class: "iti__selected-country",
                [v.EXPANDED]: "false",
                [v.LABEL]: this.#n.i18n.noCountrySelected,
                [v.HASPOPUP]: "dialog",
                [v.CONTROLS]: `iti-${this.#o}__dropdown-content`,
              },
              this.countryContainer,
            );
            this.telInput.disabled &&
              this.selectedCountry.setAttribute("disabled", "true");
          } else
            this.selectedCountry = Z(
              "div",
              { class: "iti__selected-country" },
              this.countryContainer,
            );
          const i = Z(
            "div",
            { class: "iti__selected-country-primary" },
            this.selectedCountry,
          );
          this.selectedCountryInner = Z("div", { class: h.FLAG }, i);
          e &&
            (this.#c = Z(
              "div",
              { class: "iti__arrow", [v.HIDDEN]: "true" },
              i,
            ));
          s &&
            (this.#u = Z(
              "div",
              { class: "iti__selected-dial-code" },
              this.selectedCountry,
            ));
          e && this.#I();
        }
      }
      #b() {
        const { fixDropdownWidth: t } = this.#n;
        if (t && !this.#d.style.width) {
          const t = this.telInput.offsetWidth;
          t > 0 && (this.#d.style.width = `${t}px`);
        }
      }
      #I() {
        const {
          fixDropdownWidth: t,
          useFullscreenPopup: e,
          countrySearch: s,
          i18n: i,
          dropdownContainer: n,
          containerClass: o,
        } = this.#n;
        const r = t ? "" : "iti--flexible-dropdown-width";
        this.#d = Z("div", {
          id: `iti-${this.#o}__dropdown-content`,
          class: `iti__dropdown-content ${h.HIDE} ${r}`,
          role: "dialog",
          [v.MODAL]: "true",
        });
        this.#r && this.#d.setAttribute("dir", "rtl");
        s && this.#w();
        this.countryList = Z(
          "ul",
          {
            class: "iti__country-list",
            id: `iti-${this.#o}__country-listbox`,
            role: "listbox",
            [v.LABEL]: i.countryListAriaLabel,
          },
          this.#d,
        );
        this.#D();
        s && this.#N();
        if (!e) {
          this.#b();
          this.#e = this.#E();
          s && (this.#d.style.height = `${this.#e}px`);
        }
        if (n) {
          const t = J({
            iti: true,
            "iti--container": true,
            "iti--fullscreen-popup": e,
            "iti--inline-dropdown": !e,
            [o]: Boolean(o),
          });
          this.#s = Z("div", { class: t });
          this.#s.appendChild(this.#d);
        } else this.countryContainer.appendChild(this.#d);
      }
      #w() {
        const { i18n: t, searchInputClass: e } = this.#n;
        const s = Z("div", { class: "iti__search-input-wrapper" }, this.#d);
        this.#h = Z(
          "span",
          { class: "iti__search-icon", [v.HIDDEN]: "true" },
          s,
        );
        this.#h.innerHTML = tt();
        this.searchInput = Z(
          "input",
          {
            id: `iti-${this.#o}__search-input`,
            type: "search",
            class: `iti__search-input ${e}`,
            placeholder: t.searchPlaceholder,
            role: "combobox",
            [v.EXPANDED]: "true",
            [v.LABEL]: t.searchPlaceholder,
            [v.CONTROLS]: `iti-${this.#o}__country-listbox`,
            [v.AUTOCOMPLETE]: "list",
            autocomplete: "off",
          },
          s,
        );
        this.searchClearButton = Z(
          "button",
          {
            type: "button",
            class: `iti__search-clear ${h.HIDE}`,
            [v.LABEL]: t.clearSearchAriaLabel,
            tabindex: "-1",
          },
          s,
        );
        this.searchClearButton.innerHTML = et(this.#o);
        this.#C = Z("span", { class: "iti__a11y-text" }, this.#d);
        this.#p = Z(
          "div",
          { class: `iti__no-results ${h.HIDE}`, [v.HIDDEN]: "true" },
          this.#d,
        );
        this.#p.textContent = t.searchEmptyState;
      }
      #f() {
        if (this.countryContainer) {
          this.#L();
          this.countryContainer.classList.remove(h.V_HIDE);
        }
      }
      #g(t) {
        const { hiddenInput: e } = this.#n;
        if (e) {
          const s = this.telInput.getAttribute("name") || "";
          const i = e(s);
          if (i.phone) {
            const e = this.telInput.form?.querySelector(
              `input[name="${i.phone}"]`,
            );
            if (e) this.hiddenInput = e;
            else {
              this.hiddenInput = Z("input", { type: "hidden", name: i.phone });
              t.appendChild(this.hiddenInput);
            }
          }
          if (i.country) {
            const e = this.telInput.form?.querySelector(
              `input[name="${i.country}"]`,
            );
            if (e) this.hiddenInputCountry = e;
            else {
              this.hiddenInputCountry = Z("input", {
                type: "hidden",
                name: i.country,
              });
              t.appendChild(this.hiddenInputCountry);
            }
          }
        }
      }
      #D() {
        const t = document.createDocumentFragment();
        for (let e = 0; e < this.#a.length; e++) {
          const s = this.#a[e];
          const i = J({ [h.COUNTRY_ITEM]: true });
          const n = Z("li", {
            id: `iti-${this.#o}__item-${s.iso2}`,
            class: i,
            tabindex: "-1",
            role: "option",
            [v.SELECTED]: "false",
          });
          n.dataset.dialCode = s.dialCode;
          n.dataset.countryCode = s.iso2;
          s.nodeById[this.#o] = n;
          this.#n.showFlags &&
            Z("div", { class: `${h.FLAG} iti__${s.iso2}` }, n);
          const o = Z("span", { class: "iti__country-name" }, n);
          o.textContent = `${s.name} `;
          const r = Z("span", { class: "iti__dial-code" }, o);
          this.#r && r.setAttribute("dir", "ltr");
          r.textContent = `(+${s.dialCode})`;
          t.appendChild(n);
        }
        this.countryList.appendChild(t);
      }
      #L() {
        if (this.selectedCountry) {
          const t = this.#n.separateDialCode
            ? g.SANE_SELECTED_WITH_DIAL_WIDTH
            : g.SANE_SELECTED_NO_DIAL_WIDTH;
          const e = this.selectedCountry.offsetWidth || this.#A() || t;
          const s = e + g.INPUT_PADDING_EXTRA_LEFT;
          this.telInput.style.paddingLeft = `${s}px`;
        }
      }
      static #v() {
        let t;
        try {
          t = window.top.document.body;
        } catch (e) {
          t = document.body;
        }
        return t;
      }
      #A() {
        if (this.telInput.parentNode) {
          const t = _UI.#v();
          const e = this.telInput.parentNode.cloneNode(false);
          e.style.visibility = "hidden";
          t.appendChild(e);
          const s = this.countryContainer.cloneNode();
          e.appendChild(s);
          const i = this.selectedCountry.cloneNode(true);
          s.appendChild(i);
          const n = i.offsetWidth;
          t.removeChild(e);
          return n;
        }
        return 0;
      }
      #E() {
        const t = _UI.#v();
        this.#d.classList.remove(h.HIDE);
        const e = Z("div", { class: "iti iti--inline-dropdown" });
        e.appendChild(this.#d);
        e.style.visibility = "hidden";
        t.appendChild(e);
        const s = this.#d.offsetHeight;
        t.removeChild(e);
        e.style.visibility = "";
        this.#d.classList.add(h.HIDE);
        return s > 0 ? s : g.SANE_DROPDOWN_HEIGHT;
      }
      #N() {
        const { i18n: t } = this.#n;
        const e = this.countryList.childElementCount;
        this.#C.textContent = t.searchSummaryAria(e);
      }
      filterCountriesByQuery(t) {
        let e;
        e = t === "" ? this.#a : q(this.#a, t);
        this.#_(e);
      }
      #T() {
        const t = this.searchInput.value.trim();
        this.filterCountriesByQuery(t);
        this.searchInput.value
          ? this.searchClearButton.classList.remove(h.HIDE)
          : this.searchClearButton.classList.add(h.HIDE);
      }
      handleSearchChange() {
        this.#t && clearTimeout(this.#t);
        this.#t = setTimeout(() => {
          this.#T();
          this.#t = null;
        }, m.SEARCH_DEBOUNCE_MS);
      }
      handleSearchClear() {
        this.searchInput.value = "";
        this.searchInput.focus();
        this.#T();
      }
      scrollTo(t) {
        const e = this.countryList;
        const s = document.documentElement.scrollTop;
        const i = e.offsetHeight;
        const n = e.getBoundingClientRect().top + s;
        const o = n + i;
        const r = t.offsetHeight;
        const l = t.getBoundingClientRect().top + s;
        const a = l + r;
        const u = l - n + e.scrollTop;
        if (l < n) e.scrollTop = u;
        else if (a > o) {
          const t = i - r;
          e.scrollTop = u - t;
        }
      }
      highlightListItem(t, e) {
        const s = this.highlightedItem;
        s && s.classList.remove(h.HIGHLIGHT);
        this.highlightedItem = t;
        if (this.highlightedItem) {
          this.highlightedItem.classList.add(h.HIGHLIGHT);
          if (this.#n.countrySearch) {
            const t = this.highlightedItem.getAttribute("id") || "";
            this.searchInput.setAttribute(v.ACTIVE_DESCENDANT, t);
          }
        }
        e && this.highlightedItem.focus();
      }
      handleUpDownKey(t) {
        let e =
          t === p.ARROW_UP
            ? this.highlightedItem?.previousElementSibling
            : this.highlightedItem?.nextElementSibling;
        !e &&
          this.countryList.childElementCount > 1 &&
          (e =
            t === p.ARROW_UP
              ? this.countryList.lastElementChild
              : this.countryList.firstElementChild);
        if (e) {
          this.scrollTo(e);
          this.highlightListItem(e, false);
        }
      }
      #O(t) {
        if (this.#i && this.#i.dataset.countryCode !== t) {
          this.#i.setAttribute(v.SELECTED, "false");
          this.#i.querySelector(".iti__country-check")?.remove();
          this.#i = null;
        }
        if (t && !this.#i) {
          const e = this.countryList.querySelector(
            `[data-country-code="${t}"]`,
          );
          if (e) {
            e.setAttribute(v.SELECTED, "true");
            const t = Z(
              "span",
              { class: "iti__country-check", [v.HIDDEN]: "true" },
              e,
            );
            t.innerHTML = st();
            this.#i = e;
          }
        }
      }
      #_(t) {
        this.countryList.innerHTML = "";
        let e = true;
        for (const s of t) {
          const t = s.nodeById[this.#o];
          if (t) {
            this.countryList.appendChild(t);
            if (e) {
              this.highlightListItem(t, false);
              e = false;
            }
          }
        }
        if (e) {
          this.highlightListItem(null, false);
          this.#p && this.#p.classList.remove(h.HIDE);
        } else this.#p && this.#p.classList.add(h.HIDE);
        this.countryList.scrollTop = 0;
        this.#N();
      }
      destroy() {
        this.telInput.iti = void 0;
        delete this.telInput.dataset.intlTelInputId;
        this.#n.separateDialCode && (this.telInput.style.paddingLeft = this.#l);
        const t = this.telInput.parentNode;
        t.before(this.telInput);
        t.remove();
        this.telInput = null;
        this.countryContainer = null;
        this.selectedCountry = null;
        this.selectedCountryInner = null;
        this.searchInput = null;
        this.searchClearButton = null;
        this.countryList = null;
        this.hiddenInput = null;
        this.hiddenInputCountry = null;
        this.highlightedItem = null;
        this.#u = null;
        this.#c = null;
        this.#d = null;
        this.#h = null;
        this.#p = null;
        this.#C = null;
        this.#s = null;
        this.#i = null;
        for (const t of this.#a) delete t.nodeById[this.#o];
        this.#a = null;
      }
      openDropdown() {
        const {
          countrySearch: t,
          dropdownAlwaysOpen: e,
          dropdownContainer: s,
        } = this.#n;
        this.#b();
        if (s) this.#P();
        else {
          const t = this.#S();
          const e = this.telInput.offsetHeight + g.DROPDOWN_MARGIN;
          t
            ? (this.#d.style.top = `${e}px`)
            : (this.#d.style.bottom = `${e}px`);
        }
        this.#d.classList.remove(h.HIDE);
        this.selectedCountry.setAttribute(v.EXPANDED, "true");
        if (t) {
          const t = this.countryList.firstElementChild;
          if (t) {
            this.highlightListItem(t, false);
            this.countryList.scrollTop = 0;
          }
          e || this.searchInput.focus();
        }
        this.#c.classList.add(h.ARROW_UP);
      }
      closeDropdown() {
        const { countrySearch: t, dropdownContainer: e } = this.#n;
        this.#d.classList.add(h.HIDE);
        this.selectedCountry.setAttribute(v.EXPANDED, "false");
        if (t) {
          this.searchInput.removeAttribute(v.ACTIVE_DESCENDANT);
          if (this.highlightedItem) {
            this.highlightedItem.classList.remove(h.HIGHLIGHT);
            this.highlightedItem = null;
          }
        }
        this.#c.classList.remove(h.ARROW_UP);
        if (e) {
          this.#s.remove();
          this.#s.style.top = "";
          this.#s.style.bottom = "";
        } else {
          this.#d.style.top = "";
          this.#d.style.bottom = "";
        }
      }
      #S() {
        if (this.#n.dropdownAlwaysOpen) return true;
        const t = this.telInput.getBoundingClientRect();
        const e = t.top;
        const s = window.innerHeight - t.bottom;
        return s >= this.#e || s >= e;
      }
      #P() {
        const { dropdownContainer: t, useFullscreenPopup: e } = this.#n;
        if (t) {
          if (!e) {
            const t = this.telInput.getBoundingClientRect();
            this.#s.style.left = `${t.left}px`;
            const e = this.#S();
            if (e) this.#s.style.top = `${t.bottom + g.DROPDOWN_MARGIN}px`;
            else {
              this.#s.style.top = "unset";
              this.#s.style.bottom = `${window.innerHeight - t.top + g.DROPDOWN_MARGIN}px`;
            }
          }
          t.appendChild(this.#s);
        }
      }
      isDropdownClosed() {
        return this.#d.classList.contains(h.HIDE);
      }
      setCountry(t) {
        const {
          allowDropdown: e,
          showFlags: s,
          separateDialCode: i,
          i18n: n,
        } = this.#n;
        const { name: o, dialCode: r, iso2: l = "" } = t;
        e && this.#O(l);
        if (this.selectedCountry) {
          const t = l && s ? `${h.FLAG} iti__${l}` : `${h.FLAG} ${h.GLOBE}`;
          let e, i, a;
          if (l) {
            i = o;
            e = n.selectedCountryAriaLabel
              .replace("${countryName}", o)
              .replace("${dialCode}", `+${r}`);
            a = s ? "" : it();
          } else {
            i = n.noCountrySelected;
            e = n.noCountrySelected;
            a = it();
          }
          this.selectedCountryInner.className = t;
          this.selectedCountry.setAttribute("title", i);
          this.selectedCountry.setAttribute(v.LABEL, e);
          this.selectedCountryInner.innerHTML = a;
        }
        if (i) {
          const t = r ? `+${r}` : "";
          this.#u.textContent = t;
          this.#L();
        }
      }
    };
    var ot = (t) => {
      const { onlyCountries: e, excludeCountries: s } = t;
      if (e?.length) {
        const t = e.map((t) => t.toLowerCase());
        return c.filter((e) => t.includes(e.iso2));
      }
      if (s?.length) {
        const t = s.map((t) => t.toLowerCase());
        return c.filter((e) => !t.includes(e.iso2));
      }
      return c;
    };
    var rt = (t, e) => {
      const { countryNameLocale: s, i18n: i } = e;
      let n;
      try {
        const t =
          typeof Intl !== "undefined" &&
          typeof Intl.DisplayNames === "function";
        n = t ? new Intl.DisplayNames(s, { type: "region" }) : null;
      } catch (t) {
        console.error(t);
        n = null;
      }
      for (const e of t)
        e.name = i[e.iso2] || n?.of(e.iso2.toUpperCase()) || "";
    };
    var lt = (t) => {
      const e = new Set();
      let s = 0;
      const i = {};
      const n = (t, e) => {
        if (!t || !e) return;
        e.length > s && (s = e.length);
        i.hasOwnProperty(e) || (i[e] = []);
        const n = i[e];
        n.includes(t) || n.push(t);
      };
      const o = [...t].sort((t, e) => t.priority - e.priority);
      for (const t of o) {
        e.has(t.dialCode) || e.add(t.dialCode);
        for (let e = 1; e < t.dialCode.length; e++) {
          const s = t.dialCode.substring(0, e);
          n(t.iso2, s);
        }
        n(t.iso2, t.dialCode);
        if (t.areaCodes) {
          const e = i[t.dialCode][0];
          for (const s of t.areaCodes) {
            for (let i = 1; i < s.length; i++) {
              const o = s.substring(0, i);
              const r = t.dialCode + o;
              n(e, r);
              n(t.iso2, r);
            }
            n(t.iso2, t.dialCode + s);
          }
        }
      }
      return { dialCodes: e, dialCodeMaxLen: s, dialCodeToIso2Map: i };
    };
    var at = (t, e) => {
      e.countryOrder &&
        (e.countryOrder = e.countryOrder.map((t) => t.toLowerCase()));
      t.sort((t, s) => {
        const { countryOrder: i } = e;
        if (i) {
          const e = i.indexOf(t.iso2);
          const n = i.indexOf(s.iso2);
          const o = e > -1;
          const r = n > -1;
          if (o || r) return o && r ? e - n : o ? -1 : 1;
        }
        return t.name.localeCompare(s.name);
      });
    };
    var ut = (t) => {
      for (const e of t) {
        e.normalisedName = Y(e.name);
        e.initials = e.normalisedName
          .split(/[^a-z]/)
          .map((t) => t[0])
          .join("");
        e.dialCodePlus = `+${e.dialCode}`;
      }
    };
    var ct = new Set(["800", "808", "870", "881", "882", "883", "888", "979"]);
    var dt = (t) => {
      const e = K(t).slice(0, 3);
      return t.startsWith("+") && ct.has(e);
    };
    var ht = (t, e, s, i) => {
      let n = t;
      if (s && e) {
        const t = `+${i.dialCode}`;
        const e =
          n[t.length] === " " || n[t.length] === "-" ? t.length + 1 : t.length;
        n = n.substring(e);
      }
      return n;
    };
    var pt = (t, e, s, i, n) => {
      const o = s ? s.formatNumberAsYouType(t, i.iso2) : t;
      const { dialCode: r } = i;
      if (n && e.charAt(0) !== "+" && o.includes(`+${r}`)) {
        const t = o.split(`+${r}`)[1] || "";
        return t.trim();
      }
      return o;
    };
    var Ct = (t, e, s, i) => {
      if (s === 0 && !i) return 0;
      let n = 0;
      for (let s = 0; s < e.length; s++) {
        /[+0-9]/.test(e[s]) && n++;
        if (n === t && !i) return s + 1;
        if (i && n === t + 1) return s;
      }
      return e.length;
    };
    var yt = [
      "800",
      "822",
      "833",
      "844",
      "855",
      "866",
      "877",
      "880",
      "881",
      "882",
      "883",
      "884",
      "885",
      "886",
      "887",
      "888",
      "889",
    ];
    var mt = (t) => {
      const e = K(t);
      if (e.startsWith(I.NANP) && e.length >= 4) {
        const t = e.substring(1, 4);
        return yt.includes(t);
      }
      return false;
    };
    var ft = class {
      #R;
      constructor() {}
      #U(t) {
        /[\u0660-\u0669]/.test(t)
          ? (this.#R = "arabic-indic")
          : /[\u06F0-\u06F9]/.test(t)
            ? (this.#R = "persian")
            : (this.#R = "ascii");
      }
      denormalise(t, e) {
        this.#R || this.#U(e);
        if (this.#R === "ascii") return t;
        const s = this.#R === "arabic-indic" ? 1632 : 1776;
        return t.replace(/[0-9]/g, (t) => String.fromCharCode(s + Number(t)));
      }
      normalise(t) {
        if (!t) return "";
        this.#U(t);
        if (this.#R === "ascii") return t;
        const e = this.#R === "arabic-indic" ? 1632 : 1776;
        const s =
          this.#R === "arabic-indic" ? /[\u0660-\u0669]/g : /[\u06F0-\u06F9]/g;
        return t.replace(s, (t) =>
          String.fromCharCode(t.charCodeAt(0) - e + 48),
        );
      }
      isAscii() {
        return this.#R === "ascii";
      }
    };
    var gt = 0;
    var It = new Set(c.map((t) => t.iso2));
    var bt = (t) => It.has(t);
    var wt = class _Iti {
      #H;
      #n;
      #k;
      #a;
      #x;
      #F;
      #W;
      #M;
      #B;
      #$;
      #j;
      #V;
      #G;
      #z;
      #K;
      #Y;
      #X;
      #q;
      constructor(t, e = {}) {
        this.id = gt++;
        nt.validateInput(t);
        const s = G(e);
        this.#n = { ...R, ...s };
        z(this.#n);
        this.#H = new nt(t, this.#n, this.id);
        this.#k = X();
        this.#z = new ft();
        this.promise = this.#Q(this.#n);
        this.#a = ot(this.#n);
        const {
          dialCodes: i,
          dialCodeMaxLen: n,
          dialCodeToIso2Map: o,
        } = lt(this.#a);
        this.#W = i;
        this.#x = n;
        this.#F = o;
        this.#M = new Map(this.#a.map((t) => [t.iso2, t]));
        this.#J();
      }
      #Z() {
        const t = this.#H.telInput.value.trim();
        return this.#z.normalise(t);
      }
      #tt(t) {
        const e = this.#H.telInput.value;
        this.#H.telInput.value = this.#z.denormalise(t, e);
      }
      #Q(t) {
        const { initialCountry: e, geoIpLookup: s, loadUtils: i } = t;
        const n = e === N.AUTO && Boolean(s);
        const o = Boolean(i) && !Nt.utils;
        let r;
        if (n)
          r = new Promise((t, e) => {
            this.#K = t;
            this.#Y = e;
          });
        else {
          r = Promise.resolve(void 0);
          this.#K = () => {};
          this.#Y = () => {};
        }
        let l;
        if (o)
          l = new Promise((t, e) => {
            this.#X = t;
            this.#q = e;
          });
        else {
          l = Promise.resolve(void 0);
          this.#X = () => {};
          this.#q = () => {};
        }
        return Promise.all([r, l]);
      }
      #J() {
        this.#B = {};
        this.#V = new AbortController();
        this.#et();
        this.#H.generateMarkup(this.#a);
        this.#st();
        this.#it();
        this.#nt();
        this.#n.dropdownAlwaysOpen && this.#ot();
      }
      #et() {
        rt(this.#a, this.#n);
        at(this.#a, this.#n);
        ut(this.#a);
      }
      #st(t = false) {
        const e = this.#H.telInput.getAttribute("value");
        const s = this.#z.normalise(e);
        const i = this.#Z();
        const n = s && s.startsWith("+") && (!i || !i.startsWith("+"));
        const o = n ? s : i;
        const r = this.#rt(o);
        const l = mt(o);
        const { initialCountry: a, geoIpLookup: u } = this.#n;
        const c = a === N.AUTO && u;
        const d = c && !t;
        const h = a.toLowerCase();
        const p = bt(h);
        r
          ? l
            ? p
              ? this.#lt(h)
              : d || this.#lt(w.ISO2)
            : this.#at(o)
          : p
            ? this.#lt(h)
            : d || this.#lt("");
        o && this.#ut(o);
      }
      #it() {
        this.#ct();
        this.#n.allowDropdown && this.#dt();
        (this.#H.hiddenInput || this.#H.hiddenInputCountry) &&
          this.#H.telInput.form &&
          this.#ht();
      }
      #ht() {
        const t = () => {
          this.#H.hiddenInput && (this.#H.hiddenInput.value = this.getNumber());
          this.#H.hiddenInputCountry &&
            (this.#H.hiddenInputCountry.value = this.#B.iso2 || "");
        };
        this.#H.telInput.form?.addEventListener("submit", t, {
          signal: this.#V.signal,
        });
      }
      #dt() {
        const t = this.#V.signal;
        const e = (t) => {
          this.#H.isDropdownClosed()
            ? this.#H.telInput.focus()
            : t.preventDefault();
        };
        const s = this.#H.telInput.closest("label");
        s && s.addEventListener("click", e, { signal: t });
        const i = () => {
          !this.#H.isDropdownClosed() ||
            this.#H.telInput.disabled ||
            this.#H.telInput.readOnly ||
            this.#ot();
        };
        this.#H.selectedCountry.addEventListener("click", i, { signal: t });
        const n = (t) => {
          const e = [p.ARROW_UP, p.ARROW_DOWN, p.SPACE, p.ENTER];
          if (this.#H.isDropdownClosed() && e.includes(t.key)) {
            t.preventDefault();
            t.stopPropagation();
            this.#ot();
          }
          t.key === p.TAB && this.#pt();
        };
        this.#H.countryContainer.addEventListener("keydown", n, { signal: t });
      }
      #nt() {
        const { loadUtils: t, initialCountry: e, geoIpLookup: s } = this.#n;
        if (t && !Nt.utils) {
          const e = () => {
            Nt.attachUtils(t)?.catch(() => {});
          };
          if (Nt.documentReady()) e();
          else {
            const t = () => {
              e();
            };
            window.addEventListener("load", t, { signal: this.#V.signal });
          }
        } else this.#X();
        const i = e === N.AUTO && s;
        i && (this.#B.iso2 ? this.#K() : this.#Ct());
      }
      #Ct() {
        if (Nt.autoCountry) this.#yt();
        else {
          this.#H.selectedCountryInner.classList.add(h.LOADING);
          if (!Nt.startedLoadingAutoCountry) {
            Nt.startedLoadingAutoCountry = true;
            if (typeof this.#n.geoIpLookup === "function") {
              const t = (t = "") => {
                this.#H.selectedCountryInner.classList.remove(h.LOADING);
                const e = t.toLowerCase();
                if (bt(e)) {
                  Nt.autoCountry = e;
                  setTimeout(() => _Iti.forEachInstance("handleAutoCountry"));
                } else _Iti.forEachInstance("handleAutoCountryFailure");
              };
              const e = () => {
                this.#H.selectedCountryInner.classList.remove(h.LOADING);
                _Iti.forEachInstance("handleAutoCountryFailure");
              };
              this.#n.geoIpLookup(t, e);
            }
          }
        }
      }
      #mt() {
        this.#ot();
        this.#H.searchInput.value = "+";
        this.#H.filterCountriesByQuery("");
      }
      #ct() {
        this.#ft();
        this.#gt();
        this.#It();
      }
      #ft() {
        const {
          strictMode: t,
          formatAsYouType: e,
          separateDialCode: s,
          allowDropdown: i,
          countrySearch: n,
        } = this.#n;
        let o = false;
        y.ALPHA_UNICODE.test(this.#Z()) && (o = true);
        const r = (r) => {
          const l = this.#Z();
          if (this.#k && r?.data === "+" && s && i && n) {
            const t = this.#H.telInput.selectionStart || 0;
            const e = l.substring(0, t - 1);
            const s = l.substring(t);
            this.#tt(e + s);
            this.#mt();
            return;
          }
          this.#at(l) && this.#bt();
          const a = r?.data && y.NON_PLUS_NUMERIC.test(r.data);
          const u = r?.inputType === C.PASTE && l;
          a || (u && !t)
            ? (o = true)
            : y.NON_PLUS_NUMERIC.test(l) || (o = false);
          const c = r?.detail && r.detail.isSetNumber;
          const d = this.#z.isAscii();
          if (e && !o && !c && d) {
            const t = this.#H.telInput.selectionStart || 0;
            const e = l.substring(0, t);
            const i = e.replace(y.NON_PLUS_NUMERIC_GLOBAL, "").length;
            const n = r?.inputType === C.DELETE_FWD;
            const o = this.#wt();
            const a = pt(o, l, Nt.utils, this.#B, s);
            const u = Ct(i, a, t, n);
            this.#tt(a);
            this.#H.telInput.setSelectionRange(u, u);
          }
          if (s && l.startsWith("+") && this.#B.dialCode) {
            const t = ht(l, true, s, this.#B);
            this.#tt(t);
          }
        };
        this.#H.telInput.addEventListener("input", r, {
          signal: this.#V.signal,
        });
      }
      #gt() {
        const {
          strictMode: t,
          separateDialCode: e,
          allowDropdown: s,
          countrySearch: i,
        } = this.#n;
        if (t || e) {
          const n = (n) => {
            if (
              n.key &&
              n.key.length === 1 &&
              !n.altKey &&
              !n.ctrlKey &&
              !n.metaKey
            ) {
              if (e && s && i && n.key === "+") {
                n.preventDefault();
                this.#mt();
                return;
              }
              if (t) {
                const t = this.#Z();
                const s = t.startsWith("+");
                const i =
                  !s && this.#H.telInput.selectionStart === 0 && n.key === "+";
                const o = this.#z.normalise(n.key);
                const r = /^[0-9]$/.test(o);
                const l = e ? r : i || r;
                const a = this.#H.telInput;
                const u = a.selectionStart;
                const c = a.selectionEnd;
                const d = t.slice(0, u);
                const h = t.slice(c);
                const p = d + n.key + h;
                const C = this.#wt(p);
                const y = Nt.utils.getCoreNumber(C, this.#B.iso2);
                const m = this.#$ && y.length > this.#$;
                const f = this.#Dt(C);
                const g = f !== null;
                (l && (!m || g || i)) || n.preventDefault();
              }
            }
          };
          this.#H.telInput.addEventListener("keydown", n, {
            signal: this.#V.signal,
          });
        }
      }
      #It() {
        if (this.#n.strictMode) {
          const t = (t) => {
            t.preventDefault();
            const e = this.#H.telInput;
            const s = e.selectionStart;
            const i = e.selectionEnd;
            const n = this.#Z();
            const o = n.slice(0, s);
            const r = n.slice(i);
            const l = this.#B.iso2;
            const a = t.clipboardData.getData("text");
            const u = this.#z.normalise(a);
            const c = s === 0 && i > 0;
            const d = !n.startsWith("+") || c;
            const h = u.replace(y.NON_PLUS_NUMERIC_GLOBAL, "");
            const p = h.startsWith("+");
            const C = h.replace(/\+/g, "");
            const m = p && d ? `+${C}` : C;
            let f = o + m + r;
            if (f.length > 5) {
              let t = Nt.utils.getCoreNumber(f, l);
              while (t.length === 0 && f.length > 0) {
                f = f.slice(0, -1);
                t = Nt.utils.getCoreNumber(f, l);
              }
              if (!t) return;
              if (this.#$ && t.length > this.#$) {
                if (e.selectionEnd !== n.length) return;
                {
                  const e = t.length - this.#$;
                  f = f.slice(0, f.length - e);
                }
              }
            }
            this.#tt(f);
            const g = s + m.length;
            e.setSelectionRange(g, g);
            e.dispatchEvent(new InputEvent("input", { bubbles: true }));
          };
          this.#H.telInput.addEventListener("paste", t, {
            signal: this.#V.signal,
          });
        }
      }
      #Nt(t) {
        const e = Number(this.#H.telInput.getAttribute("maxlength"));
        return e && t.length > e ? t.substring(0, e) : t;
      }
      #Et(t, e = {}) {
        const s = new CustomEvent(t, {
          bubbles: true,
          cancelable: true,
          detail: e,
        });
        this.#H.telInput.dispatchEvent(s);
      }
      #ot() {
        const { dropdownContainer: t, useFullscreenPopup: e } = this.#n;
        this.#G = new AbortController();
        this.#H.openDropdown();
        if (!e && t) {
          const t = () => this.#pt();
          window.addEventListener("scroll", t, { signal: this.#G.signal });
        }
        this.#Lt();
        this.#Et(d.OPEN_COUNTRY_DROPDOWN);
      }
      #Lt() {
        const t = this.#G.signal;
        this.#At(t);
        this.#vt(t);
        this.#n.dropdownAlwaysOpen || this.#_t(t);
        this.#Tt(t);
        this.#n.countrySearch && this.#Ot(t);
      }
      #At(t) {
        const e = (t) => {
          const e = t.target?.closest(`.${h.COUNTRY_ITEM}`);
          e && this.#H.highlightListItem(e, false);
        };
        this.#H.countryList.addEventListener("mouseover", e, { signal: t });
      }
      #vt(t) {
        const e = (t) => {
          const e = t.target?.closest(`.${h.COUNTRY_ITEM}`);
          e && this.#Pt(e);
        };
        this.#H.countryList.addEventListener("click", e, { signal: t });
      }
      #_t(t) {
        const e = (t) => {
          const e = t.target;
          const s = !!e.closest(`#iti-${this.id}__dropdown-content`);
          s || this.#pt();
        };
        setTimeout(() => {
          document.documentElement.addEventListener("click", e, { signal: t });
        }, 0);
      }
      #Tt(t) {
        let e = "";
        let s = null;
        const i = (t) => {
          const i = [p.ARROW_UP, p.ARROW_DOWN, p.ENTER, p.ESC];
          if (i.includes(t.key)) {
            t.preventDefault();
            t.stopPropagation();
            if (t.key === p.ARROW_UP || t.key === p.ARROW_DOWN)
              this.#H.handleUpDownKey(t.key);
            else if (t.key === p.ENTER) this.#St();
            else if (t.key === p.ESC) {
              this.#pt();
              this.#H.selectedCountry.focus();
            }
          }
          if (!this.#n.countrySearch && y.HIDDEN_SEARCH_CHAR.test(t.key)) {
            t.stopPropagation();
            s && clearTimeout(s);
            e += t.key.toLowerCase();
            this.#Rt(e);
            s = setTimeout(() => {
              e = "";
            }, m.HIDDEN_SEARCH_RESET_MS);
          }
        };
        document.addEventListener("keydown", i, { signal: t });
      }
      #Ot(t) {
        this.#H.searchInput.addEventListener(
          "input",
          () => this.#H.handleSearchChange(),
          { signal: t },
        );
        this.#H.searchClearButton.addEventListener(
          "click",
          () => this.#H.handleSearchClear(),
          { signal: t },
        );
      }
      #Rt(t) {
        const e = Q(this.#a, t);
        if (e) {
          const t = e.nodeById[this.id];
          this.#H.highlightListItem(t, false);
          this.#H.scrollTo(t);
        }
      }
      #St() {
        this.#H.highlightedItem && this.#Pt(this.#H.highlightedItem);
      }
      #ut(t) {
        const {
          formatOnDisplay: e,
          nationalMode: s,
          separateDialCode: i,
        } = this.#n;
        let n = t;
        if (e && Nt.utils && this.#B) {
          const e = dt(t);
          const o = (s && !e) || (!n.startsWith("+") && !i);
          const { NATIONAL: r, INTERNATIONAL: l } = Nt.utils.numberFormat;
          const a = o ? r : l;
          n = Nt.utils.formatNumber(n, this.#B.iso2, a);
        }
        n = this.#Ut(n);
        this.#tt(n);
      }
      #at(t) {
        const e = this.#Dt(t);
        return e !== null && this.#lt(e);
      }
      #Ht(t) {
        const { dialCode: e, nationalPrefix: s } = this.#B;
        const i = t.startsWith("+");
        if (i || !e) return t;
        const n = s && t.startsWith(s) && !this.#n.separateDialCode;
        const o = n ? t.substring(1) : t;
        return `+${e}${o}`;
      }
      #Dt(t) {
        const e = t.indexOf("+");
        let s = e ? t.substring(e) : t;
        const i = this.#B.iso2;
        const n = this.#B.dialCode;
        s = this.#Ht(s);
        const o = this.#rt(s, true);
        const r = K(s);
        if (o) {
          const t = K(o);
          const e = this.#F[t];
          if (e.length === 1) return e[0] === i ? null : e[0];
          if (!i && this.#j && e.includes(this.#j)) return this.#j;
          const s = n === I.NANP && mt(r);
          if (s) return null;
          const { areaCodes: l, priority: a } = this.#B;
          if (l) {
            const t = l.map((t) => `${n}${t}`);
            for (const e of t) if (r.startsWith(e)) return null;
          }
          const u = a === 0;
          const c = l && !u && r.length > t.length;
          const d = i && e.includes(i) && !c;
          const h = i === e[0];
          if (!d && !h) return e[0];
        } else {
          if (s.startsWith("+") && r.length) {
            const t = this.#B.dialCode || "";
            return t && t.startsWith(r) ? null : "";
          }
          if ((!s || s === "+") && !i && this.#j) return this.#j;
        }
        return null;
      }
      #lt(t) {
        const e = this.#B.iso2 || "";
        this.#B = t ? this.#M.get(t) : {};
        this.#B.iso2 && (this.#j = this.#B.iso2);
        this.#H.setCountry(this.#B);
        this.#kt();
        this.#xt();
        return e !== t;
      }
      #xt() {
        const {
          strictMode: t,
          placeholderNumberType: e,
          allowedNumberTypes: s,
        } = this.#n;
        const { iso2: i } = this.#B;
        if (t && Nt.utils)
          if (i) {
            const t = Nt.utils.numberType[e];
            let n = Nt.utils.getExampleNumber(i, false, t, true);
            let o = n;
            while (Nt.utils.isPossibleNumber(n, i, s)) {
              o = n;
              n += "0";
            }
            const r = Nt.utils.getCoreNumber(o, i);
            this.#$ = r.length;
            i === "by" && (this.#$ = r.length + 1);
          } else this.#$ = null;
      }
      #kt() {
        const {
          autoPlaceholder: t,
          placeholderNumberType: e,
          nationalMode: s,
          customPlaceholder: i,
        } = this.#n;
        const n =
          t === D.AGGRESSIVE ||
          (!this.#H.hadInitialPlaceholder && t === D.POLITE);
        if (Nt.utils && n) {
          const t = Nt.utils.numberType[e];
          let n = this.#B.iso2
            ? Nt.utils.getExampleNumber(this.#B.iso2, s, t)
            : "";
          n = this.#Ut(n);
          typeof i === "function" && (n = i(n, this.#B));
          this.#H.telInput.setAttribute("placeholder", n);
        }
      }
      #Pt(t) {
        const e = t.dataset[A.COUNTRY_CODE];
        const s = this.#lt(e);
        this.#pt();
        const i = t.dataset[A.DIAL_CODE];
        this.#Ft(i);
        if (this.#n.formatOnDisplay) {
          const t = this.#Z();
          this.#ut(t);
        }
        this.#H.telInput.focus();
        s && this.#bt();
      }
      #pt(t) {
        if (
          !(this.#H.isDropdownClosed() || (this.#n.dropdownAlwaysOpen && !t))
        ) {
          this.#H.closeDropdown();
          this.#G.abort();
          this.#G = null;
          this.#Et(d.CLOSE_COUNTRY_DROPDOWN);
        }
      }
      #Ft(t) {
        const e = this.#Z();
        const s = `+${t}`;
        let i;
        if (e.startsWith("+")) {
          const t = this.#rt(e);
          i = t ? e.replace(t, s) : s;
          this.#tt(i);
        }
      }
      #rt(t, e) {
        let s = "";
        if (t.startsWith("+")) {
          let i = "";
          let n = false;
          for (let o = 0; o < t.length; o++) {
            const r = t.charAt(o);
            if (/[0-9]/.test(r)) {
              i += r;
              const l = Boolean(this.#F[i]);
              if (!l) break;
              if (this.#W.has(i)) {
                s = t.substring(0, o + 1);
                n = true;
                if (!e) break;
              } else e && n && (s = t.substring(0, o + 1));
              if (i.length === this.#x) break;
            }
          }
        }
        return s;
      }
      #wt(t) {
        const e = t ? this.#z.normalise(t) : this.#Z();
        const { dialCode: s } = this.#B;
        let i;
        const n = K(e);
        i =
          this.#n.separateDialCode && !e.startsWith("+") && s && n
            ? `+${s}`
            : "";
        return i + e;
      }
      #Ut(t) {
        const e = Boolean(this.#rt(t));
        const s = ht(t, e, this.#n.separateDialCode, this.#B);
        return this.#Nt(s);
      }
      #bt() {
        this.#Et(d.COUNTRY_CHANGE);
      }
      #yt() {
        if (this.#H.telInput) {
          if (this.#n.initialCountry === N.AUTO && Nt.autoCountry) {
            this.#j = Nt.autoCountry;
            const t =
              this.#B.iso2 ||
              this.#H.selectedCountryInner.classList.contains(h.GLOBE);
            t || this.setCountry(this.#j);
            this.#K();
          }
        } else this.#K?.();
      }
      #Wt() {
        if (this.#H.telInput) {
          this.#st(true);
          this.#Y();
        } else this.#Y?.();
      }
      #Mt() {
        if (this.#H.telInput) {
          if (Nt.utils) {
            const t = this.#Z();
            t && this.#ut(t);
            if (this.#B.iso2) {
              this.#kt();
              this.#xt();
            }
          }
          this.#X();
        } else this.#X?.();
      }
      #Bt(t) {
        this.#H.telInput ? this.#q(t) : this.#q?.(t);
      }
      destroy() {
        if (this.#H.telInput) {
          this.#n.allowDropdown && this.#pt(true);
          this.#V.abort();
          this.#V = null;
          this.#H.destroy();
          Nt.instances instanceof Map
            ? Nt.instances.delete(this.id)
            : delete Nt.instances[this.id];
        }
      }
      isActive() {
        return !!this.#H?.telInput;
      }
      getExtension() {
        return Nt.utils && this.#H.telInput
          ? Nt.utils.getExtension(this.#wt(), this.#B.iso2)
          : "";
      }
      getNumber(t) {
        if (Nt.utils && this.#H.telInput) {
          const { iso2: e } = this.#B;
          const s = this.#wt();
          const i = Nt.utils.formatNumber(s, e, t);
          const n = this.#H.telInput.value;
          return this.#z.denormalise(i, n);
        }
        return "";
      }
      getNumberType() {
        return Nt.utils && this.#H.telInput
          ? Nt.utils.getNumberType(this.#wt(), this.#B.iso2)
          : f.UNKNOWN_NUMBER_TYPE;
      }
      getSelectedCountryData() {
        return this.#B;
      }
      getValidationError() {
        if (Nt.utils && this.#H.telInput) {
          const { iso2: t } = this.#B;
          return Nt.utils.getValidationError(this.#wt(), t);
        }
        return f.UNKNOWN_VALIDATION_ERROR;
      }
      isValidNumber() {
        const { dialCode: t, iso2: e } = this.#B;
        if (Nt.utils && this.#H.telInput) {
          const s = this.#wt();
          const i = Nt.utils.getCoreNumber(s, e);
          if (i) {
            if (
              t === b.DIAL_CODE &&
              i[0] === b.MOBILE_PREFIX &&
              i.length !== b.MOBILE_CORE_LENGTH
            )
              return false;
            const e = y.ALPHA_UNICODE.test(s);
            if (!e && t) {
              const e = s.startsWith("+") ? s.slice(1 + t.length) : s;
              const n = K(e).length;
              if (i.length > n) return false;
            }
          }
        }
        return this.#$t(false);
      }
      isValidNumberPrecise() {
        return this.#$t(true);
      }
      #jt(t) {
        return Nt.utils
          ? Nt.utils.isPossibleNumber(
              t,
              this.#B.iso2,
              this.#n.allowedNumberTypes,
            )
          : null;
      }
      #$t(t) {
        if (!Nt.utils || !this.#H.telInput) return null;
        const { allowNumberExtensions: e, allowPhonewords: s } = this.#n;
        const i = (e) => (t ? this.#Vt(e) : this.#jt(e));
        const n = this.#wt();
        if (!this.#B.iso2) {
          const t = dt(n);
          if (!t) return false;
        }
        if (!i(n)) return false;
        const o = n.search(y.ALPHA_UNICODE);
        const r = o > -1;
        if (r) {
          const t = this.#B.iso2;
          const i = Boolean(Nt.utils.getExtension(n, t));
          return i ? e : s;
        }
        return true;
      }
      #Vt(t) {
        return Nt.utils
          ? Nt.utils.isValidNumber(t, this.#B.iso2, this.#n.allowedNumberTypes)
          : null;
      }
      setCountry(t) {
        if (!this.#H.telInput) return;
        const e = t?.toLowerCase();
        if (!bt(e)) throw new Error(`Invalid country code: '${e}'`);
        const s = this.#B.iso2;
        const i = (t && e !== s) || (!t && s);
        if (i) {
          this.#lt(e);
          this.#Ft(this.#B.dialCode);
          if (this.#n.formatOnDisplay) {
            const t = this.#Z();
            this.#ut(t);
          }
          this.#bt();
        }
      }
      setNumber(t) {
        if (!this.#H.telInput) return;
        const e = this.#z.normalise(t);
        const s = this.#at(e);
        this.#ut(e);
        s && this.#bt();
        this.#Et(d.INPUT, { isSetNumber: true });
      }
      setPlaceholderNumberType(t) {
        if (this.#H.telInput) {
          this.#n.placeholderNumberType = t;
          this.#kt();
        }
      }
      setDisabled(t) {
        if (this.#H.telInput) {
          this.#H.telInput.disabled = t;
          t
            ? this.#H.selectedCountry.setAttribute("disabled", "true")
            : this.#H.selectedCountry.removeAttribute("disabled");
        }
      }
      static forEachInstance(t, ...e) {
        const s = Nt.instances;
        const i = s instanceof Map ? Array.from(s.values()) : Object.values(s);
        const n = e[0];
        i.forEach((e) => {
          if (e instanceof _Iti)
            switch (t) {
              case "handleUtils":
                e.#Mt();
                break;
              case "handleUtilsFailure":
                e.#Bt(n);
                break;
              case "handleAutoCountry":
                e.#yt();
                break;
              case "handleAutoCountryFailure":
                e.#Wt();
                break;
            }
        });
      }
    };
    var Dt = (t) => {
      if (!Nt.utils && !Nt.startedLoadingUtilsScript) {
        let e;
        if (typeof t !== "function")
          return Promise.reject(
            new TypeError(
              "The argument passed to attachUtils must be a function that returns a promise for the utilities module, not " +
                typeof t,
            ),
          );
        try {
          e = Promise.resolve(t());
        } catch (t) {
          return Promise.reject(t);
        }
        Nt.startedLoadingUtilsScript = true;
        return e
          .then((t) => {
            const e = t?.default;
            if (!e || typeof e !== "object")
              throw new TypeError(
                "The loader function passed to attachUtils did not resolve to a module object with utils as its default export.",
              );
            Nt.utils = e;
            wt.forEachInstance("handleUtils");
            return true;
          })
          .catch((t) => {
            wt.forEachInstance("handleUtilsFailure", t);
            throw t;
          });
      }
      return null;
    };
    var Nt = Object.assign(
      (t, e) => {
        const s = new wt(t, e);
        Nt.instances[s.id] = s;
        t.iti = s;
        return s;
      },
      {
        defaults: R,
        documentReady: () => document.readyState === "complete",
        getCountryData: () => c,
        getInstance: (t) => {
          const e = t.dataset.intlTelInputId;
          return e ? Nt.instances[e] : null;
        },
        instances: {},
        attachUtils: Dt,
        startedLoadingUtilsScript: false,
        startedLoadingAutoCountry: false,
        version: "26.8.0",
      },
    );
    var Et = Nt;
    return r(l);
  })();
  return t.default;
});
var e = t;
export { e as default };
