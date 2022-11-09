import express,{Router} from "express";
import { verifyToken,verifyUser } from "../middleware/tokenValidation";
import { generalLedgerDataValidation } from "../middleware/generalLedgerValidation";
import { generateIncomeStatement } from "../controllers/incomeStatement";

const incomeStatementManagementRouter:Router=express.Router()

incomeStatementManagementRouter.get('/manage/:starting_date/:ending_date',verifyToken,verifyUser,generalLedgerDataValidation,generateIncomeStatement)



export {
    incomeStatementManagementRouter
}

