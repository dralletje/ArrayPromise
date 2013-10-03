(function() {
  var ArrayPromise, ArrayTypedPromise, Promise, Q, async, polyfill, typedPromise, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  typedPromise = require('./typedPromise');

  polyfill = require('./lib/polyfill');

  async = require('async');

  Q = require('kew');

  Promise = Q.defer().constructor;

  ArrayTypedPromise = typedPromise(Array, Promise);

  module.exports = ArrayPromise = (function(_super) {
    __extends(ArrayPromise, _super);

    function ArrayPromise() {
      _ref = ArrayPromise.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return ArrayPromise;

  })(ArrayTypedPromise);

  ["each", "map", "filter", "arrayReject", "reduce", "detect", "sortBy", "some", "every", "concat"].forEach(function(method) {
    return ["", "Series", "Limit"].forEach(function(modifier) {
      var key;
      key = method + modifier;
      if (async[key] == null) {
        return;
      }
      return module.exports.prototype[key] = function() {
        var args, iterator, _i;
        args = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), iterator = arguments[_i++];
        if (!(iterator instanceof Function)) {
          throw new TypeError("Iterator is not a function but " + iterator);
        }
        return this.then(function(value) {
          var defered;
          defered = Q.defer();
          async[key].apply(async, [value].concat(__slice.call(args), [function() {
            var done, params, _j;
            params = 2 <= arguments.length ? __slice.call(arguments, 0, _j = arguments.length - 1) : (_j = 0, []), done = arguments[_j++];
            return Q.all(params).then(function(params) {
              return iterator.apply(null, params);
            }).then(function(result) {
              return done(null, result);
            }).fail(function(error) {
              return done(error);
            });
          }], [function(err, value) {
            if ((value == null) && (!(err instanceof Error))) {
              value = err;
              err = void 0;
            }
            if (err != null) {
              return defered.reject(err);
            }
            return defered.resolve(value);
          }]));
          return defered.promise;
        });
      };
    });
  });

  module.exports.install = function(Promise) {
    if (Promise.prototype == null) {
      Promise = Promise.constructor;
    }
    return polyfill.extendPropertie(Promise, 'array', function() {
      this.__proto__ = module.exports.prototype;
      return this;
    });
  };

}).call(this);
