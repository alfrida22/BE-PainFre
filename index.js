import express from "express";
import cors from "cors";
//import UserRoute from "./routes/UserRoute.js";
//import EmotionRoute from "./routes/EmosiRoute.js";
import UsersRoute from "./routes/UsersRoute.js";
import EmotionRoute from "./routes/EmotionRoute.js";
import Hasil_DeteksiRoute from "./routes/Hasil_DeteksiRoute.js"
// import IntervensiRoute from "./routes/IntervensiRoute.js";
import IntervensiRoute from "./routes/PenangananRoute.js";
// import Hasil_DeteksiRoute from "./routes/Hasil_DeteksiRoute.js";
import fileUpload from "express-fileupload"; // Impor fileUpload
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import db from "./config/Database.js";
import AuthRoute from "./routes/AuthRoute.js";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';
dotenv.config()
import { google } from "googleapis";

const app = express();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3000/auth/google/callback'
)

const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
]

const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true,
})

// google login
app.get('/auth/google', (req, res) => {
    res.redirect(authorizationUrl);
})



const sessionStore = SequelizeStore(session.Store);
// Mendapatkan direktori saat ini dengan menggunakan import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const store = new sessionStore({
    db: db
});

// Sinkronisasi database dengan `alter: true` untuk menambahkan kolom baru
db.sync({ alter: true })
    .then(() => {
        console.log("All models were synchronized successfully.");
    })
    .catch((err) => {
        console.error("Failed to sync models:", err);
    });

(async () => {
    await db.sync();
})();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use(fileUpload()); // Tambahkan middleware untuk menangani upload file
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
// Middleware untuk menyajikan file statis dari folder public
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/audios', express.static(path.join(__dirname, 'public/audios')));
app.use('/files', express.static(path.join(__dirname, 'public/files')));


//app.use(UserRoute);
//app.use(EmotionRoute);
app.use(UsersRoute);
app.use(EmotionRoute);
app.use(IntervensiRoute);
app.use(Hasil_DeteksiRoute);
app.use(AuthRoute);

store.sync();

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running...');
});






