import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UsersModel.js";

const { DataTypes } = Sequelize;

const Hasil_Deteksi = db.define('hasil_deteksi', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    dominant_expression: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    gender: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    tingkatNyeri: {
        type: DataTypes.ENUM("ringan", "sedang", "berat"), // Menambahkan nilai valid untuk ENUM
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

}, {
    freezeTableName: true
});

Users.hasMany(Hasil_Deteksi);
Hasil_Deteksi.belongsTo(Users, { foreignKey: 'userId' });

export default Hasil_Deteksi

// (async () => {
//     await db.sync();
// })();