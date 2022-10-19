import { User } from "../entity/User";
import { Firm } from "../entity/Firm";
import { AppDataSource } from "../data-source";

export const defineFirm=async(req,res,next)=>{
   
    
    try{
        const userRepository=AppDataSource.getRepository(User)
        const firmRepository=AppDataSource.getRepository(Firm)

        const user_id=req.params.userID
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
        let firm=new Firm()
        firm.business_name=req.body.business_name
        firm.business_type="manufacturing"
        firm.business_sub_type=req.body.business_sub_type
        firm.business_capital=req.body.business_capital
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

