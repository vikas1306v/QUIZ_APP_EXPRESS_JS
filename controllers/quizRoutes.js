const express=require('express');
const router=express.Router();
const Quiz=require('../models/Quiz');
const Category=require('../models/Category');
const Question=require('../models/Question');
const fetchuser=require('../middlewares/fetchuser');




//creating the quiz user have to logged in but it has to admin aslo category id is in url and no of questions 

router.post('/create/:category_id/:no_of_questions',fetchuser,async(req,res)=>{
  
    try{
        
      
        // we are checking that user is admin or not
        if(req.user_role!='admin_user'){
            return res.status(401).json({
                success:false,
                error:'You are not authorized to create quiz'
            })
        }
        //beacause no fo questions is in url is string so we have to convert it into integer
        const num=parseInt(req.params.no_of_questions)
        //we find all the  questions of that category
        let questions=await Question.find({category_id:req.params.category_id})
        let quiz_questions=[]
        //we are pushing random questions in quiz_questions array
        for(let i=0;i<num;i++){
            quiz_questions.push(questions[Math.floor(Math.random()*questions.length)])
        }
        //ccreating the quiz
        const quiz=await Quiz.create({
            quiz_title:req.body.quiz_title,
            category_id:req.params.category_id,
            list_of_questions:quiz_questions
        })

        //sending the http response
        res.status(200).json({
            success:true,
            data:quiz
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            error:'Internal Server Error'
        })
    }
})


//getting all the quiz of a category this is only seen by user
router.get('/getall/:category_id',fetchuser,async(req,res)=>{
    try{
        const user_role=req.user_role
        const category_id=req.params.category_id
        if(user_role=='admin_user'){
            return res.status(401).json({
                success:false,
                error:'You are not authorized to get all the quiz'
            })
        }
        let quiz=await Quiz.find({category_id:category_id})
         for(let j=0;j<quiz.length;j++)
         {
            let list_of_questions=[]
            for(let i=0;i<quiz[j].list_of_questions.length;i++){
               let x=quiz[j].list_of_questions[i]
                  let question=await Question.findById(x)
                  question.right_answer=''
                  list_of_questions.push(question)
            }
            quiz[j].list_of_questions=list_of_questions
         }
         res.status(200).json({
            success:true,
            data:quiz
        })
    }
    catch(error)
    {
        res.status(500).json({
            success:false,
            error:'Internal Server Error'
        })
        
        
    }
})

//sending the response of a quiz when user send the quiz id and  question id and answer
//it sholud be user
router.get('/response/:quiz_id',fetchuser,async(req,res)=>{
    if(req.user_role=='admin_user'){
        return res.status(401).json({
            success:false,
            error:'You are not authorized to send the response'
        })
    }
    try{
        const quiz_id=req.params.quiz_id;
        const quiz=await Quiz.findById(quiz_id)
        const questions_ids=quiz.list_of_questions
        const response_of_user=req.body[0]
        let count =0;
        for(let i=0;i<questions_ids.length;i++)
        {
            const question=await Question.findById(questions_ids[i])
            if(question.right_answer==response_of_user[i].response)
            {
                count++;
            }
        }
        res.status(200).json({
            success:true,
            data:count
        }) 

    }
    catch(error)
    {
        res.status(500).json({
            success:false,
            error:'Internal Server Error'
        })
    }

})








module.exports=router;