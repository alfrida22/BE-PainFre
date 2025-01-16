// routes/emotionRoutes.js
import express from "express";
import {
    getEmotions,
    getEmotionById,
    createEmotion,
    updateEmotion,
    deleteEmotion
} from "../controllers/EmosiController.js";

const router = express.Router();

router.get('/emotions', getEmotions);
router.get('/emotions/:id', getEmotionById);
router.post('/emotions', createEmotion);
router.patch('/emotions/:id', updateEmotion);
router.delete('/emotions/:id', deleteEmotion);

export default router;
