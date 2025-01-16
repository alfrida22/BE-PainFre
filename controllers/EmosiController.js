import Emosi from "../models/EmosiModel.js"; // Mengganti Emotion menjadi Emosi
import path from "path"; // Import path untuk mengelola path file
import fs from "fs";

// Mendapatkan semua emosi
export const getEmotions = async (req, res) => {
    try {
        const response = await Emosi.findAll(); // Mengganti Emotion dengan Emosi
        res.json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message }); // Menambahkan respon error
    }
};

// Mendapatkan emosi berdasarkan ID
export const getEmotionById = async (req, res) => {
    try {
        const response = await Emosi.findOne({ // Mengganti Emotion dengan Emosi
            where: {
                id: req.params.id
            }
        });
        if (!response) return res.status(404).json({ msg: "Emotion not found" }); // Menambahkan penanganan error jika tidak ditemukan
        res.json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message }); // Menambahkan respon error
    }
};

// Membuat emosi baru
export const createEmotion = async (req, res) => {
    if (req.files && req.files.imageFile) {
        console.log("Image File Name:", req.files.imageFile.name);
    }    

    const nama = req.body.title; // Kolom 'nama' di model
    const imageFile = req.files.imageFile; // File gambar
    const audioFile = req.files.audioFile; // File audio

    // Validasi dan simpan gambar
    const imageExt = path.extname(imageFile.name);
    const imageName = imageFile.md5 + imageExt;
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${imageName}`; // Kolom 'imageUrl' di model
    const allowedImageTypes = ['.png', '.jpg', '.jpeg'];
    if (!allowedImageTypes.includes(imageExt.toLowerCase())) return res.status(422).json({ msg: "Invalid image format" });
    if (imageFile.data.length > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

    // Validasi dan simpan audio
    const audioExt = path.extname(audioFile.name);
    const audioName = audioFile.md5 + audioExt;
    const audioUrl = `${req.protocol}://${req.get("host")}/audios/${audioName}`; // Kolom 'audioUrl' di model
    const allowedAudioTypes = ['.mp3', '.wav'];
    if (!allowedAudioTypes.includes(audioExt.toLowerCase())) return res.status(422).json({ msg: "Invalid audio format" });
    if (audioFile.data.length > 10000000) return res.status(422).json({ msg: "Audio must be less than 10 MB" });

    // Pindahkan file gambar dan audio ke folder public
    imageFile.mv(`./public/images/${imageName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });

        audioFile.mv(`./public/audios/${audioName}`, async (err) => {
            if (err) return res.status(500).json({ msg: err.message });

            try {
                // Simpan data emosi ke database
                await Emosi.create({ // Mengganti Emotion dengan Emosi
                    nama: nama,
                    image: imageName, // Kolom 'image' di model
                    imageUrl: imageUrl,
                    audio: audioName, // Kolom 'audio' di model
                    audioUrl: audioUrl
                });
                res.status(201).json({ msg: "Emotion created successfully" });
            } catch (error) {
                console.log(error.message);
                res.status(500).json({ msg: error.message });
            }
        });
    });
};

// Memperbarui emosi
export const updateEmotion = async (req, res) => {
    const emotion = await Emosi.findOne({ // Mengganti Emotion dengan Emosi
        where: {
            id: req.params.id
        }
    });
    if (!emotion) return res.status(404).json({ msg: "No data found" });

    const nama = req.body.title;
    let imageName = emotion.image;
    let audioName = emotion.audio;
    let imageUrl = emotion.imageUrl;
    let audioUrl = emotion.audioUrl;

    if (req.files && req.files.imageFile) {
        const imageFile = req.files.imageFile;
        const imageExt = path.extname(imageFile.name);
        imageName = imageFile.md5 + imageExt;
        imageUrl = `${req.protocol}://${req.get("host")}/images/${imageName}`;

        const allowedImageTypes = ['.png', '.jpg', '.jpeg'];
        if (!allowedImageTypes.includes(imageExt.toLowerCase())) return res.status(422).json({ msg: "Invalid image format" });
        if (imageFile.data.length > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

        const oldImagePath = `./public/images/${emotion.image}`;
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);

        imageFile.mv(`./public/images/${imageName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }

    if (req.files && req.files.audioFile) {
        const audioFile = req.files.audioFile;
        const audioExt = path.extname(audioFile.name);
        audioName = audioFile.md5 + audioExt;
        audioUrl = `${req.protocol}://${req.get("host")}/audios/${audioName}`;

        const allowedAudioTypes = ['.mp3', '.wav'];
        if (!allowedAudioTypes.includes(audioExt.toLowerCase())) return res.status(422).json({ msg: "Invalid audio format" });
        if (audioFile.data.length > 10000000) return res.status(422).json({ msg: "Audio must be less than 10 MB" });

        const oldAudioPath = `./public/audios/${emotion.audio}`;
        if (fs.existsSync(oldAudioPath)) fs.unlinkSync(oldAudioPath);

        audioFile.mv(`./public/audios/${audioName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }

    try {
        await Emosi.update({ // Mengganti Emotion dengan Emosi
            nama: nama,
            image: imageName,
            imageUrl: imageUrl,
            audio: audioName,
            audioUrl: audioUrl
        }, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: "Emotion updated successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Failed to update emotion" });
    }
};

// Menghapus emosi
export const deleteEmotion = async (req, res) => {
    const emotion = await Emosi.findOne({ // Mengganti Emotion dengan Emosi
        where: {
            id: req.params.id
        }
    });
    if (!emotion) return res.status(404).json({ msg: "no data found" });

    try {
        // Hapus file gambar
        const imagePath = `./public/images/${emotion.image}`;
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

        // Hapus file audio
        const audioPath = `./public/audios/${emotion.audio}`;
        if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);

        // Hapus data dari database
        await Emosi.destroy({ // Mengganti Emotion dengan Emosi
            where: {
                id: req.params.id
            }
        });

        res.status(200).json({ msg: "Emotion deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Failed to delete emotion" });
    }
};
