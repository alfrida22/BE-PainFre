// routes/grafik.js
const express = require('express');
const router = express.Router();
const { HasilDeteksi } = require('../models/Hasil_Deteksi.js');
const sequelize = require('sequelize');

// Fungsi untuk mengatur warna berdasarkan ekspresi dan tingkat nyeri
const getColorForExpressionPain = (expression, painLevel) => {
    if (expression === 'neutral') return 'gray';
    if (expression === 'happy') return 'green';
    if (expression === 'angry') return 'red';
    if (expression === 'surprised') return 'yellow';
    return 'blue';
};

// API untuk mengambil data deteksi dan menyiapkan grafik
router.get('/grafik-ekspresi-nyeri-line', async (req, res) => {
    try {
        const hasilDeteksi = await HasilDeteksi.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'], // Ambil tanggal dari createdAt
                'dominant_expression',
                'tingkatNyeri',
                [sequelize.fn('COUNT', sequelize.col('dominant_expression')), 'count']
            ],
            group: ['date', 'dominant_expression', 'tingkatNyeri'], // Kelompokkan berdasarkan tanggal, ekspresi, dan tingkat nyeri
            order: [[sequelize.col('date'), 'ASC']]  // Urutkan berdasarkan tanggal
        });

        const expressions = ['neutral', 'happy', 'angry', 'surprised'];
        const painLevels = ['Ringan', 'Sedang', 'Berat'];
        const expressionPainCounts = expressions.map(expr => (
            painLevels.map(level => ({
                label: `${expr} - ${level}`,
                data: [],
                fill: false,
                borderColor: getColorForExpressionPain(expr, level),
                tension: 0.1
            }))
        )).flat();

        const chartData = [];
        hasilDeteksi.forEach(item => {
            const date = item.dataValues.date;
            const expression = item.dataValues.dominant_expression;
            const painLevel = item.dataValues.tingkatNyeri;
            const count = item.dataValues.count;

            expressionPainCounts.forEach(exprPain => {
                if (exprPain.label === `${expression} - ${painLevel}`) {
                    const index = chartData.findIndex(data => data === date);
                    if (index === -1) {
                        chartData.push(date);  // Menambahkan tanggal jika belum ada
                    }
                    exprPain.data.push(count);
                }
            });
        });

        chartData.sort();  // Urutkan tanggal
        res.json({ chartData, expressionPainCounts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
