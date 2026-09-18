// Return the original response so callers can handle status codes and bodies.
export default function http(url, { json, ...options } = {}) {
  const headers = new Headers(options.headers);
  const method = (options.method || "GET").toUpperCase();

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (json !== undefined) {
    headers.set("Content-Type", "application/json");
    options.body = JSON.stringify(json);
  }

  if (
    new URL(url, window.location.href).origin === window.location.origin &&
    !["GET", "HEAD", "OPTIONS"].includes(method) &&
    !headers.has("X-CSRF-Token")
  ) {
    const csrfToken = document.querySelector("[name='csrf-token']")?.content;
    if (csrfToken) headers.set("X-CSRF-Token", csrfToken);
  }

  return fetch(url, { ...options, method, headers });
}
