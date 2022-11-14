import { User } from "../entity/User";
import { Firm } from "../entity/Firm";
import { AppDataSource } from "../data-source";
import { JournalEntry } from "../entity/journalEntry";

export const defineFirm=async(req,res,next)=>{
   
    
    try{
        const userRepository=AppDataSource.getRepository(User)
        const firmRepository=AppDataSource.getRepository(Firm)
        const journalEntryRepository=AppDataSource.getRepository(JournalEntry)

        const user_id=req.user.id
        const userFound=await userRepository.findOneBy({id:user_id})
        if(!userFound)
        return res.status(404).json({
            "status":404,
            "message":"user isn't found"
        })
        if(userFound.is_starter===false)
        return res.status(404).json({
            "status":404,
            "message":"User business is already setup"
        })
        const ifFirmExists=await firmRepository.findOneBy({business_name:req.body.business_name,tin_number:req.body.tin_number})
        if(ifFirmExists)
        return res.status(400).json({
            "status":400,
            message:"Firm already exists"
        })
        let firm=new Firm()
        firm.business_name=req.body.business_name 
        firm.business_type="manufacturing"
        firm.business_sub_type=req.body.business_sub_type
        firm.initial_capital=req.body.business_capital
        firm.current_capital=req.body.business_capital
        firm.tin_number=req.body.tin_number
        firm.user=userFound

       

        await firmRepository.save(firm)

        userFound.is_starter=false

        await userRepository.save(userFound)
        
        const journalEntry=new JournalEntry()
        journalEntry.account="Cash"
        journalEntry.debit=req.body.business_capital
        journalEntry.credit=0
        journalEntry.firm=firm
        journalEntry.transaction_reason="Added cash to the business"
        journalEntry.transaction_type="{-ASSET-}(Cash)"
        
        journalEntryRepository.save(journalEntry)

        const journalEntrySecond=new JournalEntry()
        journalEntrySecond.account="Common Stock"
        journalEntrySecond.debit=0
        journalEntrySecond.credit=req.body.business_capital
        journalEntrySecond.firm=firm
        journalEntrySecond.transaction_reason="Paid cash to increase the common stock"
        journalEntrySecond.transaction_type="{-EQUITY-}(Common Stock)"
        
        journalEntryRepository.save(journalEntrySecond)
    
        res.status(200).json({
            "status":200,
            "message":"Firm creation is successful",
            "firm":firm
           })  

    }
    catch(err){
        next(err)
    }
}

