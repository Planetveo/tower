_ = require("underscore")
_.mixin(require("underscore.string"))

class String
  @camelize: -> 
    _.camelize("_#{arguments[0] || @}")
    
  @constantize: ->
    global[@camelize(arguments...)]
    
  @underscore: ->
    _.underscored(arguments[0] || @)
    
  @titleize: ->
    _.titleize(arguments[0] || @)
    
module.exports = String