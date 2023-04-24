const { comparePassword } = require("../helpers/input/inputHelpers");
const Content = require("../models/Content");
const User = require("../models/User");
const Comment = require("../models/Comment");



const getUser = async(req, res, next) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id).select("-isAccountConfirmed -role -__v -_id -tempToken -tempTokenExpire");
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

const resetPassword = async(req, res, next) => {
    try{
        const {id} = req?.user;
        const newPassword = req.body.newPassword;
        const oldPassword = req.body.oldPassword;
        const user = await User.findById(id).select("+password");
        if(!comparePassword(oldPassword, user.password)){
            return res.status(400).json({error: "The old password is incorrect."});
        }
        if(comparePassword(newPassword, user.password)) {
            return res.status(400).json({error: "The new password can not be the same as the old password."});
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({message: "Password reset successfully."});
    }
    catch(err) {
        res.status(500).json({error: err.message});
    }
}

const deleteUser = async(req, res, next) => {
    try {
        const id = req.user.id;
        await User.findByIdAndDelete(id);
        res.status(200).json({message: "User deleted successfully."});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const editDetails = async(req, res, next) => {
    try {
        const id = req.user.id;
        await User.findByIdAndUpdate(id, req.body, {new: true, runValidators: true})
        await Content.updateMany({"user.id": id}, {$set: {"user.name": req.body.name + " " + req.body.surname}});
        await Comment.updateMany({"user.id": id}, {$set: {"user.name": req.body.name + " " + req.body.surname}});
        
        res.status(200).json({message: "Profile updated successfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const getContents = async(req, res, next) => {
    try {
        const id = req.user.id;
        const contents = await Content.find({["user.id"]: id});
        res.status(200).json(contents);
    } catch (error) {
        res.status(500).json({error: err.message});
    }
}

const getProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}
module.exports = {
    getUser,
    resetPassword,
    deleteUser,
    editDetails,
    getContents,
    getProfile,
}