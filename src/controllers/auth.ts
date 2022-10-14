import {User} from "../entity/User"
import { AppDataSource } from "../data-source"
import { Response } from "express"
//import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

// const admin=require("firebase-admin")
const credentials=require('../serviceAccountKey.json')

// admin.initializeApp({
//     credential: admin.credential.cert(credentials)
// })

export const signup=async(req,res,next)=>{
   
try{
    // const userResponse=await admin.auth().createUser({
    //     email:req.body.email,
    //     password:req.body.password,
    //     phoneNumber:req.body.phonenumber,
    //     emailVerified:false,
    //     displayName:req.body.fullname

    // })
    const userRepository = AppDataSource.getRepository(User)
    const foundUser=await userRepository.findOneBy({email:req.body.email,phonenumber:req.body.phoneNumber})
    if(foundUser)
        return res.status(302).json({
            "message":"user already exists."
        })
    const salt=bcrypt.genSaltSync(10)
    const hash=bcrypt.hashSync(req.body.password,salt)
     const user = new User()
    user.fullname = req.body.fullname
    user.email=req.body.email
    user.phonenumber=req.body.phonenumber
    user.isadmin="false"
    user.password=hash
  
    await AppDataSource.manager.save(user)

    res.status(200).json({
    "message":"User signup is succcessful"
   })
 //  console.log(res)
}
catch(err){
    next(err)
}


}
export const signin=async(req,res:Response,next)=>{
   
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
    id:foundUser.id,isadmin:foundUser.isadmin
},process.env.JWT_KEY)
const {password,...importantAttributes}=foundUser
 res.cookie("access-token",token,{
    httpOnly:true
}).status(200).json({
    credentials:importantAttributes
})


}
catch(err){
    next(err)
}

}

