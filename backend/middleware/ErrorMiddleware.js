import ErrorHandler from "../utils/ErrorHandler.js";

export default function (err , req , res , next){
    err.statusCode = err.statusCode || 500
    err.message = err.message || 'Internal server error'
    // wrong mongo id error
    if(err.name === 'CastError'){
        const message = `Resource not found ${err.path}`
        err =  new ErrorHandler(message , 400)
    }

    // duplicate mongoose key error
    if(err.code ==11000){
        const message = `duplicate  ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message , 400)

    }
    // invalid web token error
    // if(err.name === 'JsonWebTokenError'){
    //     const message = `Json web Token is invalid try again`
    //     err = new( ErrorHandler(message , 400))
    // }

    res.status(err.statusCode).json({
        success:false,
        error : err.message
    })

}
