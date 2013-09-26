typedPromise = require('./typedPromise')
polyfill = require 'polyfill'
async = require 'async'

Q = require 'kew'
Promise = Q.defer().constructor

ArrayTypedPromise = typedPromise(Array, Promise)

module.exports = class ArrayPromise extends ArrayTypedPromise
      
["each", "map", "filter", "arrayReject", "reduce", "detect", "sortBy", "some", "every", "concat"].forEach (method) ->
  ["", "Series", "Limit"].forEach (modifier) ->
    key = method + modifier
    if not async[key]? then return

    module.exports::[key] = (args..., iterator) ->
      if iterator not instanceof Function 
        throw new TypeError "Iterator is not a function but #{iterator}"
        
      @then (value) ->
        defered = Q.defer()
        async[key] value, args..., (params..., done) ->
          Q.all(params).then (params) ->
            iterator params...
          .then (result) ->
            done null, result
          .fail (error) ->
            done error
            
        , (err, value) ->
          if not value? and (err not instanceof Error)
            value = err
            err = undefined
            
          if err?
            return defered.reject err
          defered.resolve value
        defered.promise
    
## A function to add a .asArray propertie, to make a promise typed
module.exports.install = (Promise) ->
  if not Promise::?
    Promise = Promise.constructor
  polyfill.extendPropertie Promise, 'asArray', () ->
    #this.promise = Promise.prototype
    @__proto__ = module.exports.prototype
    this