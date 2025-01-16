import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Emosi = db.define('emotion', {
    nama: DataTypes.STRING,
    image: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    audio: DataTypes.STRING,
    audioUrl: DataTypes.STRING
}, {
    freezeTableName: true
});

export default Emosi;

// Sinkronisasi tabel untuk membuatnya jika belum ada
(async () => {
    await db.sync();
})();
