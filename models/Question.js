const mongoose=require('mongoose')
const {Schema}=mongoose
const questionSchema=new Schema({
    question_title:{
        type:String,
        required:true
    }
    ,
    question_description:{
        type:String,
        required:true
    }
    ,
    option1:{
        type:String,
        required:true
    },
    option2:{
        type:String,
        required:true
    },
    option3:{
        type:String,
        required:true
    },
    right_answer:{
        type:String,
        required:true

    },
    difficulty_level:{
        type:String,    
        required:true
    }
    ,
    category_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category',
    }
})

module.exports=mongoose.model('question',questionSchema)