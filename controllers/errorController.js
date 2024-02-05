const AppError = require("../utils/appError");

const sendErrorDev = (err,res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    })
}

const sendErrorProd = (err,res) => {

    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }else{
        res.status(500).json({
            status: 'error',
            message:'Internal Error'
        })
    }

}

const handleCastErrorDB = err =>{
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message,400)
}

const handleDuplicateFieldsDB = err =>{
    const message = `Duplicate field value: ${err.keyValue.name}`
    return new AppError(message,409)
}

module.exports = (err, req, res,next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err,res)
    }else{

        let error = {...err}

        if(err.name === "CastError") error = handleCastErrorDB(error)
        if(err.code === 11000) error = handleDuplicateFieldsDB(error)

        sendErrorProd(error,res)
    }

}