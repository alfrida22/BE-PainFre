import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UsersModel.js";

const { DataTypes } = Sequelize;

const Emotion = db.define('emosi', {
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

    image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    audio: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    audioUrl: {
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

}, {
    freezeTableName: true
});

Users.hasMany(Emotion);
Emotion.belongsTo(Users, { foreignKey: 'userId' });

export default Emotion

// (async () => {
//     await db.sync();
// })();