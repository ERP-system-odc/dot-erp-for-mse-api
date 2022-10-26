import { User } from "../entity/User";
import { Firm } from "../entity/Firm";
import { AppDataSource } from "../data-source";

export const defineFirm=async(req,res,next)=>{
   
    
    try{
        const userRepository=AppDataSource.getRepository(User)
        const firmRepository=AppDataSource.getRepository(Firm)

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

