const Content = require("../models/Content");
const User = require("../models/User");

const addContent = async(req, res, next) => {
    try {
        const content = await Content.create({
            ...req.body,
            ["user.id"]: req.user.id,
            ["user.name"]: req.user.name + " " + req.user.surname,
            ["user.profilePicture"]: req.user.profilePicture
        });
        await User.findByIdAndUpdate(req.user.id,{
            $push: {
                contents: content.id
            }
        })
        res.status(201).json({content, message: "Content added successfully"});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }   
}

const getAllContents = async(req, res, next) => {
    try {
        const contents = await Content.find().select("-__v");
        res.status(200).json(contents);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getContent = async (req, res) => {
    try {
        const content = await Content.findById(req.params.id).select("-__v");
        res.status(200).json(content);
    } catch (error) {
        res.status(404).json({ message: "Content not found" });
    }
}

const getUserContents = async(req, res) => {
    try {
        let contents= await Content.find({["user.id"]: req.params.id});
        res.status(200).json(contents);

    } catch (error) {
        res.status(404).json({ message: "User not found" });
    }
}

module.exports = {
    addContent,
    getAllContents,
    getContent,
    getUserContents,

}