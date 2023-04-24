const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ContentSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
        maxlength: [1000,"Description cannot be more than 1000 characters"],
        minlength: [10,"Description cannot be less than 10 characters"]
    },
    user: {
        id: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        name: {
            type: String
        },
        profilePicture: {
            type: String
        }
    },
    comments: {
        type: [Array],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Content",ContentSchema);