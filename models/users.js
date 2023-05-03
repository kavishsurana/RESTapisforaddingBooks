const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')


const UserSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true,
        trim : true,
        lowercase : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ('Email is invalid')
            }
        }
    },
    password : {
        type : String,
        required : true,
        minLength : 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error ('Password must not contain password')
            }
        }
    },
    tokens: [{
        token:{
            type : String,
            required : true
        }
    }, {timestamps : true}]
})


UserSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id : user._id.toString()}, process.env.JWT_SECTER)
    user.tokens = user.tokens.concate({token})
    await user.save()
    return token
}

UserSchema.pre('save' , async function(next) {
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password , 8)
    }
    next()
})

UserSchema.statics.findByCrendentials = async (email,password) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password , user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}



module.exports = mongoose.model('User' , UserSchema)