var mongoose = require('mongoose')
var AnimationSchema = require('../schemas/animation.js')
var Animation = mongoose.model('Animation', AnimationSchema)

module.exports = Animation