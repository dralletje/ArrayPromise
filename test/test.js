(function() {
  var ArrayPromise, chai, chaiAsPromised, q, should;

  chai = require("chai");

  chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);

  should = chai.should();

  ArrayPromise = require('../');

  q = require('kew');

  ArrayPromise.install(q.defer());

  describe("ArrayPromise", function() {
    beforeEach(function() {
      return this.defered = new ArrayPromise();
    });
    afterEach(function() {
      return this.defered = void 0;
    });
    describe("when fullfilled with non-promises", function() {
      describe("#map()", function() {
        return it("should return 1, 4, 9, 16", function(done) {
          this.defered.map(function(val) {
            return val * val;
          }).should.become([1, 4, 9, 16]).notify(done);
          return this.defered.resolve([1, 2, 3, 4]);
        });
      });
      return describe("#reduce()", function() {
        return it("Should return [1,2,3,4] reduced with a count function", function(done) {
          this.defered.reduce(function(val, memo) {
            return memo + val;
          }).should.become(10).notify(done);
          return this.defered.resolve([1, 2, 3, 4]);
        });
      });
    });
    return describe("when rejected", function() {
      return describe("#any()", function() {
        return it("should throw an error", function(done) {
          this.defered.map().should.be.rejected.notify(done);
          return this.defered.reject(new Error);
        });
      });
    });
  });

  describe("Normal Promise, casted to ArrayPromise", function() {
    beforeEach(function() {
      var defer;
      defer = q.defer();
      return this.defered = defer.asArray;
    });
    afterEach(function() {
      return this.defered = void 0;
    });
    describe("when fullfilled with non-promises", function() {
      describe("#map()", function() {
        return it("should return 1, 4, 9, 16", function(done) {
          this.defered.map(function(val) {
            return val * val;
          }).should.become([1, 4, 9, 16]).notify(done);
          return this.defered.resolve([1, 2, 3, 4]);
        });
      });
      return describe("#reduce()", function() {
        return it("Should return [1,2,3,4] reduced with a count function", function(done) {
          this.defered.reduce(function(val, memo) {
            return memo + val;
          }).should.become(10).notify(done);
          return this.defered.resolve([1, 2, 3, 4]);
        });
      });
    });
    return describe("when rejected", function() {
      return describe("#any()", function() {
        return it("should throw an error", function(done) {
          this.defered.map().should.be.rejected.notify(done);
          return this.defered.reject(new Error);
        });
      });
    });
  });

}).call(this);
