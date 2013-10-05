chai = require("chai")
chaiAsPromised = require("chai-as-promised")

chai.use(chaiAsPromised)
#chai.Assertion.includeStack = true

should = chai.should()

ArrayPromise = require '../'
Q = require 'kew'
ArrayPromise.install Q.defer()

Object.forEach = (object, cb) ->
  for own key,value of object
    cb(value, key, object)

# Loop through every way of making a promise! :D
Object.forEach {
  ### Disable arraypromise now, because it clutters tests
  "Normal Promise, casted to ArrayPromise": ->
    defer = Q.defer()
    @defered = defer.array
  ###
  "ArrayPromise": ->
    @defered = new ArrayPromise()
}, (before, description) ->
  describe description, ->
    beforeEach before
    
    afterEach ->
      @defered = undefined
    
    Object.forEach {
      "when fullfilled with non-promises": (defered) ->
        defered.resolve [1,2,3,4]
      "when fullfilled with promises": (defered) ->
        r = Q.resolve
        defered.resolve [r(1), r(2), r(3), r(4)]
    }, (fullfilling, whenFullfilled) ->
      describe whenFullfilled, ->  
      
        describe "#_groupBy()", ->
          it "should return an even and odd propertie", (done) ->
            @defered._groupBy((val) ->
              if (val % 2) is 0 then 'even' else 'odd'
            ).should.become(
              odd: [1,3]
              even: [2,4]
            ).notify(done)
            fullfilling @defered

          it "(returning a promise) should return an even and odd propertie", (done) ->
            @defered._groupBy((val) ->
              Q.resolve if (val % 2) is 0 then 'even' else 'odd'
            ).should.become(
              odd: [1,3]
              even: [2,4]
            ).notify(done)
            fullfilling @defered
      
        describe "#filter()", ->
          it "should return only even numbers", (done) ->
            @defered.filter((val) ->
              (val % 2) is 0
            ).should.become([2,4]).notify(done)
            fullfilling @defered
            
        describe "#rejectArray()", ->
          it "should return only odd numbers", (done) ->
            @defered.rejectArray((val) ->
              (val % 2) is 0
            ).should.become([1,3]).notify(done)
            fullfilling @defered
        
        describe "#map()", ->
          it "should return 1, 4, 9, 16", (done) ->
            @defered.map((val) ->
              val*val
            ).should.become([1,4,9,16]).notify(done)
            fullfilling @defered
        
          it "(Returning a promise) should return 1, 4, 9, 16", (done) ->
            @defered.map((val) ->
              Q.resolve val*val
            ).should.become([1,4,9,16]).notify(done)
            fullfilling @defered
        
        describe "#reduce()", ->
          it "should return [1,2,3,4] reduced with a count function", (done) ->
            @defered.reduce(0, (val, memo) ->
              memo + val
            ).should.become(10).notify(done)
            fullfilling @defered
        
          it "(Returning a promise) should return [1,2,3,4] reduced with a count function", (done) ->
            @defered.reduce(0, (val, memo) ->
              Q.resolve memo + val
            ).should.become(10).notify(done)
            fullfilling @defered
            
          it "should throw an error", (done) ->
            @defered.reduce(0, (val, memo) ->
              Q.reject new Error "An error!"
            ).should.be.rejected.notify done
            fullfilling @defered
        
      describe "when rejected", ->      
        describe "#any()", ->
          it "should throw an error", (done) ->
            @defered.map((->)).should.be.rejected.notify(done)
            @defered.reject(new Error)