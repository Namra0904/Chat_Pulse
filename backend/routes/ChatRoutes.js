import { Router } from "express";
import chatController from "../controllers/ChatController.js";
import protect from "../middleware/AuthMiddleware.js";
// import { Router } from "express";

const router = Router()

router.post("/", protect, chatController.accessChat)
router.get("/", protect, chatController.fetchChats);
router.post("/group", protect, chatController.createGroup);
router.put("/rename", protect, chatController.renameGroup);
router.put("/removeFromGroup", protect, chatController.removeFromGroup);
router.put("/groupAdd",protect,chatController.addToGroup)

export default router