import { Sequelize } from "sequelize";

const db = new Sequelize('pain_free', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

export default db;