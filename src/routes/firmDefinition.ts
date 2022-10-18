import express,{Router} from "express";
import { verifyToken,verifyAdmin,verifyUser } from "../validationSchema/tokenValidation";
import { defineFirm } from "../controllers/firmDefinition";
import { firmDataValidation } from "../middleware/firmValidation";

const firmDefinitionRouter=express.Router()


firmDefinitionRouter.post('/defineFirm/:userID',verifyToken,verifyUser,firmDataValidation,defineFirm)

export {
    firmDefinitionRouter
}