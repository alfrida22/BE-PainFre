import Hasil_Deteksi from "../models/Hasil_Deteksi.js";

// Fungsi untuk mengambil hasil deteksi berdasarkan userId
export const getHasilDeteksi = async (req, res) => {
    const { userId } = req.params; // Ambil userId dari parameter URL

    try {
        const deteksi = await Hasil_Deteksi.findAll({
            where: { userId },
        });

        if (deteksi.length === 0) {
            return res.status(404).json({ message: 'Data deteksi tidak ditemukan.' });
        }

        return res.status(200).json({
            message: 'Data deteksi ditemukan.',
            data: deteksi,
        });
    } catch (error) {
        console.error('Error mengambil hasil deteksi:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
};


// Fungsi untuk menyimpan hasil deteksi
export const simpanHasilDeteksi = async (req, res) => {
    const { dominant_expression, gender, tingkatNyeri } = req.body;

    try {
        // Log input data yang diterima
        console.log('Data yang diterima:', req.body);

        // Simpan hasil deteksi ke dalam database
        const deteksi = await Hasil_Deteksi.create({
            dominant_expression,
            gender,
            tingkatNyeri,
            userId: req.userId
        });

        return res.status(201).json({
            message: 'Hasil deteksi berhasil disimpan!',
            data: deteksi,
        });
    } catch (error) {
        console.error('Error menyimpan hasil deteksi:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
    }
};

// Fungsi untuk mengambil data deteksi untuk grafik
export const getDeteksiGrafik = async (req, res) => {
    // const { userId } = req.params; // Ambil userId dari parameter URL

    try {
        const deteksi = await Hasil_Deteksi.findAll({
            where: { userId },
            attributes: ['createdAt', 'dominant_expression', 'tingkatNyeri'],
            order: [['createdAt', 'ASC']], // Mengurutkan berdasarkan tanggal
            userId: req.userId
        });

        if (deteksi.length === 0) {
            return res.status(404).json({ message: 'Data deteksi tidak ditemukan.' });
        }

        // Proses data untuk grafik
        const chartData = processDeteksiForChart(deteksi);

        return res.status(200).json({
            message: 'Data grafik berhasil ditemukan.',
            data: chartData,
        });
    } catch (error) {
        console.error('Error mengambil data untuk grafik:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
};

// Fungsi untuk memproses data deteksi menjadi format untuk grafik
const processDeteksiForChart = (deteksi) => {
    const expressions = ['neutral', 'happy', 'angry', 'surprised', 'sad', 'disgusted', 'fearful']; // Contoh ekspresi
    const painLevels = ['Ringan', 'Sedang', 'Berat']; // Contoh tingkat nyeri

    // Mengelompokkan data berdasarkan ekspresi dan tingkat nyeri
    const chartData = [];

    expressions.forEach((expr) => {
        painLevels.forEach((level) => {
            const filteredData = deteksi.filter(
                (item) => item.dominant_expression === expr && item.tingkatNyeri === level
            );

            const dataForLevel = {
                label: `${expr} - ${level}`,
                data: [],  // Data jumlah per tanggal
                fill: false,
                borderColor: getColorForExpressionPain(expr, level),
                tension: 0.1,
            };

            // Menghitung jumlah deteksi per tanggal
            const dates = [...new Set(filteredData.map(item => new Date(item.createdAt).toISOString().split('T')[0]))]; // Unik tanggal

            dates.forEach((date) => {
                const count = filteredData.filter(item => new Date(item.createdAt).toISOString().split('T')[0] === date).length;
                dataForLevel.data.push(count);
            });

            chartData.push(dataForLevel);
        });
    });

    return chartData;
};

// Fungsi untuk memilih warna berdasarkan ekspresi dominan dan tingkat nyeri
const getColorForExpressionPain = (expression, painLevel) => {
    switch (expression) {
        case 'neutral': return 'gray';
        case 'happy': return 'green';
        case 'angry': return 'red';
        case 'surprised': return 'yellow';
        case 'sad': return 'blue';
        case 'disgusted': return 'purple';
        case 'fearful': return 'orange';
        default: return 'blue';
    }
};

// filepath: /d:/SEMESTER 5 MAGANG/Final/backend/controllers/Hasil_DeteksiController.js
// export const simpanHasilDeteksi = async (req, res) => {
//     const { dominant_expression, gender, tingkatNyeri } = req.body;
//     const userId = req.session.userId; // Ambil userId dari sesi

//     if (!userId) {
//         return res.status(401).json({ message: "Unauthorized" });
//     }

//     try {
//         // Log input data yang diterima
//         console.log('Data yang diterima:', req.body);

//         // Simpan hasil deteksi ke dalam database
//         const deteksi = await Hasil_Deteksi.create({
//             userId,
//             dominant_expression,
//             gender,
//             tingkatNyeri
//         });

//         return res.status(201).json(deteksi);
//     } catch (error) {
//         console.error('Error menyimpan hasil deteksi:', error);
//         return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
//     }
// };
