(function() {
  var ArrayPromise, ArrayTypedPromise, async, polyfill, typedPromise,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  typedPromise = require('./typedPromise');

  polyfill = require('polyfill');

  async = require('async');

  ArrayTypedPromise = typedPromise(Array);

  module.exports = ArrayPromise = (function(_super) {
    __extends(ArrayPromise, _super);

    function ArrayPromise() {
      ArrayPromise.__super__.constructor.call(this);
    }

    return ArrayPromise;

  })(ArrayTypedPromise);

  ["each", "map", "filter", "reject", "reduce", "detect", "sortBy", "some", "every", "concat"].forEach(function(key) {
    return module.exports.prototype[key] = function() {
      var args, iterator, _i;
      args = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), iterator = arguments[_i++];
      return this.then(function(value) {
        return Type.prototype[key].apply(value, args);
      });
    };
  });

  module.exports.install = function(Promise) {
    if (Promise.prototype == null) {
      Promise = Promise.constructor;
    }
    return polyfill.extendPropertie(Promise, 'asArray', function() {
      this.__proto__ = ArrayTypedPromise.prototype;
      return this;
    });
  };

}).call(this);
