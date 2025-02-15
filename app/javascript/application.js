import "@hotwired/turbo-rails";
import "@hotwired/turbo";
import "controllers";
import PullToRefresh from "pulltorefreshjs";
import LocalTime from "local-time";

const updateBorderTopWidth = () => {
  if (localStorage.getItem("codeStatusBarHeight")) {
    document.body.style.borderTopWidth = `${localStorage.getItem("codeStatusBarHeight")}px`;
  }
};

const sendTokens = () => {
  window.ReactNativeWebView?.postMessage(
    JSON.stringify({ tokens: window.code.tokens }),
  );
};

window.addEventListener("load", sendTokens);
window.addEventListener("load", updateBorderTopWidth);
window.addEventListener("turbo:load", sendTokens);
window.addEventListener("turbo:load", updateBorderTopWidth);
window.addEventListener("message", async (event) => {
  const data = JSON.parse(event.data);
  const deviceToken = data.device?.token;
  const deviceTokens = window.code.deviceTokens;
  const isRegistered = window.code.isRegistered;
  const csrfToken = document.querySelector("[name='csrf-token']")?.content;

  if (data.config) {
    document.body.classList.add("code-app", `code-app:${data.config.CODE_ENV}`);
  }

  if (data.statusBarHeight) {
    localStorage.setItem("codeStatusBarHeight", data.statusBarHeight);
    updateBorderTopWidth();
  }

  if (isRegistered && deviceToken && !deviceTokens.includes(deviceToken)) {
    await fetch("/devices", {
      method: "POST",
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ device: data.device }),
    });
  }
});

PullToRefresh.init({
  mainElement: "body",
  onRefresh() {
    window.location.reload();
  },
});

LocalTime.start();

import "trix";
import "@rails/actiontext";
