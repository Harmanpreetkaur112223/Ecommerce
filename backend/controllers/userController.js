import { asyncHandler } from "../utils/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import User from "../models/userModel.js"
import validator from 'validator'
import { validationResult } from "express-validator";
import sendEmail from '../utils/sendEmail.js'

const options = {
    httpOnly: true,
    secure: true
}
const generateAcessAndRefreshToken = async (id) => {
    const user = await User.findById(id);
    // console.log(user)
    
    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()
    user.refreshToken = refreshToken
    console.log(accessToken)
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
}
const registerUser = asyncHandler(async (req, res, next) => {
    // const errors = validationResult(req);
    // if (!(errors.isEmpty())) return next(new ErrorHandler("ValidationError", 400))


    const { name, email } = req.body;
    // if (!validator.isEmail(email)) {
    //     return res.status(400).json({ error: 'Invalid email format' });
    //   }
    if (!name || !email) return next(new ErrorHandler("Enter all credentials", 401))

    const data = req.body;
    const userInstance = new User(data);
    const response = await userInstance.save()
    const { accessToken, refreshToken } = await generateAcessAndRefreshToken(response._id);
    // const token = await response.generateAccessToken()

    res.cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .status(201).json({
            message: "user registered successfully",
            response,
            success: true,
            accessToken,
            refreshToken
        })


})

const loginUser = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return next(new ErrorHandler("enter  all credentials ", 401))
    const user = await User.findOne({ $and: [{ email }, { name }] })
    if (!user) return next(new ErrorHandler("user does not exist", 401))
    const checkPassword = await user.isPasswordCorrect(password)
    // console.log(user.password)
    if (!checkPassword) return next(new ErrorHandler("invalid email or password", 401))
    const { accessToken, refreshToken } = await generateAcessAndRefreshToken(user._id)
    // console.log(accessToken)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    // req.user = loggedInUser

    return res.status(200).cookie('accessToken', accessToken, options).cookie('refreshToken', refreshToken, options)
        .json({ user: loggedInUser, accessToken, refreshToken })

})

const logOutUser = asyncHandler(async (req, res, next) => {
    // console.log(req.user)
    const user = await User.findById(req.user._id);
    if (!user) return next(new ErrorHandler("invalid user", 401))
    User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined,
        }
    },
        { new: true }
    )

    res.clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json({ message: 'user logged out' })
})



// forgot password for giving email and link 
const forgotPassword = asyncHandler(async (req, res, next) => {
    const userInstance = await User.findOne({ email: req.body.email })
    // console.log(userInstance)
    if (!userInstance) return next(new ErrorHandler("userInstance does not exists", 404))


    // get reset password token
    const resetToken = await userInstance.getResetPasswordToken()
    // console.log(resetToken)
    await userInstance.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/vi/user/password/reset/${resetToken}`
    const message = `Your password reset token is \n\n ${resetPasswordUrl} \n\n if you have not requested this email then plaeseignore it `
    try {
        await sendEmail({
            email: userInstance.email,
            subject: `eHub password recovery `,
            message,
        })
        res.status(200).json({ sucess: true, message: `email send to ${userInstance.email} successfully` })
    } catch (error) {
        userInstance.resetPasswordExpire = undefined;
        userInstance.resetPasswordToken = undefined;

        userInstance.save({ validateBeforeSave: false })
        return next(new ErrorHandler(error.message, 500))
    }
})


// actual reset password where the user will provide newpassword confirm password
const resetPassword = asyncHandler(async (req, res, next) => {
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex')

    // find the token in the database
    const user = await User.findOne({ resetToken: token, resetPasswordExpire: { $gt: Date.now() } })
    if (!user) return next(new ErrorHandler('reset password token is invalud or expired', 401))

    if (req.body.password !== req.body.confirmPassword) return next(new ErrorHandler('Password confirmpassword should match', 400))

    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    user.save({ validateBeforeSave: false })
    const { refreshToken, accessToken } = await user.generateAcessAndRefreshToken()
    res.cookie('refreshToken', refreshToken, options)
        .cookie('accessToken', accessToken, options)
        .json({ message: 'password changed successfully' })


})


// ---------------------------------------------------------User controllers------------------------------------------------------
const getUserDetails = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user })
})

const getAllUserdetails = asyncHandler(async(req  , res , next)=>{
    const users = await User.find();
    res.status(200).json(users)
})

const updatePassword = asyncHandler(async (req, res, next) => {
    // console.log(req.user)
    const user = await User.findById(req.user._id);
    // console.log(user)
    const{oldPassword , newPassword , confirmPassword} = req.body;
    if(!oldPassword || !newPassword||!confirmPassword)return next(new ErrorHandler("Enter all credentials",400))
    if (!user) return next(new ErrorHandler("user does not exists", 401))
    const ispasswordMatch = await user.isPasswordCorrect(req.body.oldPassword);
    if (!ispasswordMatch) return next(new ErrorHandler('old password doesnot match', 401))
    if (req.body.newPassword !== req.body.confirmPassword) return next(new ErrorHandler(' confirm password does not match', 401))
        // console.log(`${user.password} \n ${req.body.newPassword}`)
    user.password = req.body.newPassword
    
    await user.save({ validateBeforeSave: false })
    // console.log(`${user.password} \n ${req.body.newPassword}`)
    const { refreshToken, accessToken } = await generateAcessAndRefreshToken(user._id)
    // console.log(user)

    res.cookie('refreshToken', refreshToken, options)
        .cookie('accessToken', accessToken, options)
        .json({ message: 'password changed successfully' })

})

const updateProfile = asyncHandler(async (req , res , next)=>{
    const data = req.body;
    const user = req.params.id;
    if(!user) return next(new ErrorHandler(`user donot exist with id ${req.params.id}`,400));
     user = await User.findByIdAndUpdate(req.params.id , data,{new:true,runValidators:true});
    res.status(200).json({success:true,user,message:"updated user profile successfully"})
})

const getUser = asyncHandler(async(req , res , next)=>{
    const user = await User.findById(req.params.id)
    if(!user) return next(new ErrorHandler(`user donot exist with id ${req.params.id}`,400))
        res.status(200).json({user})
})

const deleteUser = asyncHandler(async(req , res , next)=>{
    const user = req.params.id;
    if(!user) return next(new ErrorHandler(`user donot exist with id ${req.params.id}`,400));
    await user.remove();
    res.status(200).json({success:true,user,message:"deleted user role successfully"})
})
const updateUserRole = asyncHandler(async(req , res , next)=>{
    const data = req.body;
    const user = req.params.id;
    if(!user) return next(new ErrorHandler(`user donot exist with id ${req.params.id}`,400));
     user = await User.findByIdAndUpdate(req.params.id , data,{new:true,runValidators:true});
    res.status(200).json({success:true,user,message:"updated user role successfully"})
})
export { registerUser, loginUser, logOutUser, forgotPassword, resetPassword, getUserDetails, updatePassword ,updateProfile,getAllUserdetails
,getUser,deleteUser,updateUserRole
}