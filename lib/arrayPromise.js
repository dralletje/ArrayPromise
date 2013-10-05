(function() {
  var ArrayPromise, ArrayTypedPromise, Promise, Q, async, oneArgument, polyfill, typedPromise, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  typedPromise = require('./typedPromise');

  polyfill = require('./lib/polyfill');

  _ = require('underscore');

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

  oneArgument = ["filter", "reject"];

  ["each", "map", "filter", "reject", "reduce", "detect", "sortBy", "some", "every", "concat"].forEach(function(method) {
    return ["", "Series", "Limit"].forEach(function(modifier) {
      var key;
      key = method + modifier;
      if (async[key] == null) {
        return;
      }
      module.exports.prototype[key + 'Array'] = function() {
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
              if (oneArgument.indexOf(key) !== -1) {
                return done(result);
              } else {
                return done(null, result);
              }
            }).fail(function(error) {
              if (oneArgument.indexOf(key) !== -1) {
                return done(false);
              } else {
                return done(error);
              }
            });
          }], [function(err, value) {
            var localdefer;
            if (err instanceof Array) {
              localdefer = Q.all(err);
            } else {
              localdefer = Q.resolve(err);
            }
            return localdefer.then(function(err) {
              if ((value == null) && (!(err instanceof Error))) {
                value = err;
                err = void 0;
              }
              if (err != null) {
                return defered.reject(err);
              }
              return defered.resolve(value);
            });
          }]));
          return defered.promise;
        });
      };
      if (Promise.prototype[key] != null) {
        return;
      }
      return module.exports.prototype[key] = module.exports.prototype[key + "Array"];
    });
  });

  ["groupBy"].forEach(function(method) {
    return module.exports.prototype["_" + method] = function() {
      var args, iterator, m;
      iterator = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      m = _[method];
      return this.then(function(list) {
        return Q.all(list).then(function(list) {
          return m.apply(null, [list, iterator].concat(__slice.call(args)));
        });
      });
    };
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
