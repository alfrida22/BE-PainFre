import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Intervensi = db.define("intervensi", {
    nama: DataTypes.STRING,
    kategori: DataTypes.ENUM('ringan', 'sedang', 'berat'), // Menggunakan ENUM untuk kategori
    file: DataTypes.STRING,
    fileUrl: DataTypes.STRING,
}, {
    freezeTableName: true
});

export default Intervensi;

// Sinkronisasi tabel untuk membuatnya jika belum ada
(async () => {
    await db.sync();
})();