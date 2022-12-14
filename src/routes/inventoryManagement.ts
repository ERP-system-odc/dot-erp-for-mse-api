import express,{Router} from "express";
import { verifyToken,verifyUser } from "../middleware/tokenValidation";
import { inventoryDataValidation } from "../middleware/inventoryValidation";
import { createInventory,getAllInventories} from "../controllers/inventoryManagement";

const inventoryManagementRouter:Router=express.Router()

inventoryManagementRouter.get('/manage',verifyToken,verifyUser,getAllInventories)
inventoryManagementRouter.post('/manage',verifyToken,verifyUser,inventoryDataValidation,createInventory)


export {
    inventoryManagementRouter
}



