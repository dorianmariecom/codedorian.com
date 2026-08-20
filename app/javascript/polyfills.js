if (!Object.hasOwn) {
  Object.hasOwn = (object, property) =>
    Object.prototype.hasOwnProperty.call(Object(object), property);
}
