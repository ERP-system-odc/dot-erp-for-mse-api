import express,{Router} from "express";
import { verifyToken,verifyUser } from "../middleware/tokenValidation";
import { generalLedgerDataValidation } from "../middleware/generalLedgerValidation";
import { generateGeneralLedger } from "../controllers/generalLedger";

const generalLedgerManagementRouter:Router=express.Router()

generalLedgerManagementRouter.get('/manage/:starting_date/:ending_date',verifyToken,verifyUser,generalLedgerDataValidation,generateGeneralLedger)



export {
    generalLedgerManagementRouter
}

