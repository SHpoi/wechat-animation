var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;
var AnimationSchema = new Schema({
  title: {
    unique: true,
    type: String
  },
  original_title:String,
  doubanRating:Number,
  doubanId:String,
  director: String,
  language: String,
  country: String,
  year: Number,
  summary: String,
  flash: [String],
  genres:[String],
  episode:[String],
  poster: String,
  // genres: [{
  //   type: ObjectId,
  //   ref: 'Category'
  // }],
  pv: {
    type: Number,
    default:0
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

AnimationSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  next()
})
AnimationSchema.statics = {
  fetch: function (cb) {
    return this
      .find({})
      .sort({
        'meta.updateAt': -1
      })
      .exec(cb)
  },
  findById: function (id, cb) {
    return this
      .findOne({
        _id: id
      })
      .exec(cb)
  }
}

module.exports = AnimationSchema
