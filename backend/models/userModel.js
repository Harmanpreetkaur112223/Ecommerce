import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please enter your name'],
        unique:[true,"This name is registered ! try other "],
        maxLength: [40, 'The length cannot exceed 40 characters'],
        minLength: [4, 'The name must have atleast 4 characters'],
        trim:true
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,

    },
    password: {
        type: String,
        minLength: [8, 'password must be of 8 words']
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
   
    role: {
        type: String,
        default: 'user'
    },
    resetPasswordToken:String,
    resetPasswordExpire:String,
    refreshToken: String
})

// hash password
userSchema.pre('save', async function (next) {
    if (!(this.isModified('password'))) return next;
    this.password = await bcrypt.hash(this.password, 10);
    return next
})
// compare pass
userSchema.methods.isPasswordCorrect = async function(password){
    return  bcrypt.compare(password , this.password)
}
// get jwt
userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            role:this.role,

        },
        process.env.ACCESS_TOKEN,
        { expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
    )
}

userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign({
        _id: this._id
    }, process.env.REFRESH_TOKEN,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }

    )
}

// get resetPasswordToken
userSchema.methods.getResetPasswordToken = async function()
{
    // get the resetToken
    let resetToken =  crypto.randomBytes(20).toString('hex')

    // hash and add the reset token to the userschema 
    this.resetPasswordToken =  crypto.createHash('sha256').update(resetToken).digest('hex')
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000
    return resetToken;
}
const User = mongoose.model('User', userSchema)
export default User;