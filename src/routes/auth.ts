import express,{Router} from "express";
import {signup,signin} from "../controllers/auth"
import {signinDataValidation,signupDataValidation} from "../middleware/authValidation"


const authRouter:Router=express.Router()


authRouter.post('/signup',signupDataValidation,signup)
authRouter.post('/signin',signinDataValidation,signin)


export {
    authRouter
}