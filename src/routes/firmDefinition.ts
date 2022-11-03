import express,{Router} from "express";
import { verifyToken,verifyUser } from "../middleware/tokenValidation";
import { defineFirm } from "../controllers/firmDefinition";
import { firmDataValidation } from "../middleware/firmValidation";
import { provideChartInfo } from "../middleware/charts";

const firmDefinitionRouter:Router=express.Router()


firmDefinitionRouter.post('/defineFirm',verifyToken,verifyUser,firmDataValidation,defineFirm)
firmDefinitionRouter.get("/chartDefinition",verifyToken,verifyUser,provideChartInfo)

export {
    firmDefinitionRouter
}   