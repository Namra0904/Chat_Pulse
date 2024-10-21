import { Router } from "express";
import protect from "../middleware/AuthMiddleware.js";
import MessageController from "../controllers/MessageController.js";
const router = Router()

router.post('/', protect, MessageController.sendMessage)
router.get("/:chatId", protect, MessageController.allMessage);


export default router;