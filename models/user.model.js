const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    firstName: {type:String, required:true, },
    lastName:{type:String, required:true, },
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true,select:false },
    profilePicture:{type:String, },
    isAdmin:{type:Boolean, default:false},
    tempOTP:{type:String},
    verified:{type:Boolean, default:false},
    createdAt:{type:String, default:Date.now()}
})

const UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel;