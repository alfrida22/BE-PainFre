import express from "express";
import { simpanHasilDeteksi, getHasilDeteksi, getDeteksiGrafik} from "../controllers/Hasil_DeteksiController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

// Route untuk menyimpan hasil deteksi
router.post("/deteksi", verifyUser, simpanHasilDeteksi);

// Route untuk mengambil hasil deteksi berdasarkan userId
router.get("/deteksi/:userId", verifyUser, getHasilDeteksi);

// Route untuk mengambil data deteksi untuk grafik
router.get('/grafik/:userId', verifyUser, getDeteksiGrafik);  // Menambahkan route untuk grafik

export default router;
