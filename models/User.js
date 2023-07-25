const mongoose=require('mongoose')
const {Schema}=mongoose
const userSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    email:
    {
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
         type:String,
         required:true
    },
    user_class:{
        type:String,
        required:true
    }

})


module.exports=mongoose.model('user',userSchema)