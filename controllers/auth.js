const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers");
const { validateUserInput, comparePassword } = require("../helpers/input/inputHelpers");
const sendEmail = require("../helpers/libraries/sendEmail");
const User = require("../models/User");


const register = async(req, res, next) => {
    const infos = req.body;
    const user = await User.findOne({email: infos.email});
    if (user) {
        return res.status(400).json({error: 'User already exists'});
    }
    const newUser = new User(infos);
    

    const confirmAccountUrl = `http://localhost:3000/confirmaccount?id=${newUser._id}`;
    const emailTemplate = `
    <h3>
    Confirm your account
    </h3>
    <p><a href='${confirmAccountUrl}' target = '_blank'> click</a> here to confirm your account</p>
    `;
    
    try {
        await sendEmail({
            from: process.env.SMTP_ADMIN,
            to: newUser.email,
            subject: 'Confirm your account',
            html: emailTemplate
        });
        await newUser.save();
        return res.status(201).json({message: 'User created please check your email'});
    }
    catch (err) {
        return res.status(500).json({error: err.message});
    }
}

const confirmAccount = async(req, res, next) => {
    const id = req.query.id;
    const user = await User.findOne({_id: id});
    console.log(user);
    if (user.isAccountConfirmed) {
        return res.status(400).json({error: 'Account already confirmed'});
    }
    user.isAccountConfirmed = true;
    await user.save();
    return res.status(200).json({message: 'Account confirmed'});
}

const login = async(req, res, next) => {  
    const {email, password} = req.body;
    if(!validateUserInput(email, password)){
        return res.status(400).json({error: 'Invalid email or password'});
    }
    const user = await User.findOne({email}).select("+password");
    if(!comparePassword(password, user.password)){
        return res.status(400).json({error: 'Invalid email or password'});
    }
    sendJwtToClient(user, res);
}
const logout = async(req, res) => {
    const {NODE_ENV} = process.env;
    return res
    .status(200)
    .cookie({
        httpOnly: true,
        secure: NODE_ENV === 'production',
        expires: new Date(Date.now())
    })
    .json({
        message: 'Logged out successfully'
    })
}
const forgotPassword  = async(req, res, next) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    const forgotPasswordToken = user.getTempTokenFromUser();
    const forgotPasswordUrl = `http://localhost:3000/forgotpassword/change/?forgotPasswordToken=${forgotPasswordToken}`;
    const emailTemplate = `
    <h3>
    Reset your password
    </h3>
    <p><a href='${forgotPasswordUrl}' target = '_blank'> click</a> here to reset your password</p>
    `;
    
    try {
        await user.save();
        await sendEmail({
            from: process.env.SMTP_ADMIN,
            to: user.email,
            subject: 'Reset your password',
            html: emailTemplate
        });
        return res.status(200).json({message: 'Check your email to reset your password'});
    }
    catch (err) {
        return res.status(500).json({error: err.message});
    }
}

const changePassword = async(req, res) => {
    console.log(req.body);
    try{
        
        const forgotPasswordToken = req.query.forgotPasswordToken;
        const {password} = req.body;
        if(!forgotPasswordToken){
            return res.status(400).json({error: 'Invalid forgotPasswordToken'});
        }
        const user = await User.findOne({
            tempToken: forgotPasswordToken,
            tempTokenExpire: { $gt: Date.now() },
        });
        if(!user){
            return res.status(400).json({error: 'Invalid Token or Session expired'});
        }
        user.tempToken = undefined;
        user.tempTokenExpire = undefined;
        user.password = password;
        await user.save();
        return res.status(200).json({message: 'Password changed'});
    }
    catch (err) {
        return res.status(500).json({error: err.message});
    }
        
}

module.exports = {
    register,
    confirmAccount,
    login,
    forgotPassword,
    changePassword,
    logout
}
