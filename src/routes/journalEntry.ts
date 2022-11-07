import express,{Router} from "express";
import { verifyToken,verifyUser } from "../middleware/tokenValidation";
import {journalEntryDataValidation} from "../middleware/journalEntryValidation"
import { getJournalEntry } from "../controllers/journalEntry";

const journalEntryManagementRouter:Router=express.Router()

journalEntryManagementRouter.get('/manage/:journalDate',verifyToken,verifyUser,journalEntryDataValidation,getJournalEntry)



export {
    journalEntryManagementRouter
}

