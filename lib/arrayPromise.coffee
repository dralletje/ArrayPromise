typedPromise = require('./typedPromise')
polyfill = require './lib/polyfill'
async = require 'async'

Q = require 'kew'
Promise = Q.defer().constructor

ArrayTypedPromise = typedPromise(Array, Promise)

module.exports = class ArrayPromise extends ArrayTypedPromise
oneArgument = ["filter"]
      
["each", "map", "filter", "reject", "reduce", "detect", "sortBy", "some", "every", "concat"].forEach (method) ->
  ["", "Series", "Limit"].forEach (modifier) ->
    key = method + modifier
    if not async[key]? then return
    
    ## Add every async method to the ArrayPromise prototype
    # (With the 'Array' suffix)
    module.exports::[key + 'Array'] = (args..., iterator) ->
      # When called, check for a iterator function, if not a function, error!
      if iterator not instanceof Function 
        throw new TypeError "Iterator is not a function but #{iterator}"
        
      ## Wait for ^THIS^ promise to fullfill
      @then (value) -> 
        defered = Q.defer() # Make a new promise
        async[key] value, args..., (params..., done) -> # Call the Async equivalent and have a callback with variables (params...) and the callback (done)
          
          # Wait for all params to fullfill
          Q.all(params).then (params) ->
            iterator params... # Run the user given function with the fullfilled params
            
          # 'Convert' the result into an Node Callback
          # (Or just a result callback, when it's in 'oneArgument')
          .then (result) ->
            if oneArgument.indexOf(key) isnt -1
              done result
            else
              done null, result
              
          .fail (error) ->
            if oneArgument.indexOf(key) isnt -1
              done false
            else
              done error
              
        ## When all the items have finished, return the result in a promise
        , (err, value) ->
          if err instanceof Array
            localdefer = Q.all(err)
          else
            localdefer = Q.resolve(err)
            
          localdefer.then (err) ->
            if not value? and (err not instanceof Error)
              value = err
              err = undefined
            
            if err?
              return defered.reject err
            defered.resolve value
        defered.promise
    
    # If the method does not already exists (Not the case with reject :p) then, add it pure
    if Promise::[key]?
      return
    module.exports::[key] = module.exports::[key + "Array"]
    
    
## A function to add a .asArray propertie, to make a promise typed
module.exports.install = (Promise) ->
  if not Promise::?
    Promise = Promise.constructor
  polyfill.extendPropertie Promise, 'array', () ->
    #this.promise = Promise.prototype
    @__proto__ = module.exports.prototype
    this