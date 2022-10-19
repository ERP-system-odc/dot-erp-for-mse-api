import { Router } from "express";
import postcontroller from "../controllers/inventorycontroller"
const router = Router()
router.post('/post',  postcontroller.postPost)

export default router;