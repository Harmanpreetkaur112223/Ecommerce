import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import User from "../models/userModel.js";
const veriffyJWT = asyncHandler(async(req , res , next)=>{
    // const{accessToken , refreshToken} = req.cookies;
    try {
     const accessToken = req.cookies.accessToken
    const refreshToken = req.cookies.refreshToken
    console.log(accessToken)
    if(!accessToken)return(next(new ErrorHandler("unauthorized user or acess token expired ",401)))
    try {
        const decodedAccessToken = jwt.verify(accessToken , process.env.ACCESS_TOKEN)
        req.user = decodedAccessToken;
        // console.log(`verify jwt ${decodedAccessToken._id}`)
        next()
        // console.log("hey")
    } catch (error) {
        if(error.name === 'TokenExpiredError')
        {
            if(!refreshToken){
                return next(new ErrorHandler("refresh token is required",401))
            }
        const  user = await User.find({refreshToken})
        if(!user)return next(new ErrorHandler("Invalid refresh token ",401))
        try
        {
            const decodedRefreshToken = jwt.verify(refreshToken , process.env.REFRESH_TOKEN)
            const newAccessToken = await user.generateAccessToken()
            // console.log(newAccessToken)
            const options = {
                httpOnly:true,
                secure:true
            }
            const decodedAccessToken = jwt.verify(accessToken , process.env.ACCESS_TOKEN)
            req.user = decodedAccessToken;
            res.cookies('accessToken',newAccessToken,options)
            req.user = decodedAccessToken;
            next();

        }    
        catch(error)
        {
       return next(new ErrorHandler("Invalid refresh token ",401))

        }
        }

    }
    } catch (error) {
        return next(new ErrorHandler(error , 404))
    }
})
const authorizeRole = (...roles)=>{
    return (req , res , next)=>{
        // console.log(req.user)
        if(!(roles.includes(req.user.role)))
        {
            return next(new ErrorHandler(`role ${req.user.role} is not allowed to access this resource`,403))
        }
        next()
    }
}



export {veriffyJWT ,authorizeRole}