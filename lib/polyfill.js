(function() {
  module.exports = function() {
    return module.exports.extend(Function, 'polyfill', function(method, val) {
      return module.exports.extend(this, method, val);
    });
  };

  module.exports.extend = function(Class, method, value) {
    if (Class.prototype[method] != null) {
      return;
    }
    return Object.defineProperty(Class.prototype, method, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: value
    });
  };

  module.exports.extendPropertie = function(Class, method, getter, setter) {
    if (Class.prototype[method] != null) {
      return;
    }
    return Object.defineProperty(Class.prototype, method, {
      enumerable: false,
      configurable: false,
      get: getter
    });
  };

}).call(this);
