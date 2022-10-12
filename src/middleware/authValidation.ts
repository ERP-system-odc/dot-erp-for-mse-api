import {signinSchema,signupSchema} from "../validationSchema/authJoiSchema"
const Joi=require("joi")



export const authDataValidation=async (req,res,next)=>{

    const signInData={           
        fullname:req.body.fullname,
        email:req.body.email,
        phonenumber:req.body.phonenumber,
        role:req.body.role,
        password:req.body.password,
        confirmpassword:req.body.confirmpassword

    }

  
    try{
        const {error, value} =signupSchema.validate(signInData,{abortEarly:false})
      
        if(error){
            return res.status(400).json(error.message)
        }
      
        
        next();
    }
    catch(err){
        next(err)
    }
   
}


