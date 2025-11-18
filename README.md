Backend untuk website PainFree adalah sebuah sistem deteksi nyeri anak berbasis web dengan fitur intervensi, game edukasi, dan penyimpanan progres pengguna. Dibangun menggunakan Express.js, MySQL, dan session-based authentication.

Fitur Utama
Autentikasi & Session Login
Login, logout, register
Session-based authentication menggunakan express-session
Middleware untuk proteksi route

CRUD Data
User: register, login, update profil
Pain Detection: simpan hasil deteksi, riwayat, hapus
Intervensi: upload file (gambar/video/audio), get by kategori, update, delete
Progress Game: simpan progres, unlock level, reset

Lock Level System
Pengguna baru otomatis mulai dari Level 1 (unlocked)
Level berikutnya terbuka hanya setelah level sebelumnya selesai
Backend memvalidasi akses tiap level
Penyimpanan progres di database
