typedPromise = require('./typedPromise')
polyfill = require 'polyfill'
async = require 'async'

ArrayTypedPromise = typedPromise(Array)

module.exports = class ArrayPromise extends ArrayTypedPromise
    constructor: () ->  
      super()
      
["each", "map", "filter", "reject", "reduce", "detect", "sortBy", "some", "every", "concat"].forEach (key) ->
  module.exports::[key] = (args..., iterator) ->
    @then (value) ->
      Type::[key].apply(value, args)
    
## A function to add a .asArray propertie, to make a promise typed
module.exports.install = (Promise) ->
  if not Promise::?
    Promise = Promise.constructor
  polyfill.extendPropertie Promise, 'asArray', () ->
    @__proto__ = ArrayTypedPromise.prototype
    this