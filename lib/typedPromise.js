(function() {
  var Promise, Q,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Q = require('kew');

  Promise = Q.defer().constructor;

  module.exports = function(Type) {
    var TypedPromise;
    TypedPromise = (function(_super) {
      __extends(TypedPromise, _super);

      function TypedPromise() {
        TypedPromise.__super__.constructor.call(this);
      }

      return TypedPromise;

    })(Promise);
    Object.getOwnPropertyNames(Type.prototype).forEach(function(key) {
      if (['constructor'].indexOf(key) !== -1) {
        return;
      }
      return TypedPromise.prototype[key] = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return this.then(function(value) {
          return Type.prototype[key].apply(value, args);
        });
      };
    });
    return TypedPromise;
  };

}).call(this);
