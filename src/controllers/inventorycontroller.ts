import { Request,Response } from "express";
import { getRepository } from "typeorm";
import {Inventory} from "../entity/inventory"
class postcontroller {
    static postPost = async (req:Request,res:Response) => {
        const newRecord = {
            materialName:req.body.materialName,
            quantit:req.body.quantity, 
            unit:req.body.unit,
            price:req.body.price,
            leastCriticalAmount:req.body.leastCriticalAmount,
            expense:req.body.expense} = req.body

    const inventory = getRepository(Inventory).create(newRecord)
    const result = await getRepository(Inventory).save(inventory)
           return res.json(result)
            }
}

export default postcontroller