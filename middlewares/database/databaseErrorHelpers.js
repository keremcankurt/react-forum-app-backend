const User = require("../../models/User");
const Content = require("../../models/Content");
const checkUserExists = async(req,res,next) => {
    try{
        const id =req.query.id || req.params.id;
        const user = await User.findOne({_id: id});
        if(!user){
            return res.status(404).json({error: 'User not found'});
        }
        next();
    }
    catch(err){
        return res.status(500).json({error: err.message});
    }
    
}
const checkEmailExists = async(req, res, next) => {
    const email = req.body.email;
    const user = await User.findOne({email: email});
    if(!user){
        return res.status(400).json({error: 'User not found'});
    }
    next();
}

const checkAccountConfirmation = async(req, res, next) => {
    
    const user = await User.findOne({_id: req.user.id});
    if(!user.isAccountConfirmed){
        return res.status(400).json({error: 'Account not confirmed'});
    }
    next();
}

const checkContentExists = async(req, res, next) => {
    const id = req.params.contentid;
    const content = await Content.findById(id);
    if(!content){
        return res.status(400).json({error: 'Content not found'});
    }
    next();
}

module.exports = {
    checkUserExists,
    checkEmailExists,
    checkAccountConfirmation,
    checkContentExists
}