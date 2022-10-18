import express,{Router} from "express";
import { verifyToken,verifyAdmin,verifyUser } from "../validationSchema/tokenValidation";

const firmDefinitionRouter=express.Router()


firmDefinitionRouter.post('/defineFirm/:userID',verifyToken,verifyUser,(req,res)=>{
    res.json({
        userID:req.params.userID
    })
})

export {
    firmDefinitionRouter
}