export default (scope) => {
  return (key) => {
    if (!window.translations) {
      return "[missing window.translations]";
    }

    if (!scope) {
      return "[missing scope]";
    }

    if (!key) {
      return "[missing key]";
    }

    const keys = [scope, ...key.split(".")];

    let translation = keys.reduce((acc, el) => (acc || {})[el], window.translations)

    if (!translation) {
      return `[missing translation "${scope}.${key}"]`;
    }

    return translation;
  }
}
