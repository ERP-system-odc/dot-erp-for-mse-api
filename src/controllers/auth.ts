import {User} from "../entity/User"
import { AppDataSource } from "../data-source"

const admin=require("firebase-admin")
const credentials=require('../serviceAccountKey.json')

admin.initializeApp({
    credential: admin.credential.cert(credentials)
})

export const signup=async(req,res,next)=>{
   
try{
    const userResponse=await admin.auth().createUser({
        email:req.body.email,
        password:req.body.password,
        phoneNumber:req.body.phonenumber,
        emailVerified:false,
        displayName:req.body.fullname

    })

     const user = new User()
    user.fullname = req.body.fullname
    user.email=req.body.email
    user.phonenumber=req.body.phonenumber
    user.role=req.body.role
    await AppDataSource.manager.save(user)

    res.status(200).json({
    "message":"User signup is succcessful"
   })
}
catch(err){
    next(err)
}


}
export const signin=async(req,res)=>{

}



