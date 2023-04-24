const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { 
        type: 'string',
        required: [true,"Please provide a name"],
        minlength: [3,"Name must be at least 3 characters long"],
        maxlength: [50,"Name must be less than 50 characters long"]
    },
    surname: { 
        type:'string',
        required: [true,"Please provide a surname"],
        minlength: [3,"Surname must be at least 3 characters long"],
        maxlength: [50,"Surname must be less than 50 characters long"]
    },
    email: {
        type:'string',
        required: [true,"Please provide an email"],
        unique: true,
        match: [/.+@.+\..+/, "Please provide a valid email"]
    },
    password: {
        type:'string',
        required: [true,"Please provide a password"],
        minlength: [8,"Password must be at least 8 characters long"],
        select: false
    },
    profilePicture: {
        type:'string',
        default: "https://res.cloudinary.com/drcn0888/image/upload/v1629111857/default_profile_picture_drcn0888.png"
    },
    role: {
        type:'string',
        enum: ['user', 'admin'],
        default: 'user'
    },
    place: {
        type:'string'
    },
    tempToken: {
      type: String,
    },
    tempTokenExpire: {
      type: Date,
    },
    isAccountConfirmed: {
        type: 'boolean',
        default: false
    },
    contents: {
        type: 'array',
        default: []
    },
    createdAt: {
        type: 'date',
        default: Date.now
    },
    

});

UserSchema.methods.getTempTokenFromUser = function () {
  const randomHexString = crypto.randomBytes(15).toString("hex");
  const { TEMP_TOKEN_EXPIRE } = process.env;
  const tempToken = crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");
  this.tempToken = tempToken;
  this.tempTokenExpire = Date.now() + parseInt(TEMP_TOKEN_EXPIRE);
  return tempToken;
};
UserSchema.methods.generateJwtFromUser = function () {
  const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;
  const payload = {
    id: this._id,
    name: this.name,
    surname: this.surname,
    profilePicture: this.profilePicture,
    role: this.role,
  };

  const token = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRE,
  });
  
  return token;
};

UserSchema.pre("save", function (next) {
  
    if (!this.isModified("password")) {
      next();
    }
    const saltRounds = 10;
    const myPlaintextPassword = this.password;
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(myPlaintextPassword, salt, (err, hash) => {
        if (err) next(err);
        this.password = hash;
        next();
      });
    });
  });
module.exports = mongoose.model("User",UserSchema);