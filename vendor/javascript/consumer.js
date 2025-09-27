// consumer@1.2.2 downloaded from https://ga.jspm.io/npm:consumer@1.2.2/consumer.js

var t =
  "undefined" !== typeof globalThis
    ? globalThis
    : "undefined" !== typeof self
      ? self
      : global;
var i = {};
var e = (i = function Consumer(i, e) {
  Object.defineProperty(this || t, "source", {
    get: function () {
      return i;
    },
  });
  (this || t).position = e || 0;
});
e.prototype = {
  get current() {
    return (this || t).source[(this || t).position];
  },
  advance: function (i) {
    (this || t).position += i;
    return this || t;
  },
  consume: function (i) {
    i.global || i.compile(i.source, flags(i));
    i.lastIndex = (this || t).position;
    var e = i.exec((this || t).source);
    if (e && e.index != (this || t).position) return null;
    e && ((this || t).position += e[0].length);
    return e;
  },
  get done() {
    return (this || t).position >= (this || t).source.length;
  },
  peek: function (i) {
    return 1 === i
      ? (this || t).source[(this || t).position + i]
      : (this || t).source.substr((this || t).position, i);
  },
};
function flags(t) {
  return t.multiline && t.ignoreCase
    ? "gim"
    : t.multiline
      ? "gm"
      : t.ignoreCase
        ? "gi"
        : "g";
}
var n = i;
export default n;
