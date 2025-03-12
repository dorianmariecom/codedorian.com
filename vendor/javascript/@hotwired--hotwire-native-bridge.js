// @hotwired/hotwire-native-bridge@1.0.0 downloaded from https://ga.jspm.io/npm:@hotwired/hotwire-native-bridge@1.0.0/dist/hotwire-native-bridge.js

import { Controller as e } from "@hotwired/stimulus";
var t = Object.defineProperty;
var __defNormalProp = (e, s, n) =>
  s in e
    ? t(e, s, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: n,
      })
    : (e[s] = n);
var __publicField = (e, t, s) => {
  __defNormalProp(e, typeof t !== "symbol" ? t + "" : t, s);
  return s;
};
var s = class {
  #e;
  #t;
  #s;
  #n;
  constructor() {
    this.#e = null;
    this.#t = 0;
    this.#s = [];
    this.#n = new Map();
  }
  start() {
    this.notifyApplicationAfterStart();
  }
  notifyApplicationAfterStart() {
    document.dispatchEvent(new Event("web-bridge:ready"));
  }
  supportsComponent(e) {
    return !!this.#e && this.#e.supportsComponent(e);
  }
  send({ component: e, event: t, data: s, callback: n }) {
    if (!this.#e) {
      this.#a({ component: e, event: t, data: s, callback: n });
      return null;
    }
    if (!this.supportsComponent(e)) return null;
    const a = this.generateMessageId();
    const i = { id: a, component: e, event: t, data: s || {} };
    this.#e.receive(i);
    n && this.#n.set(a, n);
    return a;
  }
  receive(e) {
    this.executeCallbackFor(e);
  }
  executeCallbackFor(e) {
    const t = this.#n.get(e.id);
    t && t(e);
  }
  removeCallbackFor(e) {
    this.#n.has(e) && this.#n.delete(e);
  }
  removePendingMessagesFor(e) {
    this.#s = this.#s.filter((t) => t.component != e);
  }
  generateMessageId() {
    const e = ++this.#t;
    return e.toString();
  }
  setAdapter(e) {
    this.#e = e;
    document.documentElement.dataset.bridgePlatform = this.#e.platform;
    this.adapterDidUpdateSupportedComponents();
    this.#i();
  }
  adapterDidUpdateSupportedComponents() {
    this.#e &&
      (document.documentElement.dataset.bridgeComponents =
        this.#e.supportedComponents.join(" "));
  }
  #a(e) {
    this.#s.push(e);
  }
  #i() {
    this.#s.forEach((e) => this.send(e));
    this.#s = [];
  }
};
var n = class {
  constructor(e) {
    this.element = e;
  }
  get title() {
    return (
      this.bridgeAttribute("title") ||
      this.attribute("aria-label") ||
      this.element.textContent ||
      this.element.value
    ).trim();
  }
  get enabled() {
    return !this.disabled;
  }
  get disabled() {
    const e = this.bridgeAttribute("disabled");
    return e === "true" || e === this.platform;
  }
  enableForComponent(e) {
    e.enabled && this.removeBridgeAttribute("disabled");
  }
  hasClass(e) {
    return this.element.classList.contains(e);
  }
  attribute(e) {
    return this.element.getAttribute(e);
  }
  bridgeAttribute(e) {
    return this.attribute(`data-bridge-${e}`);
  }
  setBridgeAttribute(e, t) {
    this.element.setAttribute(`data-bridge-${e}`, t);
  }
  removeBridgeAttribute(e) {
    this.element.removeAttribute(`data-bridge-${e}`);
  }
  click() {
    this.platform == "android" && this.element.removeAttribute("target");
    this.element.click();
  }
  get platform() {
    return document.documentElement.dataset.bridgePlatform;
  }
};
var { userAgent: a } = window.navigator;
var i = /bridge-components: \[.+\]/.test(a);
var r = class extends e {
  static get shouldLoad() {
    return i;
  }
  pendingMessageCallbacks = [];
  initialize() {
    this.pendingMessageCallbacks = [];
  }
  connect() {}
  disconnect() {
    this.removePendingCallbacks();
    this.removePendingMessages();
  }
  get component() {
    return this.constructor.component;
  }
  get platformOptingOut() {
    const { bridgePlatform: e } = document.documentElement.dataset;
    return (
      this.identifier ==
      this.element.getAttribute(`data-controller-optout-${e}`)
    );
  }
  get enabled() {
    return (
      !this.platformOptingOut && this.bridge.supportsComponent(this.component)
    );
  }
  send(e, t = {}, s) {
    t.metadata = { url: window.location.href };
    const n = { component: this.component, event: e, data: t, callback: s };
    const a = this.bridge.send(n);
    s && this.pendingMessageCallbacks.push(a);
  }
  removePendingCallbacks() {
    this.pendingMessageCallbacks.forEach((e) =>
      this.bridge.removeCallbackFor(e),
    );
  }
  removePendingMessages() {
    this.bridge.removePendingMessagesFor(this.component);
  }
  get bridgeElement() {
    return new n(this.element);
  }
  get bridge() {
    return window.Strada.web;
  }
};
__publicField(r, "component", "");
if (!window.Strada) {
  const e = new s();
  window.Strada = { web: e };
  e.start();
}
export { r as BridgeComponent, n as BridgeElement };
