import {User} from "../entity/User"
import { AppDataSource } from "../data-source"
import { Response,Request } from "express"
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


export const signup=async(req:Request,res:Response,next)=>{
   
try{

    const userRepository = AppDataSource.getRepository(User)
    const foundUser=await userRepository.findOneBy({email:req.body.email,phone_number:req.body.phoneNumber})
    if(foundUser)
        return res.status(302).json({
            "status":302,
            "message":"user already exists."
        })
    const salt=bcrypt.genSaltSync(10)
    const hash=bcrypt.hashSync(req.body.password,salt)
    const user = new User()
    user.full_name = req.body.full_name
    user.email=req.body.email
    user.phone_number=req.body.phone_number
    user.is_admin=false
    user.is_starter=true
    user.password=hash
  
    await AppDataSource.manager.save(user)

    res.status(200).json({
    "status":200,
    "message":"User signup is successful"
   })

}
catch(err){
    next(err)
}


}
export const signin=async(req:Request,res:Response,next)=>{
   
try{
    const userRepository = AppDataSource.getRepository(User)
    const user=new User()
    user.email=req.body.email;
    const foundUser=await userRepository.findOneBy({email:req.body.email})
        
    if(!foundUser)
        return res.status(404).json({
            "message":"User not found"
        })

    const isPasswordCorrect=await bcrypt.compare(req.body.password,foundUser.password)
    if(!isPasswordCorrect)
    return res.status(400).json({
        "message":"Username or Password is incorrect"
    }) 
    
const token=jwt.sign({
    id:foundUser.id,is_admin:foundUser.is_admin
},process.env.JWT_KEY)
const {password,...importantAttributes}=foundUser

 res.status(200).json({
    credentials:importantAttributes,
    "access-token":token
})


}
catch(err){
    next(err)
}

}



