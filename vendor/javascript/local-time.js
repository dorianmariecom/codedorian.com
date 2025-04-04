// local-time@3.0.2 downloaded from https://ga.jspm.io/npm:local-time@3.0.2/app/assets/javascripts/local-time.es2017-esm.js

var t;
t = {
  config: {},
  run: function () {
    return this.getController().processElements();
  },
  process: function (...t) {
    var e, r, a;
    for (r = 0, a = t.length; r < a; r++)
      (e = t[r]), this.getController().processElement(e);
    return t.length;
  },
  getController: function () {
    return null != this.controller
      ? this.controller
      : (this.controller = new t.Controller());
  },
};
var e,
  r,
  a,
  n,
  s,
  i,
  o,
  u,
  l,
  c,
  d,
  m,
  h,
  f,
  g,
  p,
  S,
  v,
  y,
  T,
  b,
  M,
  D,
  w,
  E,
  I,
  C,
  N,
  A,
  O,
  $,
  F,
  Y,
  k,
  W,
  L = t;
(L.config.useFormat24 = !1),
  (L.config.i18n = {
    en: {
      date: {
        dayNames: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        abbrDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        monthNames: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        abbrMonthNames: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        yesterday: "yesterday",
        today: "today",
        tomorrow: "tomorrow",
        on: "on {date}",
        formats: { default: "%b %e, %Y", thisYear: "%b %e" },
      },
      time: {
        am: "am",
        pm: "pm",
        singular: "a {time}",
        singularAn: "an {time}",
        elapsed: "{time} ago",
        second: "second",
        seconds: "seconds",
        minute: "minute",
        minutes: "minutes",
        hour: "hour",
        hours: "hours",
        formats: { default: "%l:%M%P", default_24h: "%H:%M" },
      },
      datetime: {
        at: "{date} at {time}",
        formats: {
          default: "%B %e, %Y at %l:%M%P %Z",
          default_24h: "%B %e, %Y at %H:%M %Z",
        },
      },
    },
  }),
  (L.config.locale = "en"),
  (L.config.defaultLocale = "en"),
  (L.config.timerInterval = 6e4),
  (a = !isNaN(Date.parse("2011-01-01T12:00:00-05:00"))),
  (L.parseDate = function (t) {
    return (t = t.toString()), a || (t = r(t)), new Date(Date.parse(t));
  }),
  (e = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|[-+]?[\d:]+)$/),
  (r = function (t) {
    var r, a, n, s, i, o, u, l, c, d;
    if ((s = t.match(e)))
      return (
        ([r, c, o, a, n, i, l, d] = s),
        "Z" !== d && (u = d.replace(":", "")),
        `${c}/${o}/${a} ${n}:${i}:${l} GMT${[u]}`
      );
  }),
  (L.elementMatchesSelector =
    ((n = document.documentElement),
    (s =
      null !=
      (i =
        null !=
        (o =
          null != (u = null != (l = n.matches) ? l : n.matchesSelector)
            ? u
            : n.webkitMatchesSelector)
          ? o
          : n.mozMatchesSelector)
        ? i
        : n.msMatchesSelector),
    function (t, e) {
      if ((null != t ? t.nodeType : void 0) === Node.ELEMENT_NODE)
        return s.call(t, e);
    })),
  ({ config: c } = L),
  ({ i18n: m } = c),
  (L.getI18nValue = function (t = "", { locale: e } = { locale: c.locale }) {
    var r;
    return null != (r = d(m[e], t))
      ? r
      : e !== c.defaultLocale
        ? L.getI18nValue(t, { locale: c.defaultLocale })
        : void 0;
  }),
  (L.translate = function (t, e = {}, r) {
    var a, n, s;
    for (a in ((s = L.getI18nValue(t, r)), e))
      (n = e[a]), (s = s.replace(`{${a}}`, n));
    return s;
  }),
  (d = function (t, e) {
    var r, a, n, s, i;
    for (i = t, r = 0, n = (s = e.split(".")).length; r < n; r++) {
      if (null == i[(a = s[r])]) return null;
      i = i[a];
    }
    return i;
  }),
  ({ getI18nValue: f, translate: M } = L),
  (b =
    "function" ==
    typeof ("undefined" != typeof Intl && null !== Intl
      ? Intl.DateTimeFormat
      : void 0)),
  (g = {
    "Central European Standard Time": "CET",
    "Central European Summer Time": "CEST",
    "China Standard Time": "CST",
    "Israel Daylight Time": "IDT",
    "Israel Standard Time": "IST",
    "Moscow Standard Time": "MSK",
    "Philippine Standard Time": "PHT",
    "Singapore Standard Time": "SGT",
    "Western Indonesia Time": "WIB",
  }),
  (L.knownEdgeCaseTimeZones = g),
  (L.strftime = T =
    function (t, e) {
      var r, a, n, s, i, o, u;
      return (
        (a = t.getDay()),
        (r = t.getDate()),
        (i = t.getMonth()),
        (u = t.getFullYear()),
        (n = t.getHours()),
        (s = t.getMinutes()),
        (o = t.getSeconds()),
        e.replace(/%(-?)([%aAbBcdeHIlmMpPSwyYZ])/g, function (e, l, c) {
          switch (c) {
            case "%":
              return "%";
            case "a":
              return f("date.abbrDayNames")[a];
            case "A":
              return f("date.dayNames")[a];
            case "b":
              return f("date.abbrMonthNames")[i];
            case "B":
              return f("date.monthNames")[i];
            case "c":
              return t.toString();
            case "d":
              return p(r, l);
            case "e":
              return r;
            case "H":
              return p(n, l);
            case "I":
              return p(T(t, "%l"), l);
            case "l":
              return 0 === n || 12 === n ? 12 : (n + 12) % 12;
            case "m":
              return p(i + 1, l);
            case "M":
              return p(s, l);
            case "p":
              return M("time." + (n > 11 ? "pm" : "am")).toUpperCase();
            case "P":
              return M("time." + (n > 11 ? "pm" : "am"));
            case "S":
              return p(o, l);
            case "w":
              return a;
            case "y":
              return p(u % 100, l);
            case "Y":
              return u;
            case "Z":
              return S(t);
          }
        })
      );
    }),
  (p = function (t, e) {
    return "-" === e ? t : `0${t}`.slice(-2);
  }),
  (S = function (t) {
    var e, r, a;
    return (r = h(t))
      ? g[r]
      : (a = y(t, { allowGMT: !1 })) || (a = v(t))
        ? a
        : (e = y(t, { allowGMT: !0 }))
          ? e
          : "";
  }),
  (h = function (t) {
    return Object.keys(g).find(function (e) {
      return b
        ? new Date(t)
            .toLocaleString("en-US", { timeZoneName: "long" })
            .includes(e)
        : t.toString().includes(e);
    });
  }),
  (y = function (t, { allowGMT: e }) {
    var r;
    if (
      b &&
      ((r = new Date(t)
        .toLocaleString("en-US", { timeZoneName: "short" })
        .split(" ")
        .pop()),
      e || !r.includes("GMT"))
    )
      return r;
  }),
  (v = function (t) {
    var e, r, a, n, s;
    return (e =
      null != (r = (s = t.toString()).match(/\(([\w\s]+)\)$/)) ? r[1] : void 0)
      ? /\s/.test(e)
        ? e.match(/\b(\w)/g).join("")
        : e
      : (e = null != (a = s.match(/(\w{3,4})\s\d{4}$/)) ? a[1] : void 0) ||
          (e = null != (n = s.match(/(UTC[\+\-]\d+)/)) ? n[1] : void 0)
        ? e
        : void 0;
  }),
  (L.CalendarDate = class {
    static fromDate(t) {
      return new this(t.getFullYear(), t.getMonth() + 1, t.getDate());
    }
    static today() {
      return this.fromDate(new Date());
    }
    constructor(t, e, r) {
      (this.date = new Date(Date.UTC(t, e - 1))),
        this.date.setUTCDate(r),
        (this.year = this.date.getUTCFullYear()),
        (this.month = this.date.getUTCMonth() + 1),
        (this.day = this.date.getUTCDate()),
        (this.value = this.date.getTime());
    }
    equals(t) {
      return (null != t ? t.value : void 0) === this.value;
    }
    is(t) {
      return this.equals(t);
    }
    isToday() {
      return this.is(this.constructor.today());
    }
    occursOnSameYearAs(t) {
      return this.year === (null != t ? t.year : void 0);
    }
    occursThisYear() {
      return this.occursOnSameYearAs(this.constructor.today());
    }
    daysSince(t) {
      if (t) return (this.date - t.date) / 864e5;
    }
    daysPassed() {
      return this.constructor.today().daysSince(this);
    }
  }),
  ({ strftime: E, translate: I, getI18nValue: w, config: D } = L),
  (L.RelativeTime = class {
    constructor(t) {
      (this.date = t), (this.calendarDate = L.CalendarDate.fromDate(this.date));
    }
    toString() {
      var t, e;
      return (e = this.toTimeElapsedString())
        ? I("time.elapsed", { time: e })
        : (t = this.toWeekdayString())
          ? ((e = this.toTimeString()), I("datetime.at", { date: t, time: e }))
          : I("date.on", { date: this.toDateString() });
    }
    toTimeOrDateString() {
      return this.calendarDate.isToday()
        ? this.toTimeString()
        : this.toDateString();
    }
    toTimeElapsedString() {
      var t, e, r, a, n;
      return (
        (r = new Date().getTime() - this.date.getTime()),
        (a = Math.round(r / 1e3)),
        (e = Math.round(a / 60)),
        (t = Math.round(e / 60)),
        r < 0
          ? null
          : a < 10
            ? ((n = I("time.second")), I("time.singular", { time: n }))
            : a < 45
              ? `${a} ${I("time.seconds")}`
              : a < 90
                ? ((n = I("time.minute")), I("time.singular", { time: n }))
                : e < 45
                  ? `${e} ${I("time.minutes")}`
                  : e < 90
                    ? ((n = I("time.hour")), I("time.singularAn", { time: n }))
                    : t < 24
                      ? `${t} ${I("time.hours")}`
                      : ""
      );
    }
    toWeekdayString() {
      switch (this.calendarDate.daysPassed()) {
        case 0:
          return I("date.today");
        case 1:
          return I("date.yesterday");
        case -1:
          return I("date.tomorrow");
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
          return E(this.date, "%A");
        default:
          return "";
      }
    }
    toDateString() {
      var t;
      return (
        (t = this.calendarDate.occursThisYear()
          ? w("date.formats.thisYear")
          : w("date.formats.default")),
        E(this.date, t)
      );
    }
    toTimeString() {
      var t;
      return (
        (t = D.useFormat24 ? "default_24h" : "default"),
        E(this.date, w(`time.formats.${t}`))
      );
    }
  }),
  ({ elementMatchesSelector: C } = L),
  (L.PageObserver = class {
    constructor(t, e) {
      (this.processMutations = this.processMutations.bind(this)),
        (this.processInsertion = this.processInsertion.bind(this)),
        (this.selector = t),
        (this.callback = e);
    }
    start() {
      if (!this.started)
        return (
          this.observeWithMutationObserver() || this.observeWithMutationEvent(),
          (this.started = !0)
        );
    }
    observeWithMutationObserver() {
      if ("undefined" != typeof MutationObserver && null !== MutationObserver)
        return (
          new MutationObserver(this.processMutations).observe(
            document.documentElement,
            { childList: !0, subtree: !0 },
          ),
          !0
        );
    }
    observeWithMutationEvent() {
      return addEventListener("DOMNodeInserted", this.processInsertion, !1), !0;
    }
    findSignificantElements(t) {
      var e;
      return (
        (e = []),
        (null != t ? t.nodeType : void 0) === Node.ELEMENT_NODE &&
          (C(t, this.selector) && e.push(t),
          e.push(...t.querySelectorAll(this.selector))),
        e
      );
    }
    processMutations(t) {
      var e, r, a, n, s, i, o, u;
      for (e = [], r = 0, n = t.length; r < n; r++)
        if ("childList" === (i = t[r]).type)
          for (a = 0, s = (u = i.addedNodes).length; a < s; a++)
            (o = u[a]), e.push(...this.findSignificantElements(o));
      return this.notify(e);
    }
    processInsertion(t) {
      var e;
      return (e = this.findSignificantElements(t.target)), this.notify(e);
    }
    notify(t) {
      if (null != t ? t.length : void 0)
        return "function" == typeof this.callback ? this.callback(t) : void 0;
    }
  }),
  ({ parseDate: O, strftime: $, getI18nValue: A, config: N } = L),
  (L.Controller = function () {
    var t, e, r, a;
    return (
      (t = "time[data-local]:not([data-localized])"),
      (e = function (t) {
        return t.setAttribute("data-localized", "");
      }),
      (r = function (t) {
        return t.setAttribute("data-processed-at", new Date().toISOString());
      }),
      (a = function (t) {
        return new L.RelativeTime(t);
      }),
      class {
        constructor() {
          (this.processElements = this.processElements.bind(this)),
            (this.pageObserver = new L.PageObserver(t, this.processElements));
        }
        start() {
          if (!this.started)
            return (
              this.processElements(),
              this.startTimer(),
              this.pageObserver.start(),
              (this.started = !0)
            );
        }
        startTimer() {
          var t;
          if ((t = N.timerInterval))
            return null != this.timer
              ? this.timer
              : (this.timer = setInterval(this.processElements, t));
        }
        processElements(e = document.querySelectorAll(t)) {
          var r, a, n;
          for (a = 0, n = e.length; a < n; a++)
            (r = e[a]), this.processElement(r);
          return e.length;
        }
        processElement(t) {
          var n, s, i, o, u, l;
          if (
            ((n = t.getAttribute("datetime")),
            (i = t.getAttribute("data-local")),
            (s =
              (N.useFormat24 && t.getAttribute("data-format24")) ||
              t.getAttribute("data-format")),
            (o = O(n)),
            !isNaN(o))
          )
            return (
              t.hasAttribute("title") ||
                ((l = N.useFormat24 ? "default_24h" : "default"),
                (u = $(o, A(`datetime.formats.${l}`))),
                t.setAttribute("title", u)),
              r(t),
              (t.textContent = (function () {
                switch (i) {
                  case "time":
                    return e(t), $(o, s);
                  case "date":
                    return e(t), a(o).toDateString();
                  case "time-ago":
                    return a(o).toString();
                  case "time-or-date":
                    return a(o).toTimeOrDateString();
                  case "weekday":
                    return a(o).toWeekdayString();
                  case "weekday-or-date":
                    return a(o).toWeekdayString() || a(o).toDateString();
                }
              })())
            );
        }
      }
    );
  }.call(window)),
  (W = !1),
  (F = function () {
    return document.attachEvent
      ? "complete" === document.readyState
      : "loading" !== document.readyState;
  }),
  (Y = function (t) {
    var e;
    return null !=
      (e =
        "function" == typeof requestAnimationFrame
          ? requestAnimationFrame(t)
          : void 0)
      ? e
      : setTimeout(t, 17);
  }),
  (k = function () {
    return L.getController().start();
  }),
  (L.start = function () {
    return W
      ? L.run()
      : ((W = !0),
        ("undefined" != typeof MutationObserver && null !== MutationObserver) ||
        F()
          ? k()
          : Y(k));
  }),
  (L.processing = function () {
    return L.getController().started;
  }),
  window.LocalTime === L && L.start();
export { L as default };
