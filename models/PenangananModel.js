import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Users from "./UsersModel.js";

// const { DataTypes } = Sequelize;

const Penanganan = db.define("penanganan", {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    nama: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },

    kategori: {
        type: DataTypes.ENUM("ringan", "sedang", "berat"), // Menambahkan nilai valid untuk ENUM
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    jenisIntervensi: {
        type: DataTypes.ENUM("distraksi", "relaksasi"),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    file: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    fileUrl: {
        type: DataTypes.STRING,
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

},{
    freezeTableName: true
});

Users.hasMany(Penanganan);
Penanganan.belongsTo(Users, { foreignKey: 'userId' });

export default Penanganan