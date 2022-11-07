import moment from "moment";
import { JournalEntry } from "../entity/journalEntry";
import { User } from "../entity/User";
import { Firm } from "../entity/Firm";
import { AppDataSource } from "../data-source";
import {Raw,Like} from "typeorm";
import { request } from "http";
import { Alias } from "typeorm/query-builder/Alias";
import {add,format} from "date-fns"


export const getJournalEntry=async (req,res,next)=>{
const journalEntryRepository=AppDataSource.getRepository(JournalEntry)
const userRepository=AppDataSource.getRepository(User)
const foundUser=await userRepository.findOneBy({id:req.user.id})
const firmRepository=AppDataSource.getRepository(Firm)





const foundFirm=await firmRepository.findOneBy({user:foundUser})
if(!foundFirm)
return res.status(404).json({
    "status":404,
    "message":"firm isn't found"
})
let  date = new Date();

    
let day=req.params.journalDate
let dates=req.params.journalDate.split("-")
let result = add(new Date(parseInt(dates[0]), parseInt(dates[1]), parseInt(dates[2])), {
    years: 0,
    months: -1,
    days: 1
  })
  let secondDate=format(result, 'yyyy-MM-d')


let foundJournalEntry=await journalEntryRepository.find({
    where:{
        created_at:Raw((alias) => `${alias} > :date` && `${alias} < :date2` , { date: day,date2:secondDate }),
        firm:foundFirm
    }
})



if(!foundJournalEntry)
return res.status(404).json({
    "status":404,
    "message":"Journal entry on the specific date not found"
})
res.status(200).json({
    "status":200,
    "data":foundJournalEntry
})

}