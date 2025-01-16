// routes/emotionRoutes.js
import express from "express";
import {
    getEmotions,
    getEmotionById,
    createEmotion,
    updateEmotion,
    deleteEmotion
} from "../controllers/EmotionController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/emotions', verifyUser, getEmotions);
router.get('/emotions/:id', verifyUser, getEmotionById);
router.post('/emotions', verifyUser, adminOnly, createEmotion);
router.patch('/emotions/:id', verifyUser, adminOnly, updateEmotion);
router.delete('/emotions/:id', verifyUser, adminOnly, deleteEmotion);

export default router;
