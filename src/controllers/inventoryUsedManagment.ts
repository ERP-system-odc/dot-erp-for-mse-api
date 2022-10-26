import { getRepository } from "typeorm";
import { Request,Response,NextFunction } from "express";
import { InventoryUsed } from "../entity/inventoryUsed";
import { InventoryType } from "../entity/InventoryType";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/product";
export const DefineUsedInventory = async ( req,res,next)=> {
     try{

      const usedInventoryRepository = AppDataSource.getRepository(InventoryUsed)
      const productRepository = AppDataSource.getRepository(Product)


      const inventory_id = req.InventoryType.id
      const inventoryFound=await usedInventoryRepository.findOneBy({id:inventory_id})
      if(!inventoryFound)
        return res.status(404).json({
            "status":404,
            "message":"no inventory found "
        })
     else{
        let uI=new InventoryUsed()
            uI.iu_name=req.body.iu_name ,
            uI.iu_quantity=req.body.iu_quantity
            
     }
            
    //  const ifFirmExists=await usedInventoryRepository.findOneBy({iu_name:req.body.iu_name,iu_quantity:req.body.iu_name})
        
            

    
     }
     catch(err){
        next(err)
    }
     } 
