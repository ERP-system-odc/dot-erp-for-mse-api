import express,{Router} from "express";
import {signup,signin} from "../controllers/auth"
import {authDataValidation} from "../middleware/authValidation"


const authRouter=express.Router()


authRouter.post('/signup',authDataValidation,signup)
//authRouter.post('/signin')


module.exports=authRouter