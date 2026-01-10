// intl-tel-input@25.14.1 downloaded from https://ga.jspm.io/npm:intl-tel-input@25.14.1/build/js/intlTelInput.js

var t = {};
(function (e) {
  t ? (t = e()) : (window.intlTelInput = e());
})(() => {
  var t = (() => {
    var t = Object.defineProperty;
    var e = Object.getOwnPropertyDescriptor;
    var i = Object.getOwnPropertyNames;
    var s = Object.prototype.hasOwnProperty;
    var n = (e, i) => {
      for (var s in i) t(e, s, { get: i[s], enumerable: true });
    };
    var o = (n, o, r, a) => {
      if ((o && typeof o === "object") || typeof o === "function")
        for (let l of i(o))
          s.call(n, l) ||
            l === r ||
            t(n, l, {
              get: () => o[l],
              enumerable: !(a = e(o, l)) || a.enumerable,
            });
      return n;
    };
    var r = (e) => o(t({}, "__esModule", { value: true }), e);
    var a = {};
    n(a, { Iti: () => nt, default: () => lt });
    var l = [
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
    for (const t of l)
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
    var d = u;
    var c = {
      ad: "Andorra",
      ae: "United Arab Emirates",
      af: "Afghanistan",
      ag: "Antigua & Barbuda",
      ai: "Anguilla",
      al: "Albania",
      am: "Armenia",
      ao: "Angola",
      ar: "Argentina",
      as: "American Samoa",
      at: "Austria",
      au: "Australia",
      aw: "Aruba",
      ax: "Åland Islands",
      az: "Azerbaijan",
      ba: "Bosnia & Herzegovina",
      bb: "Barbados",
      bd: "Bangladesh",
      be: "Belgium",
      bf: "Burkina Faso",
      bg: "Bulgaria",
      bh: "Bahrain",
      bi: "Burundi",
      bj: "Benin",
      bl: "St. Barthélemy",
      bm: "Bermuda",
      bn: "Brunei",
      bo: "Bolivia",
      bq: "Caribbean Netherlands",
      br: "Brazil",
      bs: "Bahamas",
      bt: "Bhutan",
      bw: "Botswana",
      by: "Belarus",
      bz: "Belize",
      ca: "Canada",
      cc: "Cocos (Keeling) Islands",
      cd: "Congo - Kinshasa",
      cf: "Central African Republic",
      cg: "Congo - Brazzaville",
      ch: "Switzerland",
      ci: "Côte d’Ivoire",
      ck: "Cook Islands",
      cl: "Chile",
      cm: "Cameroon",
      cn: "China",
      co: "Colombia",
      cr: "Costa Rica",
      cu: "Cuba",
      cv: "Cape Verde",
      cw: "Curaçao",
      cx: "Christmas Island",
      cy: "Cyprus",
      cz: "Czechia",
      de: "Germany",
      dj: "Djibouti",
      dk: "Denmark",
      dm: "Dominica",
      do: "Dominican Republic",
      dz: "Algeria",
      ec: "Ecuador",
      ee: "Estonia",
      eg: "Egypt",
      eh: "Western Sahara",
      er: "Eritrea",
      es: "Spain",
      et: "Ethiopia",
      fi: "Finland",
      fj: "Fiji",
      fk: "Falkland Islands",
      fm: "Micronesia",
      fo: "Faroe Islands",
      fr: "France",
      ga: "Gabon",
      gb: "United Kingdom",
      gd: "Grenada",
      ge: "Georgia",
      gf: "French Guiana",
      gg: "Guernsey",
      gh: "Ghana",
      gi: "Gibraltar",
      gl: "Greenland",
      gm: "Gambia",
      gn: "Guinea",
      gp: "Guadeloupe",
      gq: "Equatorial Guinea",
      gr: "Greece",
      gt: "Guatemala",
      gu: "Guam",
      gw: "Guinea-Bissau",
      gy: "Guyana",
      hk: "Hong Kong SAR China",
      hn: "Honduras",
      hr: "Croatia",
      ht: "Haiti",
      hu: "Hungary",
      id: "Indonesia",
      ie: "Ireland",
      il: "Israel",
      im: "Isle of Man",
      in: "India",
      io: "British Indian Ocean Territory",
      iq: "Iraq",
      ir: "Iran",
      is: "Iceland",
      it: "Italy",
      je: "Jersey",
      jm: "Jamaica",
      jo: "Jordan",
      jp: "Japan",
      ke: "Kenya",
      kg: "Kyrgyzstan",
      kh: "Cambodia",
      ki: "Kiribati",
      km: "Comoros",
      kn: "St. Kitts & Nevis",
      kp: "North Korea",
      kr: "South Korea",
      kw: "Kuwait",
      ky: "Cayman Islands",
      kz: "Kazakhstan",
      la: "Laos",
      lb: "Lebanon",
      lc: "St. Lucia",
      li: "Liechtenstein",
      lk: "Sri Lanka",
      lr: "Liberia",
      ls: "Lesotho",
      lt: "Lithuania",
      lu: "Luxembourg",
      lv: "Latvia",
      ly: "Libya",
      ma: "Morocco",
      mc: "Monaco",
      md: "Moldova",
      me: "Montenegro",
      mf: "St. Martin",
      mg: "Madagascar",
      mh: "Marshall Islands",
      mk: "North Macedonia",
      ml: "Mali",
      mm: "Myanmar (Burma)",
      mn: "Mongolia",
      mo: "Macao SAR China",
      mp: "Northern Mariana Islands",
      mq: "Martinique",
      mr: "Mauritania",
      ms: "Montserrat",
      mt: "Malta",
      mu: "Mauritius",
      mv: "Maldives",
      mw: "Malawi",
      mx: "Mexico",
      my: "Malaysia",
      mz: "Mozambique",
      na: "Namibia",
      nc: "New Caledonia",
      ne: "Niger",
      nf: "Norfolk Island",
      ng: "Nigeria",
      ni: "Nicaragua",
      nl: "Netherlands",
      no: "Norway",
      np: "Nepal",
      nr: "Nauru",
      nu: "Niue",
      nz: "New Zealand",
      om: "Oman",
      pa: "Panama",
      pe: "Peru",
      pf: "French Polynesia",
      pg: "Papua New Guinea",
      ph: "Philippines",
      pk: "Pakistan",
      pl: "Poland",
      pm: "St. Pierre & Miquelon",
      pr: "Puerto Rico",
      ps: "Palestinian Territories",
      pt: "Portugal",
      pw: "Palau",
      py: "Paraguay",
      qa: "Qatar",
      re: "Réunion",
      ro: "Romania",
      rs: "Serbia",
      ru: "Russia",
      rw: "Rwanda",
      sa: "Saudi Arabia",
      sb: "Solomon Islands",
      sc: "Seychelles",
      sd: "Sudan",
      se: "Sweden",
      sg: "Singapore",
      sh: "St. Helena",
      si: "Slovenia",
      sj: "Svalbard & Jan Mayen",
      sk: "Slovakia",
      sl: "Sierra Leone",
      sm: "San Marino",
      sn: "Senegal",
      so: "Somalia",
      sr: "Suriname",
      ss: "South Sudan",
      st: "São Tomé & Príncipe",
      sv: "El Salvador",
      sx: "Sint Maarten",
      sy: "Syria",
      sz: "Eswatini",
      tc: "Turks & Caicos Islands",
      td: "Chad",
      tg: "Togo",
      th: "Thailand",
      tj: "Tajikistan",
      tk: "Tokelau",
      tl: "Timor-Leste",
      tm: "Turkmenistan",
      tn: "Tunisia",
      to: "Tonga",
      tr: "Turkey",
      tt: "Trinidad & Tobago",
      tv: "Tuvalu",
      tw: "Taiwan",
      tz: "Tanzania",
      ua: "Ukraine",
      ug: "Uganda",
      us: "United States",
      uy: "Uruguay",
      uz: "Uzbekistan",
      va: "Vatican City",
      vc: "St. Vincent & Grenadines",
      ve: "Venezuela",
      vg: "British Virgin Islands",
      vi: "U.S. Virgin Islands",
      vn: "Vietnam",
      vu: "Vanuatu",
      wf: "Wallis & Futuna",
      ws: "Samoa",
      ye: "Yemen",
      yt: "Mayotte",
      za: "South Africa",
      zm: "Zambia",
      zw: "Zimbabwe",
    };
    var h = c;
    var p = {
      selectedCountryAriaLabel:
        "Change country, selected ${countryName} (${dialCode})",
      noCountrySelected: "Select country",
      countryListAriaLabel: "List of countries",
      searchPlaceholder: "Search",
      clearSearchAriaLabel: "Clear search",
      zeroSearchResults: "No results found",
      oneSearchResult: "1 result found",
      multipleSearchResults: "${count} results found",
      ac: "Ascension Island",
      xk: "Kosovo",
    };
    var m = p;
    var C = { ...h, ...m };
    var g = C;
    var y = {
      OPEN_COUNTRY_DROPDOWN: "open:countrydropdown",
      CLOSE_COUNTRY_DROPDOWN: "close:countrydropdown",
      COUNTRY_CHANGE: "countrychange",
      INPUT: "input",
    };
    var _ = {
      HIDE: "iti__hide",
      V_HIDE: "iti__v-hide",
      ARROW_UP: "iti__arrow--up",
      GLOBE: "iti__globe",
      FLAG: "iti__flag",
      COUNTRY_ITEM: "iti__country",
      HIGHLIGHT: "iti__highlight",
    };
    var f = {
      ARROW_UP: "ArrowUp",
      ARROW_DOWN: "ArrowDown",
      SPACE: " ",
      ENTER: "Enter",
      ESC: "Escape",
      TAB: "Tab",
    };
    var I = { PASTE: "insertFromPaste", DELETE_FWD: "deleteContentForward" };
    var b = {
      ALPHA_UNICODE: /\p{L}/u,
      NON_PLUS_NUMERIC: /[^+0-9]/,
      NON_PLUS_NUMERIC_GLOBAL: /[^+0-9]/g,
      HIDDEN_SEARCH_CHAR: /^[a-zA-ZÀ-ÿа-яА-Я ]$/,
    };
    var N = {
      SEARCH_DEBOUNCE_MS: 100,
      HIDDEN_SEARCH_RESET_MS: 1e3,
      NEXT_TICK: 0,
    };
    var D = { UNKNOWN_NUMBER_TYPE: -99, UNKNOWN_VALIDATION_ERROR: -99 };
    var L = {
      SANE_SELECTED_WITH_DIAL_WIDTH: 78,
      SANE_SELECTED_NO_DIAL_WIDTH: 42,
      INPUT_PADDING_EXTRA_LEFT: 6,
    };
    var w = { PLUS: "+", NANP: "1" };
    var E = {
      ISO2: "gb",
      DIAL_CODE: "44",
      MOBILE_PREFIX: "7",
      MOBILE_CORE_LENGTH: 10,
    };
    var v = { ISO2: "us", DIAL_CODE: "1" };
    var A = { AGGRESSIVE: "aggressive", POLITE: "polite", OFF: "off" };
    var T = { AUTO: "auto" };
    var S = { COUNTRY_CODE: "countryCode", DIAL_CODE: "dialCode" };
    var P = {
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
    var O = (t) =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia(t).matches;
    var R = () => {
      if (typeof navigator !== "undefined" && typeof window !== "undefined") {
        const t =
          /Android.+Mobile|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
          );
        const e = O("(max-width: 500px)");
        const i = O("(max-height: 600px)");
        const s = O("(pointer: coarse)");
        return t || e || (s && i);
      }
      return false;
    };
    var k = {
      allowPhonewords: false,
      allowDropdown: true,
      autoPlaceholder: A.POLITE,
      containerClass: "",
      countryOrder: null,
      countrySearch: true,
      customPlaceholder: null,
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
      showFlags: true,
      separateDialCode: false,
      strictMode: false,
      useFullscreenPopup: R(),
      validationNumberTypes: ["MOBILE"],
    };
    var M = (t, e) => {
      t.useFullscreenPopup && (t.fixDropdownWidth = false);
      t.onlyCountries.length === 1 && (t.initialCountry = t.onlyCountries[0]);
      t.separateDialCode && (t.nationalMode = false);
      !t.allowDropdown ||
        t.showFlags ||
        t.separateDialCode ||
        (t.nationalMode = false);
      t.useFullscreenPopup &&
        !t.dropdownContainer &&
        (t.dropdownContainer = document.body);
      t.i18n = { ...e, ...t.i18n };
    };
    var U = (t) => t.replace(/\D/g, "");
    var x = (t = "") =>
      t
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    var B = (t, e) => {
      const i = x(e);
      const s = [];
      const n = [];
      const o = [];
      const r = [];
      const a = [];
      const l = [];
      for (const e of t)
        e.iso2 === i
          ? s.push(e)
          : e.normalisedName.startsWith(i)
            ? n.push(e)
            : e.normalisedName.includes(i)
              ? o.push(e)
              : i === e.dialCode || i === e.dialCodePlus
                ? r.push(e)
                : e.dialCodePlus.includes(i)
                  ? a.push(e)
                  : e.initials.includes(i) && l.push(e);
      const u = (t, e) => t.priority - e.priority;
      return [
        ...s.sort(u),
        ...n.sort(u),
        ...o.sort(u),
        ...r.sort(u),
        ...a.sort(u),
        ...l.sort(u),
      ];
    };
    var H = (t, e) => {
      const i = e.toLowerCase();
      for (const e of t) {
        const t = e.name.toLowerCase();
        if (t.startsWith(i)) return e;
      }
      return null;
    };
    var F = (t) =>
      Object.keys(t)
        .filter((e) => Boolean(t[e]))
        .join(" ");
    var W = (t, e, i) => {
      const s = document.createElement(t);
      e && Object.entries(e).forEach(([t, e]) => s.setAttribute(t, e));
      i && i.appendChild(s);
      return s;
    };
    var $ = () =>
      `\n  <svg class="iti__search-icon-svg" width="14" height="14" viewBox="0 0 24 24" focusable="false" ${P.HIDDEN}="true">\n    <circle cx="11" cy="11" r="7" />\n    <line x1="21" y1="21" x2="16.65" y2="16.65" />\n  </svg>`;
    var G = (t) => {
      const e = `iti-${t}-clear-mask`;
      return `\n    <svg class="iti__search-clear-svg" width="12" height="12" viewBox="0 0 16 16" ${P.HIDDEN}="true" focusable="false">\n      <mask id="${e}" maskUnits="userSpaceOnUse">\n        <rect width="16" height="16" fill="white" />\n        <path d="M5.2 5.2 L10.8 10.8 M10.8 5.2 L5.2 10.8" stroke="black" stroke-linecap="round" class="iti__search-clear-x" />\n      </mask>\n      <circle cx="8" cy="8" r="8" class="iti__search-clear-bg" mask="url(#${e})" />\n    </svg>`;
    };
    var V = class {
      constructor(t, e, i) {
        this.highlightedItem = null;
        this.selectedItem = null;
        t.dataset.intlTelInputId = i.toString();
        this.telInput = t;
        this.options = e;
        this.id = i;
        this.hadInitialPlaceholder = Boolean(t.getAttribute("placeholder"));
        this.isRTL = !!this.telInput.closest("[dir=rtl]");
        this.options.separateDialCode &&
          (this.originalPaddingLeft = this.telInput.style.paddingLeft);
      }
      generateMarkup(t) {
        this.countries = t;
        this._prepareTelInput();
        const e = this._createWrapperAndInsert();
        this._maybeBuildCountryContainer(e);
        e.appendChild(this.telInput);
        this._maybeUpdateInputPaddingAndReveal();
        this._maybeBuildHiddenInputs(e);
      }
      _prepareTelInput() {
        this.telInput.classList.add("iti__tel-input");
        this.telInput.hasAttribute("autocomplete") ||
          this.telInput.form?.hasAttribute("autocomplete") ||
          this.telInput.setAttribute("autocomplete", "off");
      }
      _createWrapperAndInsert() {
        const {
          allowDropdown: t,
          showFlags: e,
          containerClass: i,
          useFullscreenPopup: s,
        } = this.options;
        const n = F({
          iti: true,
          "iti--allow-dropdown": t,
          "iti--show-flags": e,
          "iti--inline-dropdown": !s,
          [i]: Boolean(i),
        });
        const o = W("div", { class: n });
        this.isRTL && o.setAttribute("dir", "ltr");
        this.telInput.before(o);
        return o;
      }
      _maybeBuildCountryContainer(t) {
        const {
          allowDropdown: e,
          separateDialCode: i,
          showFlags: s,
        } = this.options;
        if (e || s || i) {
          this.countryContainer = W(
            "div",
            { class: `iti__country-container ${_.V_HIDE}` },
            t,
          );
          if (e) {
            this.selectedCountry = W(
              "button",
              {
                type: "button",
                class: "iti__selected-country",
                [P.EXPANDED]: "false",
                [P.LABEL]: this.options.i18n.noCountrySelected,
                [P.HASPOPUP]: "dialog",
                [P.CONTROLS]: `iti-${this.id}__dropdown-content`,
              },
              this.countryContainer,
            );
            this.telInput.disabled &&
              this.selectedCountry.setAttribute("disabled", "true");
          } else
            this.selectedCountry = W(
              "div",
              { class: "iti__selected-country" },
              this.countryContainer,
            );
          const s = W(
            "div",
            { class: "iti__selected-country-primary" },
            this.selectedCountry,
          );
          this.selectedCountryInner = W("div", { class: _.FLAG }, s);
          e &&
            (this.dropdownArrow = W(
              "div",
              { class: "iti__arrow", [P.HIDDEN]: "true" },
              s,
            ));
          i &&
            (this.selectedDialCode = W(
              "div",
              { class: "iti__selected-dial-code" },
              this.selectedCountry,
            ));
          e && this._buildDropdownContent();
        }
      }
      _buildDropdownContent() {
        const {
          fixDropdownWidth: t,
          useFullscreenPopup: e,
          countrySearch: i,
          i18n: s,
          dropdownContainer: n,
          containerClass: o,
        } = this.options;
        const r = t ? "" : "iti--flexible-dropdown-width";
        this.dropdownContent = W("div", {
          id: `iti-${this.id}__dropdown-content`,
          class: `iti__dropdown-content ${_.HIDE} ${r}`,
          role: "dialog",
          [P.MODAL]: "true",
        });
        this.isRTL && this.dropdownContent.setAttribute("dir", "rtl");
        i && this._buildSearchUI();
        this.countryList = W(
          "ul",
          {
            class: "iti__country-list",
            id: `iti-${this.id}__country-listbox`,
            role: "listbox",
            [P.LABEL]: s.countryListAriaLabel,
          },
          this.dropdownContent,
        );
        this._appendListItems();
        i && this.updateSearchResultsA11yText();
        if (n) {
          const t = F({
            iti: true,
            "iti--container": true,
            "iti--fullscreen-popup": e,
            "iti--inline-dropdown": !e,
            [o]: Boolean(o),
          });
          this.dropdown = W("div", { class: t });
          this.dropdown.appendChild(this.dropdownContent);
        } else this.countryContainer.appendChild(this.dropdownContent);
      }
      _buildSearchUI() {
        const { i18n: t } = this.options;
        const e = W(
          "div",
          { class: "iti__search-input-wrapper" },
          this.dropdownContent,
        );
        this.searchIcon = W(
          "span",
          { class: "iti__search-icon", [P.HIDDEN]: "true" },
          e,
        );
        this.searchIcon.innerHTML = $();
        this.searchInput = W(
          "input",
          {
            id: `iti-${this.id}__search-input`,
            type: "search",
            class: "iti__search-input",
            placeholder: t.searchPlaceholder,
            role: "combobox",
            [P.EXPANDED]: "true",
            [P.LABEL]: t.searchPlaceholder,
            [P.CONTROLS]: `iti-${this.id}__country-listbox`,
            [P.AUTOCOMPLETE]: "list",
            autocomplete: "off",
          },
          e,
        );
        this.searchClearButton = W(
          "button",
          {
            type: "button",
            class: `iti__search-clear ${_.HIDE}`,
            [P.LABEL]: t.clearSearchAriaLabel,
            tabindex: "-1",
          },
          e,
        );
        this.searchClearButton.innerHTML = G(this.id);
        this.searchResultsA11yText = W(
          "span",
          { class: "iti__a11y-text" },
          this.dropdownContent,
        );
        this.searchNoResults = W(
          "div",
          { class: `iti__no-results ${_.HIDE}`, [P.HIDDEN]: "true" },
          this.dropdownContent,
        );
        this.searchNoResults.textContent = t.zeroSearchResults;
      }
      _maybeUpdateInputPaddingAndReveal() {
        if (this.countryContainer) {
          this.updateInputPadding();
          this.countryContainer.classList.remove(_.V_HIDE);
        }
      }
      _maybeBuildHiddenInputs(t) {
        const { hiddenInput: e } = this.options;
        if (e) {
          const i = this.telInput.getAttribute("name") || "";
          const s = e(i);
          if (s.phone) {
            const e = this.telInput.form?.querySelector(
              `input[name="${s.phone}"]`,
            );
            if (e) this.hiddenInput = e;
            else {
              this.hiddenInput = W("input", { type: "hidden", name: s.phone });
              t.appendChild(this.hiddenInput);
            }
          }
          if (s.country) {
            const e = this.telInput.form?.querySelector(
              `input[name="${s.country}"]`,
            );
            if (e) this.hiddenInputCountry = e;
            else {
              this.hiddenInputCountry = W("input", {
                type: "hidden",
                name: s.country,
              });
              t.appendChild(this.hiddenInputCountry);
            }
          }
        }
      }
      _appendListItems() {
        const t = document.createDocumentFragment();
        for (let e = 0; e < this.countries.length; e++) {
          const i = this.countries[e];
          const s = F({ [_.COUNTRY_ITEM]: true });
          const n = W("li", {
            id: `iti-${this.id}__item-${i.iso2}`,
            class: s,
            tabindex: "-1",
            role: "option",
            [P.SELECTED]: "false",
          });
          n.dataset.dialCode = i.dialCode;
          n.dataset.countryCode = i.iso2;
          i.nodeById[this.id] = n;
          this.options.showFlags &&
            W("div", { class: `${_.FLAG} iti__${i.iso2}` }, n);
          const o = W("span", { class: "iti__country-name" }, n);
          o.textContent = i.name;
          const r = W("span", { class: "iti__dial-code" }, n);
          this.isRTL && r.setAttribute("dir", "ltr");
          r.textContent = `+${i.dialCode}`;
          t.appendChild(n);
        }
        this.countryList.appendChild(t);
      }
      updateInputPadding() {
        if (this.selectedCountry) {
          const t = this.options.separateDialCode
            ? L.SANE_SELECTED_WITH_DIAL_WIDTH
            : L.SANE_SELECTED_NO_DIAL_WIDTH;
          const e =
            this.selectedCountry.offsetWidth ||
            this._getHiddenSelectedCountryWidth() ||
            t;
          const i = e + L.INPUT_PADDING_EXTRA_LEFT;
          this.telInput.style.paddingLeft = `${i}px`;
        }
      }
      _getHiddenSelectedCountryWidth() {
        if (this.telInput.parentNode) {
          let t;
          try {
            t = window.top.document.body;
          } catch (e) {
            t = document.body;
          }
          const e = this.telInput.parentNode.cloneNode(false);
          e.style.visibility = "hidden";
          t.appendChild(e);
          const i = this.countryContainer.cloneNode();
          e.appendChild(i);
          const s = this.selectedCountry.cloneNode(true);
          i.appendChild(s);
          const n = s.offsetWidth;
          t.removeChild(e);
          return n;
        }
        return 0;
      }
      updateSearchResultsA11yText() {
        const { i18n: t } = this.options;
        const e = this.countryList.childElementCount;
        let i;
        i =
          e === 0
            ? t.zeroSearchResults
            : t.searchResultsText
              ? t.searchResultsText(e)
              : e === 1
                ? t.oneSearchResult
                : t.multipleSearchResults.replace("${count}", e.toString());
        this.searchResultsA11yText.textContent = i;
      }
      scrollTo(t) {
        const e = this.countryList;
        const i = document.documentElement.scrollTop;
        const s = e.offsetHeight;
        const n = e.getBoundingClientRect().top + i;
        const o = n + s;
        const r = t.offsetHeight;
        const a = t.getBoundingClientRect().top + i;
        const l = a + r;
        const u = a - n + e.scrollTop;
        if (a < n) e.scrollTop = u;
        else if (l > o) {
          const t = s - r;
          e.scrollTop = u - t;
        }
      }
      highlightListItem(t, e) {
        const i = this.highlightedItem;
        i && i.classList.remove(_.HIGHLIGHT);
        this.highlightedItem = t;
        if (this.highlightedItem) {
          this.highlightedItem.classList.add(_.HIGHLIGHT);
          if (this.options.countrySearch) {
            const t = this.highlightedItem.getAttribute("id") || "";
            this.searchInput.setAttribute(P.ACTIVE_DESCENDANT, t);
          }
        }
        e && this.highlightedItem.focus();
      }
      updateSelectedItem(t) {
        if (this.selectedItem && this.selectedItem.dataset.countryCode !== t) {
          this.selectedItem.setAttribute(P.SELECTED, "false");
          this.selectedItem = null;
        }
        if (t && !this.selectedItem) {
          const e = this.countryList.querySelector(
            `[data-country-code="${t}"]`,
          );
          if (e) {
            e.setAttribute(P.SELECTED, "true");
            this.selectedItem = e;
          }
        }
      }
      filterCountries(t) {
        this.countryList.innerHTML = "";
        let e = true;
        for (const i of t) {
          const t = i.nodeById[this.id];
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
          this.searchNoResults && this.searchNoResults.classList.remove(_.HIDE);
        } else
          this.searchNoResults && this.searchNoResults.classList.add(_.HIDE);
        this.countryList.scrollTop = 0;
        this.updateSearchResultsA11yText();
      }
      destroy() {
        this.telInput.iti = void 0;
        delete this.telInput.dataset.intlTelInputId;
        this.options.separateDialCode &&
          (this.telInput.style.paddingLeft = this.originalPaddingLeft);
        const t = this.telInput.parentNode;
        t.before(this.telInput);
        t.remove();
        this.telInput = null;
        this.countryContainer = null;
        this.selectedCountry = null;
        this.selectedCountryInner = null;
        this.selectedDialCode = null;
        this.dropdownArrow = null;
        this.dropdownContent = null;
        this.searchInput = null;
        this.searchIcon = null;
        this.searchClearButton = null;
        this.searchNoResults = null;
        this.searchResultsA11yText = null;
        this.countryList = null;
        this.dropdown = null;
        this.hiddenInput = null;
        this.hiddenInputCountry = null;
        this.highlightedItem = null;
        this.selectedItem = null;
        for (const t of this.countries) delete t.nodeById[this.id];
        this.countries = null;
      }
    };
    var z = (t) => {
      const { onlyCountries: e, excludeCountries: i } = t;
      if (e.length) {
        const t = e.map((t) => t.toLowerCase());
        return d.filter((e) => t.includes(e.iso2));
      }
      if (i.length) {
        const t = i.map((t) => t.toLowerCase());
        return d.filter((e) => !t.includes(e.iso2));
      }
      return d;
    };
    var j = (t, e) => {
      for (const i of t) {
        const t = i.iso2.toLowerCase();
        e.i18n[t] && (i.name = e.i18n[t]);
      }
    };
    var K = (t) => {
      const e = new Set();
      let i = 0;
      const s = {};
      const n = (t, e) => {
        if (!t || !e) return;
        e.length > i && (i = e.length);
        s.hasOwnProperty(e) || (s[e] = []);
        const n = s[e];
        n.includes(t) || n.push(t);
      };
      const o = [...t].sort((t, e) => t.priority - e.priority);
      for (const t of o) {
        e.has(t.dialCode) || e.add(t.dialCode);
        for (let e = 1; e < t.dialCode.length; e++) {
          const i = t.dialCode.substring(0, e);
          n(t.iso2, i);
        }
        n(t.iso2, t.dialCode);
        if (t.areaCodes) {
          const e = s[t.dialCode][0];
          for (const i of t.areaCodes) {
            for (let s = 1; s < i.length; s++) {
              const o = i.substring(0, s);
              const r = t.dialCode + o;
              n(e, r);
              n(t.iso2, r);
            }
            n(t.iso2, t.dialCode + i);
          }
        }
      }
      return { dialCodes: e, dialCodeMaxLen: i, dialCodeToIso2Map: s };
    };
    var q = (t, e) => {
      e.countryOrder &&
        (e.countryOrder = e.countryOrder.map((t) => t.toLowerCase()));
      t.sort((t, i) => {
        const { countryOrder: s } = e;
        if (s) {
          const e = s.indexOf(t.iso2);
          const n = s.indexOf(i.iso2);
          const o = e > -1;
          const r = n > -1;
          if (o || r) return o && r ? e - n : o ? -1 : 1;
        }
        return t.name.localeCompare(i.name);
      });
    };
    var Y = (t) => {
      for (const e of t) {
        e.normalisedName = x(e.name);
        e.initials = e.normalisedName
          .split(/[^a-z]/)
          .map((t) => t[0])
          .join("");
        e.dialCodePlus = `+${e.dialCode}`;
      }
    };
    var X = (t, e, i, s) => {
      let n = t;
      if (i && e) {
        e = `+${s.dialCode}`;
        const t =
          n[e.length] === " " || n[e.length] === "-" ? e.length + 1 : e.length;
        n = n.substring(t);
      }
      return n;
    };
    var J = (t, e, i, s, n) => {
      const o = i ? i.formatNumberAsYouType(t, s.iso2) : t;
      const { dialCode: r } = s;
      if (n && e.charAt(0) !== "+" && o.includes(`+${r}`)) {
        const t = o.split(`+${r}`)[1] || "";
        return t.trim();
      }
      return o;
    };
    var Q = (t, e, i, s) => {
      if (i === 0 && !s) return 0;
      let n = 0;
      for (let i = 0; i < e.length; i++) {
        /[+0-9]/.test(e[i]) && n++;
        if (n === t && !s) return i + 1;
        if (s && n === t + 1) return i;
      }
      return e.length;
    };
    var Z = [
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
    var tt = (t) => {
      const e = U(t);
      if (e.startsWith(w.NANP) && e.length >= 4) {
        const t = e.substring(1, 4);
        return Z.includes(t);
      }
      return false;
    };
    for (const t of d) t.name = g[t.iso2];
    var et = 0;
    var it = new Set(d.map((t) => t.iso2));
    var st = (t) => it.has(t);
    var nt = class _Iti {
      constructor(t, e = {}) {
        this.id = et++;
        this.options = { ...k, ...e };
        M(this.options, g);
        this.ui = new V(t, this.options, this.id);
        this.isAndroid = _Iti._getIsAndroid();
        this.promise = this._createInitPromises();
        this.countries = z(this.options);
        const {
          dialCodes: i,
          dialCodeMaxLen: s,
          dialCodeToIso2Map: n,
        } = K(this.countries);
        this.dialCodes = i;
        this.dialCodeMaxLen = s;
        this.dialCodeToIso2Map = n;
        this.countryByIso2 = new Map(this.countries.map((t) => [t.iso2, t]));
        this._init();
      }
      static _getIsAndroid() {
        return (
          typeof navigator !== "undefined" &&
          /Android/i.test(navigator.userAgent)
        );
      }
      _updateNumeralSet(t) {
        /[\u0660-\u0669]/.test(t)
          ? (this.userNumeralSet = "arabic-indic")
          : /[\u06F0-\u06F9]/.test(t)
            ? (this.userNumeralSet = "persian")
            : (this.userNumeralSet = "ascii");
      }
      _mapAsciiToUserNumerals(t) {
        this.userNumeralSet || this._updateNumeralSet(this.ui.telInput.value);
        if (this.userNumeralSet === "ascii") return t;
        const e = this.userNumeralSet === "arabic-indic" ? 1632 : 1776;
        return t.replace(/[0-9]/g, (t) => String.fromCharCode(e + Number(t)));
      }
      _normaliseNumerals(t) {
        if (!t) return "";
        this._updateNumeralSet(t);
        if (this.userNumeralSet === "ascii") return t;
        const e = this.userNumeralSet === "arabic-indic" ? 1632 : 1776;
        const i =
          this.userNumeralSet === "arabic-indic"
            ? /[\u0660-\u0669]/g
            : /[\u06F0-\u06F9]/g;
        return t.replace(i, (t) =>
          String.fromCharCode(t.charCodeAt(0) - e + 48),
        );
      }
      _getTelInputValue() {
        const t = this.ui.telInput.value.trim();
        return this._normaliseNumerals(t);
      }
      _setTelInputValue(t) {
        this.ui.telInput.value = this._mapAsciiToUserNumerals(t);
      }
      _createInitPromises() {
        const t = new Promise((t, e) => {
          this.resolveAutoCountryPromise = t;
          this.rejectAutoCountryPromise = e;
        });
        const e = new Promise((t, e) => {
          this.resolveUtilsScriptPromise = t;
          this.rejectUtilsScriptPromise = e;
        });
        return Promise.all([t, e]);
      }
      _init() {
        this.selectedCountryData = {};
        this.abortController = new AbortController();
        this._processCountryData();
        this.ui.generateMarkup(this.countries);
        this._setInitialState();
        this._initListeners();
        this._initRequests();
      }
      _processCountryData() {
        j(this.countries, this.options);
        q(this.countries, this.options);
        Y(this.countries);
      }
      _setInitialState(t = false) {
        const e = this.ui.telInput.getAttribute("value");
        const i = this._normaliseNumerals(e);
        const s = this._getTelInputValue();
        const n = i && i.startsWith("+") && (!s || !s.startsWith("+"));
        const o = n ? i : s;
        const r = this._getDialCode(o);
        const a = tt(o);
        const { initialCountry: l, geoIpLookup: u } = this.options;
        const d = l === T.AUTO && u;
        if (r && !a) this._updateCountryFromNumber(o);
        else if (!d || t) {
          const t = l ? l.toLowerCase() : "";
          st(t)
            ? this._setCountry(t)
            : r && a
              ? this._setCountry(v.ISO2)
              : this._setCountry("");
        }
        o && this._updateValFromNumber(o);
      }
      _initListeners() {
        this._initTelInputListeners();
        this.options.allowDropdown && this._initDropdownListeners();
        (this.ui.hiddenInput || this.ui.hiddenInputCountry) &&
          this.ui.telInput.form &&
          this._initHiddenInputListener();
      }
      _initHiddenInputListener() {
        const t = () => {
          this.ui.hiddenInput && (this.ui.hiddenInput.value = this.getNumber());
          this.ui.hiddenInputCountry &&
            (this.ui.hiddenInputCountry.value =
              this.selectedCountryData.iso2 || "");
        };
        this.ui.telInput.form?.addEventListener("submit", t, {
          signal: this.abortController.signal,
        });
      }
      _initDropdownListeners() {
        const t = this.abortController.signal;
        const e = (t) => {
          this.ui.dropdownContent.classList.contains(_.HIDE)
            ? this.ui.telInput.focus()
            : t.preventDefault();
        };
        const i = this.ui.telInput.closest("label");
        i && i.addEventListener("click", e, { signal: t });
        const s = () => {
          const t = this.ui.dropdownContent.classList.contains(_.HIDE);
          !t ||
            this.ui.telInput.disabled ||
            this.ui.telInput.readOnly ||
            this._openDropdown();
        };
        this.ui.selectedCountry.addEventListener("click", s, { signal: t });
        const n = (t) => {
          const e = this.ui.dropdownContent.classList.contains(_.HIDE);
          if (
            e &&
            [f.ARROW_UP, f.ARROW_DOWN, f.SPACE, f.ENTER].includes(t.key)
          ) {
            t.preventDefault();
            t.stopPropagation();
            this._openDropdown();
          }
          t.key === f.TAB && this._closeDropdown();
        };
        this.ui.countryContainer.addEventListener("keydown", n, { signal: t });
      }
      _initRequests() {
        const {
          loadUtils: t,
          initialCountry: e,
          geoIpLookup: i,
        } = this.options;
        if (t && !at.utils) {
          const e = () => {
            at.attachUtils(t)?.catch(() => {});
          };
          if (at.documentReady()) e();
          else {
            const t = () => {
              e();
            };
            window.addEventListener("load", t, {
              signal: this.abortController.signal,
            });
          }
        } else this.resolveUtilsScriptPromise();
        const s = e === T.AUTO && i;
        s && !this.selectedCountryData.iso2
          ? this._loadAutoCountry()
          : this.resolveAutoCountryPromise();
      }
      _loadAutoCountry() {
        if (at.autoCountry) this.handleAutoCountry();
        else if (!at.startedLoadingAutoCountry) {
          at.startedLoadingAutoCountry = true;
          typeof this.options.geoIpLookup === "function" &&
            this.options.geoIpLookup(
              (t = "") => {
                const e = t.toLowerCase();
                if (st(e)) {
                  at.autoCountry = e;
                  setTimeout(() => rt("handleAutoCountry"));
                } else {
                  this._setInitialState(true);
                  rt("rejectAutoCountryPromise");
                }
              },
              () => {
                this._setInitialState(true);
                rt("rejectAutoCountryPromise");
              },
            );
        }
      }
      _openDropdownWithPlus() {
        this._openDropdown();
        this.ui.searchInput.value = "+";
        this._filterCountriesByQuery("");
      }
      _initTelInputListeners() {
        this._bindInputListener();
        this._maybeBindKeydownListener();
        this._maybeBindPasteListener();
      }
      _bindInputListener() {
        const {
          strictMode: t,
          formatAsYouType: e,
          separateDialCode: i,
          allowDropdown: s,
          countrySearch: n,
        } = this.options;
        let o = false;
        b.ALPHA_UNICODE.test(this._getTelInputValue()) && (o = true);
        const r = (r) => {
          const a = this._getTelInputValue();
          if (this.isAndroid && r?.data === "+" && i && s && n) {
            const t = this.ui.telInput.selectionStart || 0;
            const e = a.substring(0, t - 1);
            const i = a.substring(t);
            this._setTelInputValue(e + i);
            this._openDropdownWithPlus();
            return;
          }
          this._updateCountryFromNumber(a) && this._triggerCountryChange();
          const l = r?.data && b.NON_PLUS_NUMERIC.test(r.data);
          const u = r?.inputType === I.PASTE && a;
          l || (u && !t)
            ? (o = true)
            : b.NON_PLUS_NUMERIC.test(a) || (o = false);
          const d = r?.detail && r.detail.isSetNumber;
          const c = this.userNumeralSet === "ascii";
          if (e && !o && !d && c) {
            const t = this.ui.telInput.selectionStart || 0;
            const e = a.substring(0, t);
            const i = e.replace(b.NON_PLUS_NUMERIC_GLOBAL, "").length;
            const s = r?.inputType === I.DELETE_FWD;
            const n = this._getFullNumber();
            const o = J(
              n,
              a,
              at.utils,
              this.selectedCountryData,
              this.options.separateDialCode,
            );
            const l = Q(i, o, t, s);
            this._setTelInputValue(o);
            this.ui.telInput.setSelectionRange(l, l);
          }
        };
        this.ui.telInput.addEventListener("input", r, {
          signal: this.abortController.signal,
        });
      }
      _maybeBindKeydownListener() {
        const {
          strictMode: t,
          separateDialCode: e,
          allowDropdown: i,
          countrySearch: s,
        } = this.options;
        if (t || e) {
          const n = (n) => {
            if (
              n.key &&
              n.key.length === 1 &&
              !n.altKey &&
              !n.ctrlKey &&
              !n.metaKey
            ) {
              if (e && i && s && n.key === "+") {
                n.preventDefault();
                this._openDropdownWithPlus();
                return;
              }
              if (t) {
                const t = this._getTelInputValue();
                const i = t.startsWith("+");
                const s =
                  !i && this.ui.telInput.selectionStart === 0 && n.key === "+";
                const o = this._normaliseNumerals(n.key);
                const r = /^[0-9]$/.test(o);
                const a = e ? r : s || r;
                const l = this.ui.telInput;
                const u = l.selectionStart;
                const d = l.selectionEnd;
                const c = t.slice(0, u);
                const h = t.slice(d);
                const p = c + n.key + h;
                const m = this._getFullNumber(p);
                const C = at.utils.getCoreNumber(
                  m,
                  this.selectedCountryData.iso2,
                );
                const g =
                  this.maxCoreNumberLength &&
                  C.length > this.maxCoreNumberLength;
                const y = this._getNewCountryFromNumber(m);
                const _ = y !== null;
                (a && (!g || _ || s)) || n.preventDefault();
              }
            }
          };
          this.ui.telInput.addEventListener("keydown", n, {
            signal: this.abortController.signal,
          });
        }
      }
      _maybeBindPasteListener() {
        if (this.options.strictMode) {
          const t = (t) => {
            t.preventDefault();
            const e = this.ui.telInput;
            const i = e.selectionStart;
            const s = e.selectionEnd;
            const n = this._getTelInputValue();
            const o = n.slice(0, i);
            const r = n.slice(s);
            const a = this.selectedCountryData.iso2;
            const l = t.clipboardData.getData("text");
            const u = this._normaliseNumerals(l);
            const d = i === 0 && s > 0;
            const c = !n.startsWith("+") || d;
            const h = u.replace(b.NON_PLUS_NUMERIC_GLOBAL, "");
            const p = h.startsWith("+");
            const m = h.replace(/\+/g, "");
            const C = p && c ? `+${m}` : m;
            let g = o + C + r;
            if (g.length > 5) {
              let t = at.utils.getCoreNumber(g, a);
              while (t.length === 0 && g.length > 0) {
                g = g.slice(0, -1);
                t = at.utils.getCoreNumber(g, a);
              }
              if (!t) return;
              if (
                this.maxCoreNumberLength &&
                t.length > this.maxCoreNumberLength
              ) {
                if (e.selectionEnd !== n.length) return;
                {
                  const e = t.length - this.maxCoreNumberLength;
                  g = g.slice(0, g.length - e);
                }
              }
            }
            this._setTelInputValue(g);
            const y = i + C.length;
            e.setSelectionRange(y, y);
            e.dispatchEvent(new InputEvent("input", { bubbles: true }));
          };
          this.ui.telInput.addEventListener("paste", t, {
            signal: this.abortController.signal,
          });
        }
      }
      _cap(t) {
        const e = Number(this.ui.telInput.getAttribute("maxlength"));
        return e && t.length > e ? t.substring(0, e) : t;
      }
      _trigger(t, e = {}) {
        const i = new CustomEvent(t, {
          bubbles: true,
          cancelable: true,
          detail: e,
        });
        this.ui.telInput.dispatchEvent(i);
      }
      _openDropdown() {
        const { fixDropdownWidth: t, countrySearch: e } = this.options;
        this.dropdownAbortController = new AbortController();
        t &&
          (this.ui.dropdownContent.style.width = `${this.ui.telInput.offsetWidth}px`);
        this.ui.dropdownContent.classList.remove(_.HIDE);
        this.ui.selectedCountry.setAttribute(P.EXPANDED, "true");
        this._setDropdownPosition();
        if (e) {
          const t = this.ui.countryList.firstElementChild;
          if (t) {
            this.ui.highlightListItem(t, false);
            this.ui.countryList.scrollTop = 0;
          }
          this.ui.searchInput.focus();
        }
        this._bindDropdownListeners();
        this.ui.dropdownArrow.classList.add(_.ARROW_UP);
        this._trigger(y.OPEN_COUNTRY_DROPDOWN);
      }
      _setDropdownPosition() {
        this.options.dropdownContainer &&
          this.options.dropdownContainer.appendChild(this.ui.dropdown);
        if (!this.options.useFullscreenPopup) {
          const t = this.ui.telInput.getBoundingClientRect();
          const e = this.ui.telInput.offsetHeight;
          if (this.options.dropdownContainer) {
            this.ui.dropdown.style.top = `${t.top + e}px`;
            this.ui.dropdown.style.left = `${t.left}px`;
            const i = () => this._closeDropdown();
            window.addEventListener("scroll", i, {
              signal: this.dropdownAbortController.signal,
            });
          }
        }
      }
      _bindDropdownListeners() {
        const t = this.dropdownAbortController.signal;
        this._bindDropdownMouseoverListener(t);
        this._bindDropdownCountryClickListener(t);
        this._bindDropdownClickOffListener(t);
        this._bindDropdownKeydownListener(t);
        this.options.countrySearch && this._bindDropdownSearchListeners(t);
      }
      _bindDropdownMouseoverListener(t) {
        const e = (t) => {
          const e = t.target?.closest(`.${_.COUNTRY_ITEM}`);
          e && this.ui.highlightListItem(e, false);
        };
        this.ui.countryList.addEventListener("mouseover", e, { signal: t });
      }
      _bindDropdownCountryClickListener(t) {
        const e = (t) => {
          const e = t.target?.closest(`.${_.COUNTRY_ITEM}`);
          e && this._selectListItem(e);
        };
        this.ui.countryList.addEventListener("click", e, { signal: t });
      }
      _bindDropdownClickOffListener(t) {
        const e = (t) => {
          const e = t.target;
          const i = !!e.closest(`#iti-${this.id}__dropdown-content`);
          i || this._closeDropdown();
        };
        setTimeout(() => {
          document.documentElement.addEventListener("click", e, { signal: t });
        }, 0);
      }
      _bindDropdownKeydownListener(t) {
        let e = "";
        let i = null;
        const s = (t) => {
          const s = [f.ARROW_UP, f.ARROW_DOWN, f.ENTER, f.ESC];
          if (s.includes(t.key)) {
            t.preventDefault();
            t.stopPropagation();
            if (t.key === f.ARROW_UP || t.key === f.ARROW_DOWN)
              this._handleUpDownKey(t.key);
            else if (t.key === f.ENTER) this._handleEnterKey();
            else if (t.key === f.ESC) {
              this._closeDropdown();
              this.ui.selectedCountry.focus();
            }
          }
          if (!this.options.countrySearch && b.HIDDEN_SEARCH_CHAR.test(t.key)) {
            t.stopPropagation();
            i && clearTimeout(i);
            e += t.key.toLowerCase();
            this._searchForCountry(e);
            i = setTimeout(() => {
              e = "";
            }, N.HIDDEN_SEARCH_RESET_MS);
          }
        };
        document.addEventListener("keydown", s, { signal: t });
      }
      _bindDropdownSearchListeners(t) {
        const e = () => {
          const t = this.ui.searchInput.value.trim();
          this._filterCountriesByQuery(t);
          this.ui.searchInput.value
            ? this.ui.searchClearButton.classList.remove(_.HIDE)
            : this.ui.searchClearButton.classList.add(_.HIDE);
        };
        let i = null;
        const s = () => {
          i && clearTimeout(i);
          i = setTimeout(() => {
            e();
            i = null;
          }, 100);
        };
        this.ui.searchInput.addEventListener("input", s, { signal: t });
        const n = () => {
          this.ui.searchInput.value = "";
          this.ui.searchInput.focus();
          e();
        };
        this.ui.searchClearButton.addEventListener("click", n, { signal: t });
      }
      _searchForCountry(t) {
        const e = H(this.countries, t);
        if (e) {
          const t = e.nodeById[this.id];
          this.ui.highlightListItem(t, false);
          this.ui.scrollTo(t);
        }
      }
      _filterCountriesByQuery(t) {
        let e;
        e = t === "" ? this.countries : B(this.countries, t);
        this.ui.filterCountries(e);
      }
      _handleUpDownKey(t) {
        let e =
          t === f.ARROW_UP
            ? this.ui.highlightedItem?.previousElementSibling
            : this.ui.highlightedItem?.nextElementSibling;
        !e &&
          this.ui.countryList.childElementCount > 1 &&
          (e =
            t === f.ARROW_UP
              ? this.ui.countryList.lastElementChild
              : this.ui.countryList.firstElementChild);
        if (e) {
          this.ui.scrollTo(e);
          this.ui.highlightListItem(e, false);
        }
      }
      _handleEnterKey() {
        this.ui.highlightedItem &&
          this._selectListItem(this.ui.highlightedItem);
      }
      _updateValFromNumber(t) {
        let e = t;
        if (
          this.options.formatOnDisplay &&
          at.utils &&
          this.selectedCountryData
        ) {
          const t =
            this.options.nationalMode ||
            (!e.startsWith("+") && !this.options.separateDialCode);
          const { NATIONAL: i, INTERNATIONAL: s } = at.utils.numberFormat;
          const n = t ? i : s;
          e = at.utils.formatNumber(e, this.selectedCountryData.iso2, n);
        }
        e = this._beforeSetNumber(e);
        this._setTelInputValue(e);
      }
      _updateCountryFromNumber(t) {
        const e = this._getNewCountryFromNumber(t);
        return e !== null && this._setCountry(e);
      }
      _ensureHasDialCode(t) {
        const { dialCode: e, nationalPrefix: i } = this.selectedCountryData;
        const s = t.startsWith("+");
        if (s || !e) return t;
        const n = i && t.startsWith(i) && !this.options.separateDialCode;
        const o = n ? t.substring(1) : t;
        return `+${e}${o}`;
      }
      _getNewCountryFromNumber(t) {
        const e = t.indexOf("+");
        let i = e ? t.substring(e) : t;
        const s = this.selectedCountryData.iso2;
        const n = this.selectedCountryData.dialCode;
        i = this._ensureHasDialCode(i);
        const o = this._getDialCode(i, true);
        const r = U(i);
        if (o) {
          const t = U(o);
          const e = this.dialCodeToIso2Map[t];
          if (e.length === 1) return e[0] === s ? null : e[0];
          if (!s && this.defaultCountry && e.includes(this.defaultCountry))
            return this.defaultCountry;
          const i = n === w.NANP && tt(r);
          if (i) return null;
          const { areaCodes: a, priority: l } = this.selectedCountryData;
          if (a) {
            const t = a.map((t) => `${n}${t}`);
            for (const e of t) if (r.startsWith(e)) return null;
          }
          const u = l === 0;
          const d = a && !u && r.length > t.length;
          const c = s && e.includes(s) && !d;
          const h = s === e[0];
          if (!c && !h) return e[0];
        } else {
          if (i.startsWith("+") && r.length) {
            const t = this.selectedCountryData.dialCode || "";
            return t && t.startsWith(r) ? null : "";
          }
          if ((!i || i === "+") && !s) return this.defaultCountry;
        }
        return null;
      }
      _setCountry(t) {
        const {
          separateDialCode: e,
          showFlags: i,
          i18n: s,
          allowDropdown: n,
        } = this.options;
        const o = this.selectedCountryData.iso2 || "";
        n && this.ui.updateSelectedItem(t);
        this.selectedCountryData = t ? this.countryByIso2.get(t) : {};
        this.selectedCountryData.iso2 &&
          (this.defaultCountry = this.selectedCountryData.iso2);
        if (this.ui.selectedCountry) {
          const e = t && i ? `${_.FLAG} iti__${t}` : `${_.FLAG} ${_.GLOBE}`;
          let n, o;
          if (t) {
            const { name: t, dialCode: e } = this.selectedCountryData;
            o = t;
            n = s.selectedCountryAriaLabel
              .replace("${countryName}", t)
              .replace("${dialCode}", `+${e}`);
          } else {
            o = s.noCountrySelected;
            n = s.noCountrySelected;
          }
          this.ui.selectedCountryInner.className = e;
          this.ui.selectedCountry.setAttribute("title", o);
          this.ui.selectedCountry.setAttribute(P.LABEL, n);
        }
        if (e) {
          const t = this.selectedCountryData.dialCode
            ? `+${this.selectedCountryData.dialCode}`
            : "";
          this.ui.selectedDialCode.textContent = t;
          this.ui.updateInputPadding();
        }
        this._updatePlaceholder();
        this._updateMaxLength();
        return o !== t;
      }
      _updateMaxLength() {
        const {
          strictMode: t,
          placeholderNumberType: e,
          validationNumberTypes: i,
        } = this.options;
        const { iso2: s } = this.selectedCountryData;
        if (t && at.utils)
          if (s) {
            const t = at.utils.numberType[e];
            let n = at.utils.getExampleNumber(s, false, t, true);
            let o = n;
            while (at.utils.isPossibleNumber(n, s, i)) {
              o = n;
              n += "0";
            }
            const r = at.utils.getCoreNumber(o, s);
            this.maxCoreNumberLength = r.length;
            s === "by" && (this.maxCoreNumberLength = r.length + 1);
          } else this.maxCoreNumberLength = null;
      }
      _updatePlaceholder() {
        const {
          autoPlaceholder: t,
          placeholderNumberType: e,
          nationalMode: i,
          customPlaceholder: s,
        } = this.options;
        const n =
          t === A.AGGRESSIVE ||
          (!this.ui.hadInitialPlaceholder && t === A.POLITE);
        if (at.utils && n) {
          const t = at.utils.numberType[e];
          let n = this.selectedCountryData.iso2
            ? at.utils.getExampleNumber(this.selectedCountryData.iso2, i, t)
            : "";
          n = this._beforeSetNumber(n);
          typeof s === "function" && (n = s(n, this.selectedCountryData));
          this.ui.telInput.setAttribute("placeholder", n);
        }
      }
      _selectListItem(t) {
        const e = t.dataset[S.COUNTRY_CODE];
        const i = this._setCountry(e);
        this._closeDropdown();
        const s = t.dataset[S.DIAL_CODE];
        this._updateDialCode(s);
        if (this.options.formatOnDisplay) {
          const t = this._getTelInputValue();
          this._updateValFromNumber(t);
        }
        this.ui.telInput.focus();
        i && this._triggerCountryChange();
      }
      _closeDropdown() {
        if (!this.ui.dropdownContent.classList.contains(_.HIDE)) {
          this.ui.dropdownContent.classList.add(_.HIDE);
          this.ui.selectedCountry.setAttribute(P.EXPANDED, "false");
          if (this.options.countrySearch) {
            this.ui.searchInput.removeAttribute(P.ACTIVE_DESCENDANT);
            if (this.ui.highlightedItem) {
              this.ui.highlightedItem.classList.remove(_.HIGHLIGHT);
              this.ui.highlightedItem = null;
            }
          }
          this.ui.dropdownArrow.classList.remove(_.ARROW_UP);
          this.dropdownAbortController.abort();
          this.dropdownAbortController = null;
          this.options.dropdownContainer && this.ui.dropdown.remove();
          this._trigger(y.CLOSE_COUNTRY_DROPDOWN);
        }
      }
      _updateDialCode(t) {
        const e = this._getTelInputValue();
        const i = `+${t}`;
        let s;
        if (e.startsWith("+")) {
          const t = this._getDialCode(e);
          s = t ? e.replace(t, i) : i;
          this._setTelInputValue(s);
        }
      }
      _getDialCode(t, e) {
        let i = "";
        if (t.startsWith("+")) {
          let s = "";
          let n = false;
          for (let o = 0; o < t.length; o++) {
            const r = t.charAt(o);
            if (/[0-9]/.test(r)) {
              s += r;
              const a = Boolean(this.dialCodeToIso2Map[s]);
              if (!a) break;
              if (this.dialCodes.has(s)) {
                i = t.substring(0, o + 1);
                n = true;
                if (!e) break;
              } else e && n && (i = t.substring(0, o + 1));
              if (s.length === this.dialCodeMaxLen) break;
            }
          }
        }
        return i;
      }
      _getFullNumber(t) {
        const e = t ? this._normaliseNumerals(t) : this._getTelInputValue();
        const { dialCode: i } = this.selectedCountryData;
        let s;
        const n = U(e);
        s =
          this.options.separateDialCode && !e.startsWith("+") && i && n
            ? `+${i}`
            : "";
        return s + e;
      }
      _beforeSetNumber(t) {
        const e = this._getDialCode(t);
        const i = X(
          t,
          e,
          this.options.separateDialCode,
          this.selectedCountryData,
        );
        return this._cap(i);
      }
      _triggerCountryChange() {
        this._trigger(y.COUNTRY_CHANGE);
      }
      handleAutoCountry() {
        if (this.options.initialCountry === T.AUTO && at.autoCountry) {
          this.defaultCountry = at.autoCountry;
          const t =
            this.selectedCountryData.iso2 ||
            this.ui.selectedCountryInner.classList.contains(_.GLOBE);
          t || this.setCountry(this.defaultCountry);
          this.resolveAutoCountryPromise();
        }
      }
      handleUtils() {
        if (at.utils) {
          const t = this._getTelInputValue();
          t && this._updateValFromNumber(t);
          if (this.selectedCountryData.iso2) {
            this._updatePlaceholder();
            this._updateMaxLength();
          }
        }
        this.resolveUtilsScriptPromise();
      }
      destroy() {
        if (this.ui.telInput) {
          this.options.allowDropdown && this._closeDropdown();
          this.abortController.abort();
          this.abortController = null;
          this.ui.destroy();
          at.instances instanceof Map
            ? at.instances.delete(this.id)
            : delete at.instances[this.id];
        }
      }
      getExtension() {
        return at.utils
          ? at.utils.getExtension(
              this._getFullNumber(),
              this.selectedCountryData.iso2,
            )
          : "";
      }
      getNumber(t) {
        if (at.utils) {
          const { iso2: e } = this.selectedCountryData;
          const i = this._getFullNumber();
          const s = at.utils.formatNumber(i, e, t);
          return this._mapAsciiToUserNumerals(s);
        }
        return "";
      }
      getNumberType() {
        return at.utils
          ? at.utils.getNumberType(
              this._getFullNumber(),
              this.selectedCountryData.iso2,
            )
          : D.UNKNOWN_NUMBER_TYPE;
      }
      getSelectedCountryData() {
        return this.selectedCountryData;
      }
      getValidationError() {
        if (at.utils) {
          const { iso2: t } = this.selectedCountryData;
          return at.utils.getValidationError(this._getFullNumber(), t);
        }
        return D.UNKNOWN_VALIDATION_ERROR;
      }
      isValidNumber() {
        const { dialCode: t, iso2: e } = this.selectedCountryData;
        if (t === E.DIAL_CODE && at.utils) {
          const t = this._getFullNumber();
          const i = at.utils.getCoreNumber(t, e);
          if (i[0] === E.MOBILE_PREFIX && i.length !== E.MOBILE_CORE_LENGTH)
            return false;
        }
        return this._validateNumber(false);
      }
      isValidNumberPrecise() {
        return this._validateNumber(true);
      }
      _utilsIsPossibleNumber(t) {
        return at.utils
          ? at.utils.isPossibleNumber(
              t,
              this.selectedCountryData.iso2,
              this.options.validationNumberTypes,
            )
          : null;
      }
      _validateNumber(t) {
        if (!at.utils) return null;
        if (!this.selectedCountryData.iso2) return false;
        const e = (e) =>
          t ? this._utilsIsValidNumber(e) : this._utilsIsPossibleNumber(e);
        const i = this._getFullNumber();
        const s = i.search(b.ALPHA_UNICODE);
        const n = s > -1;
        if (n && !this.options.allowPhonewords) {
          const t = i.substring(0, s);
          const n = e(t);
          const o = e(i);
          return n && o;
        }
        return e(i);
      }
      _utilsIsValidNumber(t) {
        return at.utils
          ? at.utils.isValidNumber(
              t,
              this.selectedCountryData.iso2,
              this.options.validationNumberTypes,
            )
          : null;
      }
      setCountry(t) {
        const e = t?.toLowerCase();
        if (!st(e)) throw new Error(`Invalid country code: '${e}'`);
        const i = this.selectedCountryData.iso2;
        const s = (t && e !== i) || (!t && i);
        if (s) {
          this._setCountry(e);
          this._updateDialCode(this.selectedCountryData.dialCode);
          if (this.options.formatOnDisplay) {
            const t = this._getTelInputValue();
            this._updateValFromNumber(t);
          }
          this._triggerCountryChange();
        }
      }
      setNumber(t) {
        const e = this._normaliseNumerals(t);
        const i = this._updateCountryFromNumber(e);
        this._updateValFromNumber(e);
        i && this._triggerCountryChange();
        this._trigger(y.INPUT, { isSetNumber: true });
      }
      setPlaceholderNumberType(t) {
        this.options.placeholderNumberType = t;
        this._updatePlaceholder();
      }
      setDisabled(t) {
        this.ui.telInput.disabled = t;
        t
          ? this.ui.selectedCountry.setAttribute("disabled", "true")
          : this.ui.selectedCountry.removeAttribute("disabled");
      }
    };
    var ot = (t) => {
      if (!at.utils && !at.startedLoadingUtilsScript) {
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
        at.startedLoadingUtilsScript = true;
        return e
          .then((t) => {
            const e = t?.default;
            if (!e || typeof e !== "object")
              throw new TypeError(
                "The loader function passed to attachUtils did not resolve to a module object with utils as its default export.",
              );
            at.utils = e;
            rt("handleUtils");
            return true;
          })
          .catch((t) => {
            rt("rejectUtilsScriptPromise", t);
            throw t;
          });
      }
      return null;
    };
    var rt = (t, ...e) => {
      Object.values(at.instances).forEach((i) => {
        const s = i[t];
        typeof s === "function" && s.apply(i, e);
      });
    };
    var at = Object.assign(
      (t, e) => {
        const i = new nt(t, e);
        at.instances[i.id] = i;
        t.iti = i;
        return i;
      },
      {
        defaults: k,
        documentReady: () => document.readyState === "complete",
        getCountryData: () => d,
        getInstance: (t) => {
          const e = t.dataset.intlTelInputId;
          return e ? at.instances[e] : null;
        },
        instances: {},
        attachUtils: ot,
        startedLoadingUtilsScript: false,
        startedLoadingAutoCountry: false,
        version: "25.14.1",
      },
    );
    var lt = at;
    return r(a);
  })();
  return t.default;
});
var e = t;
export { e as default };
