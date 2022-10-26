import express,{Router} from "express";
import { verifyToken,verifyUser } from "../middleware/tokenValidation";
import { standardDataValidation } from "../middleware/standardValidation";
import { createStandard,getAllStandards,getOneStandard,updateStandard,deleteStandard} from "../controllers/standardManagement";

const standardManagementRouter:Router=express.Router()

standardManagementRouter.get('/manage/:standardID',verifyToken,verifyUser,getOneStandard)
standardManagementRouter.get('/manage',verifyToken,verifyUser,getAllStandards)
standardManagementRouter.post('/manage',verifyToken,verifyUser,standardDataValidation,createStandard)
standardManagementRouter.put("/manage/:standardID",verifyToken,verifyUser,standardDataValidation,updateStandard)
standardManagementRouter.delete("/manage/:standardID",verifyToken,verifyUser,deleteStandard)

export {
    standardManagementRouter
}