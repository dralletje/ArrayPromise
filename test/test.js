(function() {
  var ArrayPromise, Q, chai, chaiAsPromised, should,
    __hasProp = {}.hasOwnProperty;

  chai = require("chai");

  chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);

  should = chai.should();

  ArrayPromise = require('../');

  Q = require('kew');

  ArrayPromise.install(Q.defer());

  Object.forEach = function(object, cb) {
    var key, value, _results;
    _results = [];
    for (key in object) {
      if (!__hasProp.call(object, key)) continue;
      value = object[key];
      _results.push(cb(value, key, object));
    }
    return _results;
  };

  Object.forEach({
    "Normal Promise, casted to ArrayPromise": function() {
      var defer;
      defer = Q.defer();
      return this.defered = defer.asArray;
    },
    "ArrayPromise": function() {
      return this.defered = new ArrayPromise();
    }
  }, function(before, description) {
    return describe(description, function() {
      beforeEach(before);
      afterEach(function() {
        return this.defered = void 0;
      });
      return Object.forEach({
        "when fullfilled with non-promises": function(defered) {
          return defered.resolve([1, 2, 3, 4]);
        },
        "when fullfilled with promises": function(defered) {
          var r;
          r = Q.resolve;
          return defered.resolve([r(1), r(2), r(3), r(4)]);
        }
      }, function(fullfilling, whenFullfilled) {
        describe(whenFullfilled, function() {
          describe("#map()", function() {
            return it("should return 1, 4, 9, 16", function(done) {
              this.defered.map(function(val) {
                return val * val;
              }).should.become([1, 4, 9, 16]).notify(done);
              return fullfilling(this.defered);
            });
          });
          describe("#reduce()", function() {
            return it("Should return [1,2,3,4] reduced with a count function", function(done) {
              this.defered.reduce(0, function(val, memo) {
                return memo + val;
              }).should.become(10).notify(done);
              return fullfilling(this.defered);
            });
          });
          describe("#map(Promise)", function() {
            return it("should return 1, 4, 9, 16", function(done) {
              this.defered.map(function(val) {
                return Q.resolve(val * val);
              }).should.become([1, 4, 9, 16]).notify(done);
              return fullfilling(this.defered);
            });
          });
          return describe("#reduce(Promise)", function() {
            return it("Should return [1,2,3,4] reduced with a count function", function(done) {
              this.defered.reduce(0, function(val, memo) {
                return Q.resolve(memo + val);
              }).should.become(10).notify(done);
              return fullfilling(this.defered);
            });
          });
        });
        return describe("when rejected", function() {
          return describe("#any()", function() {
            return it("should throw an error", function(done) {
              this.defered.map((function() {})).should.be.rejected.notify(done);
              return this.defered.reject(new Error);
            });
          });
        });
      });
    });
  });

}).call(this);
