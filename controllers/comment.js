const Comment = require("../models/Comment");
const Content = require("../models/Content");
const User = require("../models/User");



const addComment = async(req, res, next) => {
    try {
        const comment =  await Comment.create({
            ...req.body,
            ["user.id"]: req.user.id,
            ["user.name"]: req.user.name + " " + req.user.surname,
            ["user.profilePicture"]: req.user.profilePicture,
            content: req.params.contentid
        });
        await Content.findByIdAndUpdate(req.params.contentid, {
            $push: { comments: comment._id }
        })

        return res.status(200).json({ comment:comment, message: "Comment added successfully" });
    }
    catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

const getComments = async(req, res) => {
    try {
        const comments = await Comment.find({content: req.params.contentid});
        return res.status(200).json(comments);
    }
    catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

module.exports = {
    addComment,
    getComments
};