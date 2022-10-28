import express,{Router} from "express";
import { verifyToken,verifyUser } from "../middleware/tokenValidation";
import { createExpense,getAllExpenses} from "../controllers/ExpenseManagment";
import { expenseDataValidation } from "../middleware/expenseValidation";

const expenseRouter:Router=express.Router()


expenseRouter.post('/define/expense',verifyToken,verifyUser,expenseDataValidation,createExpense,getAllExpenses)

export {
    expenseRouter
}   
