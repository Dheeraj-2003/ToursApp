/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose')
const crypto = require('crypto')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'A user must have a name']
    },
    email:{
        type:String,
        required: [true,'A user must have an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo:{
        type: String
    },
    role:{
        type: String,
        enum : ['user','admin'],
        default: 'user'
    },
    password:{
        type:String,
        required: [true,' A user must have a password'],
        minLength: 8,
        select: false // this means that the field will not be included in the response of a query
    },
    passwordConfirm:{
        type:String,
        required:[true,'Please confirm your password'],
        validate:{
            validator: function(el){
                return el === this.password
            },
            message: "Passwords do not match"
        }
    },
    passwordChangedAt:{
        type: Date
    },
    passwordResetToken: String,
    passwordResetExpire: String
})

userSchema.pre('save', async function(next){

    if(!this.isModified('password')) return next()

    //Hash the password with the cost of 12
    this.password = await bcrypt.hash(this.password,10)

    //Delete the passwordConfirm field
    this.passwordConfirm = undefined

    next()
})

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = this.passwordChangedAt.getTime()/1000
        console.log(this.passwordChangedAt,JWTTimestamp)
    }
    return false
}

userSchema.methods.createResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    console.log({resetToken},this.passwordResetToken)
    this.passwordResetExpire = Date.now() + 10*60*1000
    return resetToken
}

const User = mongoose.model('User',userSchema)

module.exports = User