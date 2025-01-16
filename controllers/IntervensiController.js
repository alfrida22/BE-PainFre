import Intervensi from "../models/IntervensiModel.js";
import path from "path";
import fs from "fs";

export const getIntervensi = async (req, res) => {
    try {
        const response = await Intervensi.findAll();
        res.json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getIntervensiById = async (req, res) => {
    try {
        const response = await Intervensi.findOne({
            where: { 
                id: req.params.id 
            }
        });
        if (!response) return res.status(404).json({ msg: "Intervensi not found" });
        res.json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createIntervensi = async (req, res) => {
    if (!req.files || !req.files.file) return res.status(400).json({ msg: "No file uploaded" });

    const { nama, kategori } = req.body;
    const file = req.files.file;

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
                file: fileName,
                fileUrl: fileUrl
            });
            res.status(201).json({ msg: "Intervensi created successfully" });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    });
};

export const updateIntervensi = async (req, res) => {
    const intervensi = await Intervensi.findOne({ where: { id: req.params.id } });
    if (!intervensi) return res.status(404).json({ msg: "No data found" });

    const { nama, kategori } = req.body;
    let fileName = intervensi.file;
    let fileUrl = intervensi.fileUrl;

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
            fileUrl: fileUrl
        }, { where: { id: req.params.id } });
        res.status(200).json({ msg: "Intervensi updated successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteIntervensi = async (req, res) => {
    const intervensi = await Intervensi.findOne({ where: { id: req.params.id } });
    if (!intervensi) return res.status(404).json({ msg: "No data found" });

    try {
        const filePath = `./public/files/${intervensi.file}`;
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        await Intervensi.destroy({ where: { id: req.params.id } });
        res.status(200).json({ msg: "Intervensi deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
