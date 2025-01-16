const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 5000;

// Konfigurasi koneksi MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'your_database'
});

db.connect(err => {
    if (err) throw err;
    console.log("Terhubung ke database MySQL!");
});

app.use(bodyParser.json());

// Endpoint untuk menerima data deteksi
app.post('/api/detections', (req, res) => {
    const detections = req.body; // Data deteksi dari frontend

    detections.forEach(detection => {
        const { age, gender, genderProbability, expressions } = detection;

        const sql = `INSERT INTO detections (age, gender, genderProbability, expressions) VALUES (?, ?, ?, ?)`;
        const values = [age, gender, genderProbability, JSON.stringify(expressions)];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Gagal menyimpan data deteksi ke database:", err);
                res.status(500).json({ message: 'Gagal menyimpan data' });
                return;
            }
            console.log("Data deteksi berhasil disimpan ke database:", result);
        });
    });

    res.status(200).json({ message: 'Data deteksi berhasil disimpan' });
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
