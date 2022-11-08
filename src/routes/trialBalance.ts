import express,{Router} from "express";
import { verifyToken,verifyUser } from "../middleware/tokenValidation";
import { generalLedgerDataValidation } from "../middleware/generalLedgerValidation";
import { generateTrialBalance } from "../controllers/trialBalance";

const trialBalanceManagementRouter:Router=express.Router()

trialBalanceManagementRouter.get('/manage/:starting_date/:ending_date',verifyToken,verifyUser,generalLedgerDataValidation,generateTrialBalance)



export {
    trialBalanceManagementRouter
}

