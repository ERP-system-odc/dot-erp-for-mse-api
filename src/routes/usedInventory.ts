import express,{Router} from "express";
import { DefineUsedInventory } from "../controllers/inventoryUsedManagment";
import { inventoryUsedDataValidation } from "../middleware/usedInventoryValidation";
const usedInventoryRouter:Router=express.Router()


usedInventoryRouter.post('/defineUsedInventory',inventoryUsedDataValidation,DefineUsedInventory)

export {
    usedInventoryRouter
}   