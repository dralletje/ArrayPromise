module.exports = () ->
  module.exports.extend Function, 'polyfill', (method, val) ->
    module.exports.extend this, method, val

module.exports.extend = (Class, method, value) ->
  return if Class.prototype[method]?
  Object.defineProperty Class::, method,
    enumerable: no
    configurable: no
    writable: no
    value: value
    
module.exports.extendPropertie = (Class, method, getter, setter) ->
  return if Class.prototype[method]?
  Object.defineProperty Class::, method,
    enumerable: no
    configurable: no
    get: getter