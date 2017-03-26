/**
 * Created by POI on 2017/2/7.
 */
var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;
var CommentSchema = new Schema({
    animation:{type:ObjectId,ref:'Animation'},
    from:{type:ObjectId,ref:'User'},
    reply:[{
        to:{type:ObjectId,ref:'User'},
        from:{type:ObjectId,ref:'User'},
        content:String
    }],
    content:String,
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

CommentSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now();
    }
    next()
})
CommentSchema.statics = {
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

module.exports = CommentSchema;

