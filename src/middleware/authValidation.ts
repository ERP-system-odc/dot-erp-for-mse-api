import {signinSchema,signupSchema} from "../validationSchema/authJoiSchema"
const Joi=require("joi")
const emailValidator = require('deep-email-validator');




export const signupDataValidation=async (req,res,next)=>{

    const signupData={           
        full_name:req.body.full_name,
        email:req.body.email,
        phone_number:req.body.phone_number,
        password:req.body.password,
        confirm_password:req.body.confirm_password

    }

  
    try{
        const {error, value} =signupSchema.validate(signupData,{abortEarly:false})
      
        if(error){
            return res.status(400).json({
                "message":error.message
            })
        }
             
        next();
    }
    catch(err){
        next(err)
    }
   
}


export const signinDataValidation=async (req,res,next)=>{

    const signinData={           
        email:req.body.email,        
        password:req.body.password
       }

  
    try{
        const {error, value} =signinSchema.validate(signinData,{abortEarly:false})
      
        if(error){
            return res.status(400).json({
                "message":error.message
            })
        }
             
        next();
    }
    catch(err){
        next(err)
    }
   
}
