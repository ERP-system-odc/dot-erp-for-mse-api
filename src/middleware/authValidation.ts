import {signinSchema,signupSchema} from "../validationSchema/authJoiSchema"
const Joi=require("joi")



export const signupDataValidation=async (req,res,next)=>{

    const signupData={           
        fullname:req.body.fullname,
        email:req.body.email,
        phonenumber:req.body.phonenumber,
        password:req.body.password,
        confirmpassword:req.body.confirmpassword

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
