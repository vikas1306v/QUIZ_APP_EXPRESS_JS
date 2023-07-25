const router=require('express').Router();
const fetchuser=require('../middlewares/fetchuser')
const Question=require('../models/Question');

//creating the question user have to logged in but it has to admin
router.post('/create/:category_id',fetchuser,async(req,res)=>{
    try{
       
        const id=req.id;
        const user_role=req.user_role;
       

        if(user_role!=="admin_user"){
            return res.status(401).json({
                success:false,
                error:"Not authorized"
            })
        }
        const {question_title,question_description,option1,option2,option3,right_answer,difficulty_level}=req.body;
        const category_id=req.params.category_id;
      
       const question=await  Question.create({
            question_title:question_title,
            question_description:question_description,
            option1:option1,
            option2:option2,
            option3:option3,
            right_answer:right_answer,
            difficulty_level:difficulty_level,
            category_id:category_id,
       })
      
         res.status(200).json({
            success:true,
            question:question
        })

    }
    catch(error){
      return   res.status(500).json({
            success:false,
            error:"Internal server error"
        })
    }


});

//get all questions of a category login required and admin only can do this
router.get('/getall/:category_id',fetchuser,async(req,res)=>{
    try{
        const id=req.id;
        const user_role=req.user_role;
        if(user_role!=="admin_user"){
            return res.status(401).json({
                success:false,
                error:"Not authorized"
            })
        }
        const category_id=req.params.category_id;
        const questions=await Question.find({category_id:category_id})
        res.status(200).json({
            success:true,
            questions:questions
        })
    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            error:"Internal server error"
        })
    }
})








module.exports=router;