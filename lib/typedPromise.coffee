module.exports = (Type, Promise) ->
  class TypedPromise extends Promise
    constructor: () ->
      super()
            
  Object.getOwnPropertyNames(Type::).forEach (key) ->
    if ['constructor'].indexOf(key) isnt -1
      return
    TypedPromise::[key] = (args...) ->
      @then (value) ->
        Type::[key].apply(value, args)
    
  return TypedPromise
      