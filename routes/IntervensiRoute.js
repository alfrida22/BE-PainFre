import express from "express";
import {
    getIntervensi,
    getIntervensiById,
    createIntervensi,
    updateIntervensi,
    deleteIntervensi
} from "../controllers/IntervensiController.js";

const router = express.Router();

router.get("/intervensi", getIntervensi);
router.get("/intervensi/:id", getIntervensiById);
router.post("/intervensi", createIntervensi);
router.patch("/intervensi/:id", updateIntervensi);
router.delete("/intervensi/:id", deleteIntervensi);

export default router;
