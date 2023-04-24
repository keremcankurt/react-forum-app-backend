const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    text: {
        type: String,
        required: [true,"Please provide a comment"],
        maxlength: [1000,"Description cannot be more than 1000 characters"]
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
    content: {
        type: Schema.Types.ObjectId,
        ref: "Content"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Comment",CommentSchema);