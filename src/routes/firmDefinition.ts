import express,{Router} from "express";
import { verifyToken,verifyUser } from "../middleware/tokenValidation";
import { defineFirm } from "../controllers/firmDefinition";
import { firmDataValidation } from "../middleware/firmValidation";

const firmDefinitionRouter:Router=express.Router()


firmDefinitionRouter.post('/defineFirm',verifyToken,verifyUser,firmDataValidation,defineFirm)

export {
    firmDefinitionRouter
}