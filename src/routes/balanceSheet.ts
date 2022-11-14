import express,{Router} from "express";
import { verifyToken,verifyUser } from "../middleware/tokenValidation";
import { generalLedgerDataValidation } from "../middleware/generalLedgerValidation";
import { generateBalanceSheet } from "../controllers/balanceSheet";


const balanceSheetManagementRouter:Router=express.Router()

balanceSheetManagementRouter.get('/manage/:starting_date/:ending_date',verifyToken,verifyUser,generalLedgerDataValidation,generateBalanceSheet)



export {
    balanceSheetManagementRouter
}

