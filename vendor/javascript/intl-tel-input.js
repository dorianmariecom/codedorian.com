var t = {};
(function (e) {
  t ? (t = e()) : (window.intlTelInput = e());
})(() => {
  var t = (() => {
    var t = Object.defineProperty;
    var e = Object.getOwnPropertyDescriptor;
    var i = Object.getOwnPropertyNames;
    var s = Object.prototype.hasOwnProperty;
    var __export = (e, i) => {
      for (var s in i) t(e, s, { get: i[s], enumerable: true });
    };
    var __copyProps = (n, o, a, r) => {
      if ((o && typeof o === "object") || typeof o === "function")
        for (let l of i(o))
          s.call(n, l) ||
            l === a ||
            t(n, l, {
              get: () => o[l],
              enumerable: !(r = e(o, l)) || r.enumerable,
            });
      return n;
    };
    var __toCommonJS = (e) =>
      __copyProps(t({}, "__esModule", { value: true }), e);
    var n = {};
    __export(n, { Iti: () => m, default: () => C });
    var o = [
      ["af", "93"],
      ["al", "355"],
      ["dz", "213"],
      ["as", "1", 5, ["684"]],
      ["ad", "376"],
      ["ao", "244"],
      ["ai", "1", 6, ["264"]],
      ["ag", "1", 7, ["268"]],
      ["ar", "54"],
      ["am", "374"],
      ["aw", "297"],
      ["ac", "247"],
      ["au", "61", 0],
      ["at", "43"],
      ["az", "994"],
      ["bs", "1", 8, ["242"]],
      ["bh", "973"],
      ["bd", "880"],
      ["bb", "1", 9, ["246"]],
      ["by", "375"],
      ["be", "32"],
      ["bz", "501"],
      ["bj", "229"],
      ["bm", "1", 10, ["441"]],
      ["bt", "975"],
      ["bo", "591"],
      ["ba", "387"],
      ["bw", "267"],
      ["br", "55"],
      ["io", "246"],
      ["vg", "1", 11, ["284"]],
      ["bn", "673"],
      ["bg", "359"],
      ["bf", "226"],
      ["bi", "257"],
      ["kh", "855"],
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
          "263",
          "289",
          "306",
          "343",
          "354",
          "365",
          "367",
          "368",
          "382",
          "387",
          "403",
          "416",
          "418",
          "428",
          "431",
          "437",
          "438",
          "450",
          "584",
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
        ],
      ],
      ["cv", "238"],
      ["bq", "599", 1, ["3", "4", "7"]],
      ["ky", "1", 12, ["345"]],
      ["cf", "236"],
      ["td", "235"],
      ["cl", "56"],
      ["cn", "86"],
      ["cx", "61", 2, ["89164"]],
      ["cc", "61", 1, ["89162"]],
      ["co", "57"],
      ["km", "269"],
      ["cg", "242"],
      ["cd", "243"],
      ["ck", "682"],
      ["cr", "506"],
      ["ci", "225"],
      ["hr", "385"],
      ["cu", "53"],
      ["cw", "599", 0],
      ["cy", "357"],
      ["cz", "420"],
      ["dk", "45"],
      ["dj", "253"],
      ["dm", "1", 13, ["767"]],
      ["do", "1", 2, ["809", "829", "849"]],
      ["ec", "593"],
      ["eg", "20"],
      ["sv", "503"],
      ["gq", "240"],
      ["er", "291"],
      ["ee", "372"],
      ["sz", "268"],
      ["et", "251"],
      ["fk", "500"],
      ["fo", "298"],
      ["fj", "679"],
      ["fi", "358", 0],
      ["fr", "33"],
      ["gf", "594"],
      ["pf", "689"],
      ["ga", "241"],
      ["gm", "220"],
      ["ge", "995"],
      ["de", "49"],
      ["gh", "233"],
      ["gi", "350"],
      ["gr", "30"],
      ["gl", "299"],
      ["gd", "1", 14, ["473"]],
      ["gp", "590", 0],
      ["gu", "1", 15, ["671"]],
      ["gt", "502"],
      ["gg", "44", 1, ["1481", "7781", "7839", "7911"]],
      ["gn", "224"],
      ["gw", "245"],
      ["gy", "592"],
      ["ht", "509"],
      ["hn", "504"],
      ["hk", "852"],
      ["hu", "36"],
      ["is", "354"],
      ["in", "91"],
      ["id", "62"],
      ["ir", "98"],
      ["iq", "964"],
      ["ie", "353"],
      ["im", "44", 2, ["1624", "74576", "7524", "7924", "7624"]],
      ["il", "972"],
      ["it", "39", 0],
      ["jm", "1", 4, ["876", "658"]],
      ["jp", "81"],
      ["je", "44", 3, ["1534", "7509", "7700", "7797", "7829", "7937"]],
      ["jo", "962"],
      ["kz", "7", 1, ["33", "7"]],
      ["ke", "254"],
      ["ki", "686"],
      ["xk", "383"],
      ["kw", "965"],
      ["kg", "996"],
      ["la", "856"],
      ["lv", "371"],
      ["lb", "961"],
      ["ls", "266"],
      ["lr", "231"],
      ["ly", "218"],
      ["li", "423"],
      ["lt", "370"],
      ["lu", "352"],
      ["mo", "853"],
      ["mg", "261"],
      ["mw", "265"],
      ["my", "60"],
      ["mv", "960"],
      ["ml", "223"],
      ["mt", "356"],
      ["mh", "692"],
      ["mq", "596"],
      ["mr", "222"],
      ["mu", "230"],
      ["yt", "262", 1, ["269", "639"]],
      ["mx", "52"],
      ["fm", "691"],
      ["md", "373"],
      ["mc", "377"],
      ["mn", "976"],
      ["me", "382"],
      ["ms", "1", 16, ["664"]],
      ["ma", "212", 0],
      ["mz", "258"],
      ["mm", "95"],
      ["na", "264"],
      ["nr", "674"],
      ["np", "977"],
      ["nl", "31"],
      ["nc", "687"],
      ["nz", "64"],
      ["ni", "505"],
      ["ne", "227"],
      ["ng", "234"],
      ["nu", "683"],
      ["nf", "672"],
      ["kp", "850"],
      ["mk", "389"],
      ["mp", "1", 17, ["670"]],
      ["no", "47", 0],
      ["om", "968"],
      ["pk", "92"],
      ["pw", "680"],
      ["ps", "970"],
      ["pa", "507"],
      ["pg", "675"],
      ["py", "595"],
      ["pe", "51"],
      ["ph", "63"],
      ["pl", "48"],
      ["pt", "351"],
      ["pr", "1", 3, ["787", "939"]],
      ["qa", "974"],
      ["re", "262", 0],
      ["ro", "40"],
      ["ru", "7", 0],
      ["rw", "250"],
      ["ws", "685"],
      ["sm", "378"],
      ["st", "239"],
      ["sa", "966"],
      ["sn", "221"],
      ["rs", "381"],
      ["sc", "248"],
      ["sl", "232"],
      ["sg", "65"],
      ["sx", "1", 21, ["721"]],
      ["sk", "421"],
      ["si", "386"],
      ["sb", "677"],
      ["so", "252"],
      ["za", "27"],
      ["kr", "82"],
      ["ss", "211"],
      ["es", "34"],
      ["lk", "94"],
      ["bl", "590", 1],
      ["sh", "290"],
      ["kn", "1", 18, ["869"]],
      ["lc", "1", 19, ["758"]],
      ["mf", "590", 2],
      ["pm", "508"],
      ["vc", "1", 20, ["784"]],
      ["sd", "249"],
      ["sr", "597"],
      ["sj", "47", 1, ["79"]],
      ["se", "46"],
      ["ch", "41"],
      ["sy", "963"],
      ["tw", "886"],
      ["tj", "992"],
      ["tz", "255"],
      ["th", "66"],
      ["tl", "670"],
      ["tg", "228"],
      ["tk", "690"],
      ["to", "676"],
      ["tt", "1", 22, ["868"]],
      ["tn", "216"],
      ["tr", "90"],
      ["tm", "993"],
      ["tc", "1", 23, ["649"]],
      ["tv", "688"],
      ["ug", "256"],
      ["ua", "380"],
      ["ae", "971"],
      ["gb", "44", 0],
      ["us", "1", 0],
      ["uy", "598"],
      ["vi", "1", 24, ["340"]],
      ["uz", "998"],
      ["vu", "678"],
      ["va", "39", 1, ["06698"]],
      ["ve", "58"],
      ["vn", "84"],
      ["wf", "681"],
      ["eh", "212", 1, ["5288", "5289"]],
      ["ye", "967"],
      ["zm", "260"],
      ["zw", "263"],
      ["ax", "358", 1, ["18"]],
    ];
    var a = [];
    for (let t = 0; t < o.length; t++) {
      const e = o[t];
      a[t] = {
        name: "",
        iso2: e[0],
        dialCode: e[1],
        priority: e[2] || 0,
        areaCodes: e[3] || null,
        nodeById: {},
      };
    }
    var r = a;
    var l = {
      ad: "Andorra",
      ae: "United Arab Emirates",
      af: "Afghanistan",
      ag: "Antigua & Barbuda",
      ai: "Anguilla",
      al: "Albania",
      am: "Armenia",
      ao: "Angola",
      aq: "Antarctica",
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
      bv: "Bouvet Island",
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
      gs: "South Georgia & South Sandwich Islands",
      gt: "Guatemala",
      gu: "Guam",
      gw: "Guinea-Bissau",
      gy: "Guyana",
      hk: "Hong Kong SAR China",
      hm: "Heard & McDonald Islands",
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
      pn: "Pitcairn Islands",
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
      tf: "French Southern Territories",
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
      um: "U.S. Outlying Islands",
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
    var d = {
      selectedCountryAriaLabel: "Selected country",
      noCountrySelected: "No country selected",
      countryListAriaLabel: "List of countries",
      searchPlaceholder: "Search",
      zeroSearchResults: "No results found",
      oneSearchResult: "1 result found",
      multipleSearchResults: "${count} results found",
      ac: "Ascension Island",
      xk: "Kosovo",
    };
    var u = { ...l, ...d };
    for (let t = 0; t < r.length; t++) r[t].name = u[r[t].iso2];
    var h = 0;
    var c = {
      allowDropdown: true,
      autoPlaceholder: "polite",
      containerClass: "",
      countryOrder: null,
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
      nationalMode: true,
      onlyCountries: [],
      placeholderNumberType: "MOBILE",
      showFlags: true,
      separateDialCode: false,
      strictMode: false,
      useFullscreenPopup:
        typeof navigator !== "undefined" &&
        typeof window !== "undefined" &&
        (/Android.+Mobile|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ) ||
          window.innerWidth <= 500),
      utilsScript: "",
      validationNumberType: "MOBILE",
    };
    var p = [
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
    var getNumeric = (t) => t.replace(/\D/g, "");
    var normaliseString = (t = "") =>
      t
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    var isRegionlessNanp = (t) => {
      const e = getNumeric(t);
      if (e.charAt(0) === "1") {
        const t = e.substr(1, 3);
        return p.indexOf(t) !== -1;
      }
      return false;
    };
    var translateCursorPosition = (t, e, i, s) => {
      if (i === 0 && !s) return 0;
      let n = 0;
      for (let i = 0; i < e.length; i++) {
        /[+0-9]/.test(e[i]) && n++;
        if (n === t && !s) return i + 1;
        if (s && n === t + 1) return i;
      }
      return e.length;
    };
    var createEl = (t, e, i) => {
      const s = document.createElement(t);
      e && Object.entries(e).forEach(([t, e]) => s.setAttribute(t, e));
      i && i.appendChild(s);
      return s;
    };
    var forEachInstance = (t) => {
      const { instances: e } = y;
      Object.values(e).forEach((e) => e[t]());
    };
    var m = class {
      constructor(t, e = {}) {
        this.id = h++;
        this.telInput = t;
        this.highlightedItem = null;
        this.options = Object.assign({}, c, e);
        this.hadInitialPlaceholder = Boolean(t.getAttribute("placeholder"));
      }
      _init() {
        this.options.useFullscreenPopup &&
          (this.options.fixDropdownWidth = false);
        if (this.options.separateDialCode) {
          this.options.allowDropdown = true;
          this.options.nationalMode = false;
        }
        this.options.showFlags ||
          this.options.separateDialCode ||
          (this.options.nationalMode = false);
        this.options.useFullscreenPopup &&
          !this.options.dropdownContainer &&
          (this.options.dropdownContainer = document.body);
        this.isAndroid =
          typeof navigator !== "undefined" &&
          /Android/i.test(navigator.userAgent);
        this.isRTL = !!this.telInput.closest("[dir=rtl]");
        this.options.i18n = { ...u, ...this.options.i18n };
        const t = new Promise((t, e) => {
          this.resolveAutoCountryPromise = t;
          this.rejectAutoCountryPromise = e;
        });
        const e = new Promise((t, e) => {
          this.resolveUtilsScriptPromise = t;
          this.rejectUtilsScriptPromise = e;
        });
        this.promise = Promise.all([t, e]);
        this.selectedCountryData = {};
        this._processCountryData();
        this._generateMarkup();
        this._setInitialState();
        this._initListeners();
        this._initRequests();
      }
      _processCountryData() {
        this._processAllCountries();
        this._processDialCodes();
        this._translateCountryNames();
        this.options.countryOrder &&
          (this.options.countryOrder = this.options.countryOrder.map((t) =>
            t.toLowerCase(),
          ));
        this._sortCountries();
      }
      _sortCountries() {
        this.countries.sort((t, e) => {
          const { countryOrder: i } = this.options;
          if (i) {
            const s = i.indexOf(t.iso2);
            const n = i.indexOf(e.iso2);
            const o = s > -1;
            const a = n > -1;
            if (o || a) return o && a ? s - n : o ? -1 : 1;
          }
          return t.name < e.name ? -1 : t.name > e.name ? 1 : 0;
        });
      }
      _addToDialCodeMap(t, e, i) {
        e.length > this.dialCodeMaxLen && (this.dialCodeMaxLen = e.length);
        this.dialCodeToIso2Map.hasOwnProperty(e) ||
          (this.dialCodeToIso2Map[e] = []);
        for (let i = 0; i < this.dialCodeToIso2Map[e].length; i++)
          if (this.dialCodeToIso2Map[e][i] === t) return;
        const s = i !== void 0 ? i : this.dialCodeToIso2Map[e].length;
        this.dialCodeToIso2Map[e][s] = t;
      }
      _processAllCountries() {
        const { onlyCountries: t, excludeCountries: e } = this.options;
        if (t.length) {
          const e = t.map((t) => t.toLowerCase());
          this.countries = r.filter((t) => e.indexOf(t.iso2) > -1);
        } else if (e.length) {
          const t = e.map((t) => t.toLowerCase());
          this.countries = r.filter((e) => t.indexOf(e.iso2) === -1);
        } else this.countries = r;
      }
      _translateCountryNames() {
        for (let t = 0; t < this.countries.length; t++) {
          const e = this.countries[t].iso2.toLowerCase();
          this.options.i18n.hasOwnProperty(e) &&
            (this.countries[t].name = this.options.i18n[e]);
        }
      }
      _processDialCodes() {
        this.dialCodes = {};
        this.dialCodeMaxLen = 0;
        this.dialCodeToIso2Map = {};
        for (let t = 0; t < this.countries.length; t++) {
          const e = this.countries[t];
          this.dialCodes[e.dialCode] || (this.dialCodes[e.dialCode] = true);
          this._addToDialCodeMap(e.iso2, e.dialCode, e.priority);
        }
        for (let t = 0; t < this.countries.length; t++) {
          const e = this.countries[t];
          if (e.areaCodes) {
            const t = this.dialCodeToIso2Map[e.dialCode][0];
            for (let i = 0; i < e.areaCodes.length; i++) {
              const s = e.areaCodes[i];
              for (let i = 1; i < s.length; i++) {
                const n = e.dialCode + s.substr(0, i);
                this._addToDialCodeMap(t, n);
                this._addToDialCodeMap(e.iso2, n);
              }
              this._addToDialCodeMap(e.iso2, e.dialCode + s);
            }
          }
        }
      }
      _generateMarkup() {
        this.telInput.classList.add("iti__tel-input");
        this.telInput.hasAttribute("autocomplete") ||
          (this.telInput.form &&
            this.telInput.form.hasAttribute("autocomplete")) ||
          this.telInput.setAttribute("autocomplete", "off");
        const {
          allowDropdown: t,
          separateDialCode: e,
          showFlags: i,
          containerClass: s,
          hiddenInput: n,
          dropdownContainer: o,
          fixDropdownWidth: a,
          useFullscreenPopup: r,
          i18n: l,
        } = this.options;
        let d = "iti";
        t && (d += " iti--allow-dropdown");
        i && (d += " iti--show-flags");
        s && (d += ` ${s}`);
        r || (d += " iti--inline-dropdown");
        const u = createEl("div", { class: d });
        this.telInput.parentNode?.insertBefore(u, this.telInput);
        if (t || i) {
          this.countryContainer = createEl(
            "div",
            { class: "iti__country-container" },
            u,
          );
          if (t) {
            this.selectedCountry = createEl(
              "button",
              {
                type: "button",
                class: "iti__selected-country",
                "aria-expanded": "false",
                "aria-label": this.options.i18n.selectedCountryAriaLabel,
                "aria-haspopup": "true",
                "aria-controls": `iti-${this.id}__dropdown-content`,
                role: "combobox",
              },
              this.countryContainer,
            );
            this.telInput.disabled
              ? this.selectedCountry.setAttribute("aria-disabled", "true")
              : this.selectedCountry.setAttribute("tabindex", "0");
          } else
            this.selectedCountry = createEl(
              "div",
              { class: "iti__selected-country" },
              this.countryContainer,
            );
          const i = createEl(
            "div",
            { class: "iti__selected-country-primary" },
            this.selectedCountry,
          );
          this.selectedCountryInner = createEl("div", null, i);
          this.selectedCountryA11yText = createEl(
            "span",
            { class: "iti__a11y-text" },
            this.selectedCountryInner,
          );
          t &&
            (this.dropdownArrow = createEl(
              "div",
              { class: "iti__arrow", "aria-hidden": "true" },
              i,
            ));
          e &&
            (this.selectedDialCode = createEl(
              "div",
              { class: "iti__selected-dial-code" },
              this.selectedCountry,
            ));
          if (t) {
            const t = a ? "" : "iti--flexible-dropdown-width";
            this.dropdownContent = createEl("div", {
              id: `iti-${this.id}__dropdown-content`,
              class: `iti__dropdown-content iti__hide ${t}`,
            });
            this.searchInput = createEl(
              "input",
              {
                type: "text",
                class: "iti__search-input",
                placeholder: l.searchPlaceholder,
                role: "combobox",
                "aria-expanded": "true",
                "aria-label": l.searchPlaceholder,
                "aria-controls": `iti-${this.id}__country-listbox`,
                "aria-autocomplete": "list",
                autocomplete: "off",
              },
              this.dropdownContent,
            );
            this.searchResultsA11yText = createEl(
              "span",
              { class: "iti__a11y-text" },
              this.dropdownContent,
            );
            this.countryList = createEl(
              "ul",
              {
                class: "iti__country-list",
                id: `iti-${this.id}__country-listbox`,
                role: "listbox",
                "aria-label": l.countryListAriaLabel,
              },
              this.dropdownContent,
            );
            this._appendListItems(this.countries, "iti__standard");
            this._updateSearchResultsText();
            if (o) {
              let t = "iti iti--container";
              t += r ? " iti--fullscreen-popup" : " iti--inline-dropdown";
              this.dropdown = createEl("div", { class: t });
              this.dropdown.appendChild(this.dropdownContent);
            } else this.countryContainer.appendChild(this.dropdownContent);
          }
        }
        u.appendChild(this.telInput);
        if (n) {
          const t = this.telInput.getAttribute("name") || "";
          const e = n(t);
          if (e.phone) {
            this.hiddenInput = createEl("input", {
              type: "hidden",
              name: e.phone,
            });
            u.appendChild(this.hiddenInput);
          }
          if (e.country) {
            this.hiddenInputCountry = createEl("input", {
              type: "hidden",
              name: e.country,
            });
            u.appendChild(this.hiddenInputCountry);
          }
        }
      }
      _appendListItems(t, e) {
        for (let i = 0; i < t.length; i++) {
          const s = t[i];
          const n = createEl(
            "li",
            {
              id: `iti-${this.id}__item-${s.iso2}`,
              class: `iti__country ${e}`,
              tabindex: "-1",
              role: "option",
              "data-dial-code": s.dialCode,
              "data-country-code": s.iso2,
              "aria-selected": "false",
            },
            this.countryList,
          );
          s.nodeById[this.id] = n;
          let o = "";
          this.options.showFlags &&
            (o += `<div class='iti__flag-box'><div class='iti__flag iti__${s.iso2}'></div></div>`);
          o += `<span class='iti__country-name'>${s.name}</span>`;
          o += `<span class='iti__dial-code'>+${s.dialCode}</span>`;
          n.insertAdjacentHTML("beforeend", o);
        }
      }
      _setInitialState(t = false) {
        const e = this.telInput.getAttribute("value");
        const i = this.telInput.value;
        const s = e && e.charAt(0) === "+" && (!i || i.charAt(0) !== "+");
        const n = s ? e : i;
        const o = this._getDialCode(n);
        const a = isRegionlessNanp(n);
        const { initialCountry: r, geoIpLookup: l } = this.options;
        const d = r === "auto" && l;
        if (o && !a) this._updateCountryFromNumber(n);
        else if (!d || t) {
          const t = r ? r.toLowerCase() : "";
          const e = t && this._getCountryData(t, true);
          e
            ? this._setCountry(t)
            : o && a
              ? this._setCountry("us")
              : this._setCountry();
        }
        n && this._updateValFromNumber(n);
      }
      _initListeners() {
        this._initTelInputListeners();
        this.options.allowDropdown && this._initDropdownListeners();
        (this.hiddenInput || this.hiddenInputCountry) &&
          this.telInput.form &&
          this._initHiddenInputListener();
      }
      _initHiddenInputListener() {
        this._handleHiddenInputSubmit = () => {
          this.hiddenInput && (this.hiddenInput.value = this.getNumber());
          this.hiddenInputCountry &&
            (this.hiddenInputCountry.value =
              this.getSelectedCountryData().iso2 || "");
        };
        this.telInput.form?.addEventListener(
          "submit",
          this._handleHiddenInputSubmit,
        );
      }
      _initDropdownListeners() {
        this._handleLabelClick = (t) => {
          this.dropdownContent.classList.contains("iti__hide")
            ? this.telInput.focus()
            : t.preventDefault();
        };
        const t = this.telInput.closest("label");
        t && t.addEventListener("click", this._handleLabelClick);
        this._handleClickSelectedCountry = () => {
          !this.dropdownContent.classList.contains("iti__hide") ||
            this.telInput.disabled ||
            this.telInput.readOnly ||
            this._openDropdown();
        };
        this.selectedCountry.addEventListener(
          "click",
          this._handleClickSelectedCountry,
        );
        this._handleCountryContainerKeydown = (t) => {
          const e = this.dropdownContent.classList.contains("iti__hide");
          if (e && ["ArrowUp", "ArrowDown", " ", "Enter"].includes(t.key)) {
            t.preventDefault();
            t.stopPropagation();
            this._openDropdown();
          }
          t.key === "Tab" && this._closeDropdown();
        };
        this.countryContainer.addEventListener(
          "keydown",
          this._handleCountryContainerKeydown,
        );
      }
      _initRequests() {
        const {
          utilsScript: t,
          initialCountry: e,
          geoIpLookup: i,
        } = this.options;
        t && !y.utils
          ? y.documentReady()
            ? y.loadUtils(t)
            : window.addEventListener("load", () => {
                y.loadUtils(t);
              })
          : this.resolveUtilsScriptPromise();
        const s = e === "auto" && i;
        s && !this.selectedCountryData.iso2
          ? this._loadAutoCountry()
          : this.resolveAutoCountryPromise();
      }
      _loadAutoCountry() {
        if (y.autoCountry) this.handleAutoCountry();
        else if (!y.startedLoadingAutoCountry) {
          y.startedLoadingAutoCountry = true;
          typeof this.options.geoIpLookup === "function" &&
            this.options.geoIpLookup(
              (t = "") => {
                const e = t.toLowerCase();
                const i = e && this._getCountryData(e, true);
                if (i) {
                  y.autoCountry = e;
                  setTimeout(() => forEachInstance("handleAutoCountry"));
                } else {
                  this._setInitialState(true);
                  forEachInstance("rejectAutoCountryPromise");
                }
              },
              () => {
                this._setInitialState(true);
                forEachInstance("rejectAutoCountryPromise");
              },
            );
        }
      }
      _initTelInputListeners() {
        const {
          strictMode: t,
          formatAsYouType: e,
          separateDialCode: i,
          formatOnDisplay: s,
        } = this.options;
        let n = false;
        const openDropdownWithPlus = () => {
          this._openDropdown();
          this.searchInput.value = "+";
          this._filterCountries("", true);
        };
        this._handleInputEvent = (o) => {
          if (this.isAndroid && o?.data === "+" && i) {
            const t = this.telInput.selectionStart || 0;
            const e = this.telInput.value.substring(0, t - 1);
            const i = this.telInput.value.substring(t);
            this.telInput.value = e + i;
            openDropdownWithPlus();
            return;
          }
          this._updateCountryFromNumber(this.telInput.value) &&
            this._triggerCountryChange();
          const a = o?.data && /[^+0-9]/.test(o.data);
          const r = o?.inputType === "insertFromPaste" && this.telInput.value;
          a || (r && !t)
            ? (n = true)
            : /[^+0-9]/.test(this.telInput.value) || (n = false);
          const l = o?.detail && o.detail.isSetNumber && !s;
          if (e && !n && !l) {
            const t = this.telInput.selectionStart || 0;
            const e = this.telInput.value.substring(0, t);
            const i = e.replace(/[^+0-9]/g, "").length;
            const s = o?.inputType === "deleteContentForward";
            const n = this._formatNumberAsYouType();
            const a = translateCursorPosition(i, n, t, s);
            this.telInput.value = n;
            this.telInput.setSelectionRange(a, a);
          }
        };
        this.telInput.addEventListener("input", this._handleInputEvent);
        if (t || i) {
          this._handleKeydownEvent = (e) => {
            if (
              e.key &&
              e.key.length === 1 &&
              !e.altKey &&
              !e.ctrlKey &&
              !e.metaKey
            ) {
              if (i && e.key === "+") {
                e.preventDefault();
                openDropdownWithPlus();
                return;
              }
              if (t) {
                const t = this.telInput.selectionStart === 0 && e.key === "+";
                const i = /^[0-9]$/.test(e.key);
                const s = t || i;
                const n = this._getFullNumber();
                const o = y.utils.getCoreNumber(
                  n,
                  this.selectedCountryData.iso2,
                );
                const a =
                  this.maxCoreNumberLength &&
                  o.length >= this.maxCoreNumberLength;
                const r = this.telInput.value.substring(
                  this.telInput.selectionStart,
                  this.telInput.selectionEnd,
                );
                const l = /\d/.test(r);
                (!s || (a && !l)) && e.preventDefault();
              }
            }
          };
          this.telInput.addEventListener("keydown", this._handleKeydownEvent);
        }
      }
      _cap(t) {
        const e = parseInt(this.telInput.getAttribute("maxlength") || "", 10);
        return e && t.length > e ? t.substr(0, e) : t;
      }
      _trigger(t, e = {}) {
        const i = new CustomEvent(t, {
          bubbles: true,
          cancelable: true,
          detail: e,
        });
        this.telInput.dispatchEvent(i);
      }
      _openDropdown() {
        const { fixDropdownWidth: t } = this.options;
        t &&
          (this.dropdownContent.style.width = `${this.telInput.offsetWidth}px`);
        this.dropdownContent.classList.remove("iti__hide");
        this.selectedCountry.setAttribute("aria-expanded", "true");
        this._setDropdownPosition();
        const e = this.countryList.firstElementChild;
        if (e) {
          this._highlightListItem(e, false);
          this.countryList.scrollTop = 0;
        }
        this.searchInput.focus();
        this._bindDropdownListeners();
        this.dropdownArrow.classList.add("iti__arrow--up");
        this._trigger("open:countrydropdown");
      }
      _setDropdownPosition() {
        this.options.dropdownContainer &&
          this.options.dropdownContainer.appendChild(this.dropdown);
        if (!this.options.useFullscreenPopup) {
          const t = this.telInput.getBoundingClientRect();
          const e = this.telInput.offsetHeight;
          if (this.options.dropdownContainer) {
            this.dropdown.style.top = `${t.top + e}px`;
            this.dropdown.style.left = `${t.left}px`;
            this._handleWindowScroll = () => this._closeDropdown();
            window.addEventListener("scroll", this._handleWindowScroll);
          }
        }
      }
      _bindDropdownListeners() {
        this._handleMouseoverCountryList = (t) => {
          const e = t.target?.closest(".iti__country");
          e && this._highlightListItem(e, false);
        };
        this.countryList.addEventListener(
          "mouseover",
          this._handleMouseoverCountryList,
        );
        this._handleClickCountryList = (t) => {
          const e = t.target?.closest(".iti__country");
          e && this._selectListItem(e);
        };
        this.countryList.addEventListener(
          "click",
          this._handleClickCountryList,
        );
        let t = true;
        this._handleClickOffToClose = () => {
          t || this._closeDropdown();
          t = false;
        };
        document.documentElement.addEventListener(
          "click",
          this._handleClickOffToClose,
        );
        this._handleKeydownOnDropdown = (t) => {
          if (["ArrowUp", "ArrowDown", "Enter", "Escape"].includes(t.key)) {
            t.preventDefault();
            t.stopPropagation();
            t.key === "ArrowUp" || t.key === "ArrowDown"
              ? this._handleUpDownKey(t.key)
              : t.key === "Enter"
                ? this._handleEnterKey()
                : t.key === "Escape" && this._closeDropdown();
          }
        };
        document.addEventListener("keydown", this._handleKeydownOnDropdown);
        const doFilter = () => {
          const t = this.searchInput.value.trim();
          t ? this._filterCountries(t) : this._filterCountries("", true);
        };
        let e = null;
        this._handleSearchChange = () => {
          e && clearTimeout(e);
          e = setTimeout(() => {
            doFilter();
            e = null;
          }, 100);
        };
        this.searchInput.addEventListener("input", this._handleSearchChange);
        this.searchInput.addEventListener("click", (t) => t.stopPropagation());
      }
      _filterCountries(t, e = false) {
        let i = true;
        this.countryList.innerHTML = "";
        const s = normaliseString(t);
        for (let t = 0; t < this.countries.length; t++) {
          const n = this.countries[t];
          const o = normaliseString(n.name);
          const a = `+${n.dialCode}`;
          if (e || o.includes(s) || a.includes(s) || n.iso2.includes(s)) {
            const t = n.nodeById[this.id];
            t && this.countryList.appendChild(t);
            if (i) {
              this._highlightListItem(t, false);
              i = false;
            }
          }
        }
        i && this._highlightListItem(null, false);
        this.countryList.scrollTop = 0;
        this._updateSearchResultsText();
      }
      _updateSearchResultsText() {
        const { i18n: t } = this.options;
        const e = this.countryList.childElementCount;
        let i;
        i =
          e === 0
            ? t.zeroSearchResults
            : e === 1
              ? t.oneSearchResult
              : t.multipleSearchResults.replace("${count}", e.toString());
        this.searchResultsA11yText.textContent = i;
      }
      _handleUpDownKey(t) {
        let e =
          t === "ArrowUp"
            ? this.highlightedItem?.previousElementSibling
            : this.highlightedItem?.nextElementSibling;
        !e &&
          this.countryList.childElementCount > 1 &&
          (e =
            t === "ArrowUp"
              ? this.countryList.lastElementChild
              : this.countryList.firstElementChild);
        if (e) {
          this._scrollTo(e);
          this._highlightListItem(e, false);
        }
      }
      _handleEnterKey() {
        this.highlightedItem && this._selectListItem(this.highlightedItem);
      }
      _updateValFromNumber(t) {
        let e = t;
        if (
          this.options.formatOnDisplay &&
          y.utils &&
          this.selectedCountryData
        ) {
          const t =
            this.options.nationalMode ||
            (e.charAt(0) !== "+" && !this.options.separateDialCode);
          const { NATIONAL: i, INTERNATIONAL: s } = y.utils.numberFormat;
          const n = t ? i : s;
          e = y.utils.formatNumber(e, this.selectedCountryData.iso2, n);
        }
        e = this._beforeSetNumber(e);
        this.telInput.value = e;
      }
      _updateCountryFromNumber(t) {
        const e = t.indexOf("+");
        let i = e ? t.substring(e) : t;
        const s = this.selectedCountryData.dialCode;
        const n = s === "1";
        if (i && n && i.charAt(0) !== "+") {
          i.charAt(0) !== "1" && (i = `1${i}`);
          i = `+${i}`;
        }
        this.options.separateDialCode &&
          s &&
          i.charAt(0) !== "+" &&
          (i = `+${s}${i}`);
        const o = this._getDialCode(i, true);
        const a = getNumeric(i);
        let r = null;
        if (o) {
          const t = this.dialCodeToIso2Map[getNumeric(o)];
          const e =
            t.indexOf(this.selectedCountryData.iso2) !== -1 &&
            a.length <= o.length - 1;
          const i = s === "1" && isRegionlessNanp(a);
          if (!i && !e)
            for (let e = 0; e < t.length; e++)
              if (t[e]) {
                r = t[e];
                break;
              }
        } else
          i.charAt(0) === "+" && a.length
            ? (r = "")
            : (i && i !== "+") ||
              this.selectedCountryData.iso2 ||
              (r = this.defaultCountry);
        return r !== null && this._setCountry(r);
      }
      _highlightListItem(t, e) {
        const i = this.highlightedItem;
        if (i) {
          i.classList.remove("iti__highlight");
          i.setAttribute("aria-selected", "false");
        }
        this.highlightedItem = t;
        if (this.highlightedItem) {
          this.highlightedItem.classList.add("iti__highlight");
          this.highlightedItem.setAttribute("aria-selected", "true");
          const t = this.highlightedItem.getAttribute("id") || "";
          this.selectedCountry.setAttribute("aria-activedescendant", t);
          this.searchInput.setAttribute("aria-activedescendant", t);
        }
        e && this.highlightedItem.focus();
      }
      _getCountryData(t, e) {
        for (let e = 0; e < this.countries.length; e++)
          if (this.countries[e].iso2 === t) return this.countries[e];
        if (e) return null;
        throw new Error(`No country data for '${t}'`);
      }
      _setCountry(t) {
        const { separateDialCode: e, showFlags: i, i18n: s } = this.options;
        const n = this.selectedCountryData.iso2 ? this.selectedCountryData : {};
        this.selectedCountryData = (t && this._getCountryData(t, false)) || {};
        this.selectedCountryData.iso2 &&
          (this.defaultCountry = this.selectedCountryData.iso2);
        if (this.selectedCountryInner) {
          let e = "";
          let n = "";
          if (t && i) {
            e = `iti__flag iti__${t}`;
            n = `${this.selectedCountryData.name} +${this.selectedCountryData.dialCode}`;
          } else {
            e = "iti__flag iti__globe";
            n = s.noCountrySelected;
          }
          this.selectedCountryInner.className = e;
          this.selectedCountryA11yText.textContent = n;
        }
        this._setSelectedCountryTitleAttribute(t, e);
        if (e) {
          const t = this.selectedCountryData.dialCode
            ? `+${this.selectedCountryData.dialCode}`
            : "";
          this.selectedDialCode.innerHTML = t;
          const e =
            this.selectedCountry.offsetWidth ||
            this._getHiddenSelectedCountryWidth();
          const i = e + 8;
          this.isRTL
            ? (this.telInput.style.paddingRight = `${i}px`)
            : (this.telInput.style.paddingLeft = `${i}px`);
        }
        this._updatePlaceholder();
        this._updateMaxLength();
        return n.iso2 !== t;
      }
      _updateMaxLength() {
        const {
          strictMode: t,
          placeholderNumberType: e,
          validationNumberType: i,
        } = this.options;
        if (t && y.utils)
          if (this.selectedCountryData.iso2) {
            const t = y.utils.numberType[e];
            let s = y.utils.getExampleNumber(
              this.selectedCountryData.iso2,
              false,
              t,
              true,
            );
            let n = s;
            while (
              y.utils.isPossibleNumber(s, this.selectedCountryData.iso2, i)
            ) {
              n = s;
              s += "0";
            }
            const o = y.utils.getCoreNumber(n, this.selectedCountryData.iso2);
            this.maxCoreNumberLength = o.length;
          } else this.maxCoreNumberLength = null;
      }
      _setSelectedCountryTitleAttribute(t = null, e) {
        if (!this.selectedCountry) return;
        let i;
        i =
          t && !e
            ? `${this.selectedCountryData.name}: +${this.selectedCountryData.dialCode}`
            : t
              ? this.selectedCountryData.name
              : "Unknown";
        this.selectedCountry.setAttribute("title", i);
      }
      _getHiddenSelectedCountryWidth() {
        if (this.telInput.parentNode) {
          const t = this.telInput.parentNode.cloneNode(false);
          t.style.visibility = "hidden";
          document.body.appendChild(t);
          const e = this.countryContainer.cloneNode();
          t.appendChild(e);
          const i = this.selectedCountry.cloneNode(true);
          e.appendChild(i);
          const s = i.offsetWidth;
          document.body.removeChild(t);
          return s;
        }
        return 0;
      }
      _updatePlaceholder() {
        const {
          autoPlaceholder: t,
          placeholderNumberType: e,
          nationalMode: i,
          customPlaceholder: s,
        } = this.options;
        const n =
          t === "aggressive" || (!this.hadInitialPlaceholder && t === "polite");
        if (y.utils && n) {
          const t = y.utils.numberType[e];
          let n = this.selectedCountryData.iso2
            ? y.utils.getExampleNumber(this.selectedCountryData.iso2, i, t)
            : "";
          n = this._beforeSetNumber(n);
          typeof s === "function" && (n = s(n, this.selectedCountryData));
          this.telInput.setAttribute("placeholder", n);
        }
      }
      _selectListItem(t) {
        const e = this._setCountry(t.getAttribute("data-country-code"));
        this._closeDropdown();
        this._updateDialCode(t.getAttribute("data-dial-code"));
        this.telInput.focus();
        e && this._triggerCountryChange();
      }
      _closeDropdown() {
        this.dropdownContent.classList.add("iti__hide");
        this.selectedCountry.setAttribute("aria-expanded", "false");
        this.selectedCountry.removeAttribute("aria-activedescendant");
        this.highlightedItem &&
          this.highlightedItem.setAttribute("aria-selected", "false");
        this.searchInput.removeAttribute("aria-activedescendant");
        this.dropdownArrow.classList.remove("iti__arrow--up");
        document.removeEventListener("keydown", this._handleKeydownOnDropdown);
        this.searchInput.removeEventListener("input", this._handleSearchChange);
        document.documentElement.removeEventListener(
          "click",
          this._handleClickOffToClose,
        );
        this.countryList.removeEventListener(
          "mouseover",
          this._handleMouseoverCountryList,
        );
        this.countryList.removeEventListener(
          "click",
          this._handleClickCountryList,
        );
        if (this.options.dropdownContainer) {
          this.options.useFullscreenPopup ||
            window.removeEventListener("scroll", this._handleWindowScroll);
          this.dropdown.parentNode &&
            this.dropdown.parentNode.removeChild(this.dropdown);
        }
        this._trigger("close:countrydropdown");
      }
      _scrollTo(t) {
        const e = this.countryList;
        const i = document.documentElement.scrollTop;
        const s = e.offsetHeight;
        const n = e.getBoundingClientRect().top + i;
        const o = n + s;
        const a = t.offsetHeight;
        const r = t.getBoundingClientRect().top + i;
        const l = r + a;
        const d = r - n + e.scrollTop;
        if (r < n) e.scrollTop = d;
        else if (l > o) {
          const t = s - a;
          e.scrollTop = d - t;
        }
      }
      _updateDialCode(t) {
        const e = this.telInput.value;
        const i = `+${t}`;
        let s;
        if (e.charAt(0) === "+") {
          const t = this._getDialCode(e);
          s = t ? e.replace(t, i) : i;
          this.telInput.value = s;
        }
      }
      _getDialCode(t, e) {
        let i = "";
        if (t.charAt(0) === "+") {
          let s = "";
          for (let n = 0; n < t.length; n++) {
            const o = t.charAt(n);
            if (!isNaN(parseInt(o, 10))) {
              s += o;
              if (e) this.dialCodeToIso2Map[s] && (i = t.substr(0, n + 1));
              else if (this.dialCodes[s]) {
                i = t.substr(0, n + 1);
                break;
              }
              if (s.length === this.dialCodeMaxLen) break;
            }
          }
        }
        return i;
      }
      _getFullNumber() {
        const t = this.telInput.value.trim();
        const { dialCode: e } = this.selectedCountryData;
        let i;
        const s = getNumeric(t);
        i =
          this.options.separateDialCode && t.charAt(0) !== "+" && e && s
            ? `+${e}`
            : "";
        return i + t;
      }
      _beforeSetNumber(t) {
        let e = t;
        if (this.options.separateDialCode) {
          let t = this._getDialCode(e);
          if (t) {
            t = `+${this.selectedCountryData.dialCode}`;
            const i =
              e[t.length] === " " || e[t.length] === "-"
                ? t.length + 1
                : t.length;
            e = e.substr(i);
          }
        }
        return this._cap(e);
      }
      _triggerCountryChange() {
        this._trigger("countrychange");
      }
      _formatNumberAsYouType() {
        const t = this._getFullNumber();
        const e = y.utils
          ? y.utils.formatNumberAsYouType(t, this.selectedCountryData.iso2)
          : t;
        const { dialCode: i } = this.selectedCountryData;
        if (
          this.options.separateDialCode &&
          this.telInput.value.charAt(0) !== "+" &&
          e.includes(`+${i}`)
        ) {
          const t = e.split(`+${i}`)[1] || "";
          return t.trim();
        }
        return e;
      }
      handleAutoCountry() {
        if (this.options.initialCountry === "auto" && y.autoCountry) {
          this.defaultCountry = y.autoCountry;
          const t =
            this.selectedCountryData.iso2 ||
            this.selectedCountryInner.classList.contains("iti__globe");
          t || this.setCountry(this.defaultCountry);
          this.resolveAutoCountryPromise();
        }
      }
      handleUtils() {
        if (y.utils) {
          this.telInput.value && this._updateValFromNumber(this.telInput.value);
          if (this.selectedCountryData.iso2) {
            this._updatePlaceholder();
            this._updateMaxLength();
          }
        }
        this.resolveUtilsScriptPromise();
      }
      destroy() {
        if (this.options.allowDropdown) {
          this._closeDropdown();
          this.selectedCountry.removeEventListener(
            "click",
            this._handleClickSelectedCountry,
          );
          this.countryContainer.removeEventListener(
            "keydown",
            this._handleCountryContainerKeydown,
          );
          const t = this.telInput.closest("label");
          t && t.removeEventListener("click", this._handleLabelClick);
        }
        const { form: t } = this.telInput;
        this._handleHiddenInputSubmit &&
          t &&
          t.removeEventListener("submit", this._handleHiddenInputSubmit);
        this.telInput.removeEventListener("input", this._handleInputEvent);
        this._handleKeydownEvent &&
          this.telInput.removeEventListener(
            "keydown",
            this._handleKeydownEvent,
          );
        this.telInput.removeAttribute("data-intl-tel-input-id");
        const e = this.telInput.parentNode;
        e?.parentNode?.insertBefore(this.telInput, e);
        e?.parentNode?.removeChild(e);
        delete y.instances[this.id];
      }
      getExtension() {
        return y.utils
          ? y.utils.getExtension(
              this._getFullNumber(),
              this.selectedCountryData.iso2,
            )
          : "";
      }
      getNumber(t) {
        if (y.utils) {
          const { iso2: e } = this.selectedCountryData;
          return y.utils.formatNumber(this._getFullNumber(), e, t);
        }
        return "";
      }
      getNumberType() {
        return y.utils
          ? y.utils.getNumberType(
              this._getFullNumber(),
              this.selectedCountryData.iso2,
            )
          : -99;
      }
      getSelectedCountryData() {
        return this.selectedCountryData;
      }
      getValidationError() {
        if (y.utils) {
          const { iso2: t } = this.selectedCountryData;
          return y.utils.getValidationError(this._getFullNumber(), t);
        }
        return -99;
      }
      isValidNumber() {
        const t = this._getFullNumber();
        return (
          !/\p{L}/u.test(t) &&
          (y.utils
            ? y.utils.isPossibleNumber(
                t,
                this.selectedCountryData.iso2,
                this.options.validationNumberType,
              )
            : null)
        );
      }
      isValidNumberPrecise() {
        const t = this._getFullNumber();
        return (
          !/\p{L}/u.test(t) &&
          (y.utils
            ? y.utils.isValidNumber(t, this.selectedCountryData.iso2)
            : null)
        );
      }
      setCountry(t) {
        const e = t?.toLowerCase();
        const i = this.selectedCountryData.iso2;
        const s = (t && e !== i) || (!t && i);
        if (s) {
          this._setCountry(e);
          this._updateDialCode(this.selectedCountryData.dialCode);
          this._triggerCountryChange();
        }
      }
      setNumber(t) {
        const e = this._updateCountryFromNumber(t);
        this._updateValFromNumber(t);
        e && this._triggerCountryChange();
        this._trigger("input", { isSetNumber: true });
      }
      setPlaceholderNumberType(t) {
        this.options.placeholderNumberType = t;
        this._updatePlaceholder();
      }
    };
    var loadUtils = (t) => {
      if (!y.utils && !y.startedLoadingUtilsScript) {
        y.startedLoadingUtilsScript = true;
        return new Promise((e, i) => {
          import(t)
            .then(({ default: t }) => {
              y.utils = t;
              forEachInstance("handleUtils");
              e(true);
            })
            .catch(() => {
              forEachInstance("rejectUtilsScriptPromise");
              i();
            });
        });
      }
      return null;
    };
    var y = Object.assign(
      (t, e) => {
        const i = new m(t, e);
        i._init();
        t.setAttribute("data-intl-tel-input-id", i.id.toString());
        y.instances[i.id] = i;
        return i;
      },
      {
        defaults: c,
        documentReady: () => document.readyState === "complete",
        getCountryData: () => r,
        getInstance: (t) => {
          const e = t.getAttribute("data-intl-tel-input-id");
          return e ? y.instances[e] : null;
        },
        instances: {},
        loadUtils: loadUtils,
        version: "23.3.2",
      },
    );
    var C = y;
    return __toCommonJS(n);
  })();
  return t.default;
});
var e = t;
export { e as default };
