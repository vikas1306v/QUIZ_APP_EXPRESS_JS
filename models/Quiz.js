const  mongoose=require('mongoose')
const {Schema}=mongoose
const quizSchema=new Schema({
    quiz_title:{
        type:String,
        required:true
    },
     category_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category',
        required:true
    },
    list_of_questions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'question',
    }],
})

module.exports=mongoose.model('quiz',quizSchema)