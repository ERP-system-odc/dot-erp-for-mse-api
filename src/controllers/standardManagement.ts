import { User } from "../entity/User";
import { Firm } from "../entity/Firm";
import { Standard } from "../entity/Standard";
import { StandardSetting } from "../entity/StandardSettings";
import { AppDataSource } from "../data-source";



export const getAllStandards=async(req,res,next)=>{
    try{
        const userRepository=AppDataSource.getRepository(User)   
        const foundUser=await userRepository.findOneBy({id:req.user.id}) 
        const firmRepository=AppDataSource.getRepository(Firm)
        const standardRepository=AppDataSource.getRepository(Standard)
        const standardSettingRepository=AppDataSource.getRepository(StandardSetting)

        const foundFirm=await firmRepository.findOneBy({user:foundUser})
      
        if(!foundFirm)
            return res.status(404).json({
                "status":404,
                "message":"firm isn't found"
                })
        const foundStandard=await standardRepository.find({
           where:{
            firm:foundFirm
           }
        })
        res.status(200).json({
            status:200,
            standard:foundStandard
        })
    }
    catch(err){
        next(err)
    }
}

export const getOneStandard=async(req,res,next)=>{
    try{
        const userRepository=AppDataSource.getRepository(User)   
        const foundUser=await userRepository.findOneBy({id:req.user.id}) 
        const firmRepository=AppDataSource.getRepository(Firm)
        const standardRepository=AppDataSource.getRepository(Standard)
        const standardSettingRepository=AppDataSource.getRepository(StandardSetting)

        const foundFirm=await firmRepository.findOneBy({user:foundUser})
       
        const standardID=req.params.standardID
        
        if(!foundFirm)
            return res.status(404).json({
                "status":404,
                "message":"firm isn't found"
                })
        const standard=await standardRepository.findOneBy({id:standardID})
      
        if(!standard)
        return res.status(404).json({
            "status":404,
            "message":"Standard isn't found"
            })
        const foundStandard=await standardRepository.find({
          relations:{
            standard_settings:true
          },
          where:{
            firm:foundFirm,
            standard_name:standard.standard_name
            
          }        

        })
        res.status(200).json({
            status:200,
            standard:foundStandard
        })
    }
    catch(err){
        next(err)
    }
}
export const createStandard=async(req,res,next)=>{
    try{
        const userRepository=AppDataSource.getRepository(User)   
        const foundUser=await userRepository.findOneBy({id:req.user.id}) 
        const firmRepository=AppDataSource.getRepository(Firm)
        const standardRepository=AppDataSource.getRepository(Standard)
        const standardSettingRepository=AppDataSource.getRepository(StandardSetting)

        const foundFirm=await firmRepository.findOneBy({user:foundUser})
       
        if(!foundFirm)
            return res.status(404).json({
                "status":404,
                "message":"firm isn't found"
                })
        const foundStandard=await standardRepository.findOneBy({standard_name:req.body.standard_name,firm:foundFirm})
        if(foundStandard)
        return res.status(303).json({
            "status":303,
            "message":"Standard already exists"
            }) 
        const standard=new Standard()
        standard.standard_name=req.body.standard_name
        standard.firm=foundFirm
    
        await standardRepository.save(standard)
    
        req.body.standard_items.forEach(async element=>{
            const inventoryItem=new StandardSetting()
            inventoryItem.inventory_name=element.inventory_name
            inventoryItem.inventory_quantity=element.inventory_quantity
            inventoryItem.standard=standard
            await standardSettingRepository.save(inventoryItem)
        })
        res.status(200).json({
            status:200,
            "message":"Standard saved successfully"
        })

    }
    catch(err){
        next(err)
    }


}
export const updateStandard=async (req,res,next)=>{
    try{
        const userRepository=AppDataSource.getRepository(User)   
        const foundUser=await userRepository.findOneBy({id:req.user.id}) 
        const firmRepository=AppDataSource.getRepository(Firm)
        const standardRepository=AppDataSource.getRepository(Standard)
        const standardSettingRepository=AppDataSource.getRepository(StandardSetting)
        //const inventoryTypeRepository=AppDataSource.getRepository(InventoryType)
        const foundFirm=await firmRepository.findOneBy({user:foundUser})
      
        const standardID=req.params.standardID
        
        if(!foundFirm)
            return res.status(404).json({
                "status":404,
                "message":"firm isn't found"
                })
        const standard=await standardRepository.findOneBy({id:standardID})
      
        if(!standard)
        return res.status(404).json({
            "status":404,
            "message":"Standard isn't found"
            })
        if(standard.standard_name!==req.body.standard_name){
            const foundStandard=await standardRepository.find({where:{standard_name:req.body.standard_name,firm:foundFirm}})
            
            if(foundStandard!=null)
            return res.status(303).json({
                "status":303,
                "message":"Standard exists"
                })
            standard.standard_name=req.body.standard_name
            await standardRepository.save(standard)
                
        }
       
        const foundStandardSettings=await standardSettingRepository.find({
            where:{
                standard:standard
            }
        })
        await standardSettingRepository.remove(foundStandardSettings)
        req.body.standard_items.forEach(async element=>{
            const inventoryItem=new StandardSetting()
            inventoryItem.inventory_name=element.inventory_name
            inventoryItem.inventory_quantity=element.inventory_quantity
            inventoryItem.standard=standard
            await standardSettingRepository.save(inventoryItem)
            
        })

        res.status(200).json({
            status:200,
            "message":"Standard updated successfully"
        })



    }
    catch(err){
        next(err)
    }
}

export const deleteStandard=async (req,res,next)=>{
    try{
        const userRepository=AppDataSource.getRepository(User)   
        const foundUser=await userRepository.findOneBy({id:req.user.id}) 
        const firmRepository=AppDataSource.getRepository(Firm)
        const standardRepository=AppDataSource.getRepository(Standard)
        const standardSettingRepository=AppDataSource.getRepository(StandardSetting)
       
        const foundFirm=await firmRepository.findOneBy({user:foundUser})
       
        const standardID=req.params.standardID
        
        if(!foundFirm)
            return res.status(404).json({
                "status":404,
                "message":"firm isn't found"
                })
        const standard=await standardRepository.findOneBy({id:standardID})
       
        if(!standard)
        return res.status(404).json({
            "status":404,
            "message":"Standard isn't found"
            })
        await standardRepository.remove(standard)
        res.status(200).json({
            status:200,
            "message":"Standard deleted successfully"
        })

    }
    catch(err){
        next(err)
    }
}