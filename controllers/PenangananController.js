import Intervensi from "../models/PenangananModel.js";
import path from "path";
import fs from "fs";

export const getIntervensi = async (req, res) => {
    try {
        const response = await Intervensi.findAll({
            attributes: ["uuid", "nama", "kategori", "jenisIntervensi", "fileUrl"] // Tambahkan jenisIntervensi
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const getIntervensiById = async (req, res) => {
    try {
        const response = await Intervensi.findOne({
            where: {
                uuid: req.params.id,
                attributes: ["uuid", "nama", "kategori", "jenisIntervensi", "fileUrl"] // Tambahkan jenisIntervensi
            }
        });
        if (!response) return res.status(404).json({ msg: "Intervensi not found" });
        res.json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const getIntervensiByKategori = async (req, res) => {
    try {
        const { kategori } = req.params; // Ambil kategori dari parameter URL

        // Validasi kategori
        const validKategori = ["ringan", "sedang", "berat"];
        if (!validKategori.includes(kategori)) {
            return res.status(422).json({ msg: "Invalid kategori, must be 'ringan', 'sedang', or 'berat'" });
        }

        // Ambil data berdasarkan kategori
        const response = await Intervensi.findAll({
            where: { kategori },
            attributes: ["uuid", "nama", "kategori", "jenisIntervensi", "fileUrl"]
        });

        if (response.length === 0) {
            return res.status(404).json({ msg: `No intervensi found for kategori '${kategori}'` });
        }

        res.json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};


export const createIntervensi = async (req, res) => {
    if (!req.files || !req.files.file) return res.status(400).json({ msg: "No file uploaded" });

    const { nama, kategori, jenisIntervensi } = req.body;
    const file = req.files.file;

    // Validasi kategori dan jenisIntervensi
    const validKategori = ['ringan', 'sedang', 'berat'];
    const validJenisIntervensi = ['distraksi', 'relaksasi'];

    if (!kategori || !validKategori.includes(kategori)) {
        return res.status(422).json({ msg: "Invalid kategori, must be 'ringan', 'sedang', or 'berat'" });
    }

    if (!jenisIntervensi || !validJenisIntervensi.includes(jenisIntervensi)) {
        return res.status(422).json({ msg: "Invalid jenisIntervensi, must be 'distraksi' or 'relaksasi'" });
    }

    const fileExt = path.extname(file.name);
    const fileName = file.md5 + fileExt;
    const fileUrl = `${req.protocol}://${req.get("host")}/files/${fileName}`;

    const allowedFileTypes = ['.mp4', '.mp3', '.png', '.jpg', '.jpeg'];
    if (!allowedFileTypes.includes(fileExt.toLowerCase())) return res.status(422).json({ msg: "Invalid file format" });
    if (file.data.length > 10000000) return res.status(422).json({ msg: "File must be less than 10 MB" });

    file.mv(`./public/files/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });

        try {
            await Intervensi.create({
                nama: nama,
                kategori: kategori,
                jenisIntervensi: jenisIntervensi, // Simpan jenisIntervensi
                file: fileName,
                fileUrl: fileUrl,
                userId: req.userId
            });
            res.status(201).json({ msg: "Intervensi created successfully" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ msg: error.message });
        }
    });
};

export const updateIntervensi = async (req, res) => {
    const intervensi = await Intervensi.findOne({ where: { uuid: req.params.id } });
    if (!intervensi) return res.status(404).json({ msg: "No data found" });

    const { nama, kategori, jenisIntervensi } = req.body;
    let fileName = intervensi.file;
    let fileUrl = intervensi.fileUrl;

    // Validasi jika keduanya kosong
    if (!kategori && !jenisIntervensi) {
        return res.status(422).json({ msg: "Both 'kategori' and 'jenisIntervensi' cannot be empty" });
    }

    // Validasi kategori - harus 'ringan', 'sedang', atau 'berat'
    const validKategori = ['ringan', 'sedang', 'berat'];
    if (kategori && !validKategori.includes(kategori)) {
        return res.status(422).json({ msg: "Invalid kategori, must be 'ringan', 'sedang', or 'berat'" });
    }

    // Validasi jenisIntervensi - harus 'distraksi' atau 'relaksasi'
    const validJenisIntervensi = ['distraksi', 'relaksasi'];
    if (jenisIntervensi && !validJenisIntervensi.includes(jenisIntervensi)) {
        return res.status(422).json({ msg: "Invalid jenisIntervensi, must be 'distraksi' or 'relaksasi'" });
    }

    if (req.files && req.files.file) {
        const file = req.files.file;
        const fileExt = path.extname(file.name);
        fileName = file.md5 + fileExt;
        fileUrl = `${req.protocol}://${req.get("host")}/files/${fileName}`;

        const allowedFileTypes = ['.mp4', '.mp3', '.png', '.jpg', '.jpeg'];
        if (!allowedFileTypes.includes(fileExt.toLowerCase())) return res.status(422).json({ msg: "Invalid file format" });
        if (file.data.length > 10000000) return res.status(422).json({ msg: "File must be less than 10 MB" });

        const oldFilePath = `./public/files/${intervensi.file}`;
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);

        file.mv(`./public/files/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }

    try {
        await Intervensi.update({
            nama: nama,
            kategori: kategori,
            file: fileName,
            fileUrl: fileUrl,
            jenisIntervensi: jenisIntervensi || intervensi.jenisIntervensi, // Gunakan nilai lama jika kosong
        }, { where: { uuid: req.params.id } });

        res.status(200).json({ msg: "Intervensi updated successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};


export const deleteIntervensi = async (req, res) => {
    const intervensi = await Intervensi.findOne({ where: { uuid: req.params.id } });
    if (!intervensi) return res.status(404).json({ msg: "No data found" });

    try {
        const filePath = `./public/files/${intervensi.file}`;
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        await Intervensi.destroy({ where: { uuid: req.params.id } });
        res.status(200).json({ msg: "Intervensi deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};
