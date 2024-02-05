// eslint-disable-next-line import/no-extraneous-dependencies
const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const AppError = require('../utils/appError')

const catchAsync = require('../../../EventApplication/utils/catchAsync')

const signToken = (id) => {
    const token = jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
    return token
}

exports.signup = catchAsync(async(req,res,next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    })

    const token = signToken(newUser._id)

    res.status(201).json({
        success: true,
        token,
        data: {
            user: newUser
        }
    })
})

exports.login = catchAsync(async(req,res,next)=>{
    const email = req.body.email
    const password = req.body.password

    // 1) Check if email and password exist
    if(!email || !password){
        return next(new AppError('Please provide email and password', 400))
    }

    // 2) Check if user exists && password is correct
    const user =  await User.findOne({email}).select('+password')

    if(!user || !(await user.correctPassword(password,user.password))){
        return next(new AppError('Email or Password is incorrect', 401))
    }
    
    // 3) if everything is okay, send token to client
    const token = signToken(user._id)
    res.status(200).json({
        status: 'success',
        token: token
    })
})

exports.protect = catchAsync( async (req,res,next) => {
    //Getting token if its exists
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token){ 
        return next(new AppError("You are not logged in! Please login.", 401))
    }

    //Veryfying the token
    const veryifyAsync = promisify(jwt.verify)
    const decode = await veryifyAsync(token,process.env.JWT_SECRET)
    //checking if user exist
    const user = await User.findById(decode.id)
    if(!user) return next(new AppError("User doesn't exist",400))

    user.changedPasswordAfter(decode.iat)

    //grant access to protected route
    req.user = user
    next()
})

exports.restrictTo = (...roles) => (req,res,next) =>{
    if(!roles.includes(req.user.role)){
        return next(new AppError('You are not authorized to perform this action',403))
    }
    next()
}

exports.forgotPassword = async(req,res,next) =>{
    //Get user
    const user = await User.findOne({email: req.body.email})

    if(!user){
        return next(new AppError('No user with this email address',404))
    }

    //Generate the random reset token
    const resetToken = user.createResetToken()
    await user.save({validateBeforeSave:false})
}

exports.resetPasseword = (req,res,next) =>{

}

