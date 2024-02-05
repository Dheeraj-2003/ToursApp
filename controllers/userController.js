const User = require('../models/userModel')
const catchAsync = require('../../../EventApplication/utils/catchAsync')
const AppError = require('../utils/appError')

exports.getAllUsers = catchAsync(async(req,res,next) => {

    // Execute Query
    const user = await User.find()

    res.status(200).json({
        status: 'success',
        results: user.length,
        message:'Tour list',
        data: {
            user
        }
    })
})

exports.createUser = (req,res) => {
    res.status(500).json({
        status:'error',
        message: 'This route is not yet defined'
    })
}
exports.getUSerById = (req,res) => {
    res.status(500).json({
        status:'error',
        message: 'This route is not yet defined'
    })
}
exports.deleteUser = (req,res) => {
    res.status(500).json({
        status:'error',
        message: 'This route is not yet defined'
    })
}

exports.updateUser = (req,res) => {
    res.status(500).json({
        status:'error',
        message: 'This route is not yet defined'
    })
}