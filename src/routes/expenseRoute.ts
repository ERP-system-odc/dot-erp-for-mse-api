import express,{Router} from "express";
import { verifyToken,verifyUser } from "../middleware/tokenValidation";
import { createExpense,getAllExpenses} from "../controllers/expenseManagement";
import { expenseDataValidation } from "../middleware/expenseValidation";

const expenseRouter:Router=express.Router()

expenseRouter.get("/manage",verifyToken,verifyUser,getAllExpenses)
expenseRouter.post('/manage',verifyToken,verifyUser,expenseDataValidation,createExpense)

export {
    expenseRouter
}   
