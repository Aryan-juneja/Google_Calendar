


import mongoose from 'mongoose'

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    token:{
        type:String,
        required:true,
    }
})
const User = mongoose.models.users ||mongoose.model("users",userSchema);
export default User