chai = require("chai")
chaiAsPromised = require("chai-as-promised")

chai.use(chaiAsPromised)
#chai.Assertion.includeStack = true

should = chai.should()

ArrayPromise = require '../'
q = require 'kew'
ArrayPromise.install q.defer()

#console.log ArrayPromise.toString()

describe "ArrayPromise", ->
  beforeEach ->
    @defered = new ArrayPromise()
    
  afterEach ->
    @defered = undefined
    
  describe "when fullfilled with non-promises", ->    
    describe "#map()", ->
      it "should return 1, 4, 9, 16", (done) ->
        @defered.map((val) ->
          val*val
        ).should.become([1,4,9,16]).notify(done)
        @defered.resolve [1,2,3,4]
        
    describe "#reduce()", ->
      it "Should return [1,2,3,4] reduced with a count function", (done) ->
        @defered.reduce((val, memo) ->
          memo + val
        ).should.become(10).notify(done)
        @defered.resolve [1,2,3,4]
        
  describe "when rejected", ->      
    describe "#any()", ->
      it "should throw an error", (done) ->
        @defered.map().should.be.rejected.notify(done)
        @defered.reject(new Error)
      
describe "Normal Promise, casted to ArrayPromise", ->
  beforeEach ->
    defer = q.defer()
    @defered = defer.asArray
    
  afterEach ->
    @defered = undefined
    
  describe "when fullfilled with non-promises", ->    
    describe "#map()", ->
      it "should return 1, 4, 9, 16", (done) ->
        @defered.map((val) ->
          val*val
        ).should.become([1,4,9,16]).notify(done)
        @defered.resolve [1,2,3,4]
        
    describe "#reduce()", ->
      it "Should return [1,2,3,4] reduced with a count function", (done) ->
        @defered.reduce((val, memo) ->
          memo + val
        ).should.become(10).notify(done)
        @defered.resolve [1,2,3,4]
        
  describe "when rejected", ->      
    describe "#any()", ->
      it "should throw an error", (done) ->
        @defered.map().should.be.rejected.notify(done)
        @defered.reject(new Error)
