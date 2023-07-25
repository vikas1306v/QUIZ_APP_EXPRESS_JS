const express=require('express')
const router=express.Router()
const Category=require('../models/Category')
const fetchuser=require('../middlewares/fetchuser.js')
//creating the category  but login required and the user must be  admin_user

router.post('/create',fetchuser,async (req,res)=>{

    try{
     const id=req.id
     const user_role=req.user_role
     if (user_role === "normal_user") {
        return res.status(400).json({
          status: false,
          error: "Forbidden Unauthrozie Acess ! Denied",
        });
      }

     const {category_title}=req.body
     const category=await Category.create({
        category_title:category_title
     }) 
     res.status(200).json({
        success:true,
        category:category
     })
    }
    catch(error){
       return  res.status(500).json({
            success:false,
            error:"Internal Server Error"
        })
    }

})


module.exports=router