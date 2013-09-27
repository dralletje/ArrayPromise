ArrayPromise
============
A Promise that acts just like an array, as you can invoke map and sort on it.. with chaining!   

It implement all methods that async (https://github.com/caolan/async) supports, except reject, which is renamed to arrayReject.
It also add supports for promises in any aspect of interaction with this api, and so with the async api.
All based on the kew (https://github.com/Obvious/kew) promise implementation, but should work with like every Promises/A+ implementation that uses reject and resolve, or even the ones who don't (did not check that :s).
Small example to show his promise-full-ness:

```coffeescript
Q = require 'kew'
require('arraypromise').install(Q.defer().constructor) # Install does add the 'array' method on the given promise prototype

defered = Q.defer() # Create a new promise
defered.array.map( (value) -> # Notice there is no callback, still it's async
  Q.resolve value*7 # Make it return a promise, just to show promise-compatibility
).then (result) -> # The result of .map() is also just a promise! :D
  console.log result # log the result
  
r = Q.resolve # Shortcut for making promises of values
defered.resolve [r 1, r 2, r 3, r 4] # Resolve the promise with promises of 1, 2, 3 and 4
```

It is promised all over the place, ALL OVER!
Awesome, isn't it? :D