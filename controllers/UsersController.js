import User from "../models/UsersModel.js";
import argon2 from "argon2";
import { verifyUser } from "../middleware/AuthUser.js";

export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll();
        //attributes: ['uuid', 'nama', 'email', 'role']
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }

}

export const getUserById = async (req, res) => {
    try {
        const response = await User.findOne({
            //attributes: ['uuid', 'nama', 'email', 'role'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }

}

export const createUser = async (req, res) => {
    const { nama, email, password, role } = req.body;

      // Validasi password
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(password)) {
          return res.status(400).json({ msg: "Password harus mengandung minimal 8 karakter, kombinasi huruf, angka, dan karakter khusus." });
      }

    try {
        // Cek apakah sudah ada pengguna dengan nama, email, dan password yang sama
        const existingUser = await User.findOne({
            where: {
                nama: nama,
                email: email,
            }
        });

        // Jika pengguna ditemukan, kirim respon error
        if (existingUser) {
            const isPasswordMatch = await argon2.verify(existingUser.password, password);
            if (isPasswordMatch) {
                return res.status(400).json({ msg: "Pengguna dengan kombinasi nama, email, dan password ini sudah terdaftar" });
            }
        }

        const hashPassword = await argon2.hash(password);

        await User.create({
            nama: nama,
            email: email,
            password: hashPassword,
            role: role
        });
        res.status(201).json({ msg: "Register Berhasil" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}


export const updateUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    const { nama, email, password, role } = req.body;
    let hashPassword;
    if (password === "" || password === null) {
        hashPassword = user.password
    } else {
        hashPassword = await argon2.hash(password);
    }
    try {
        await User.update({
            nama: nama,
            email: email,
            password: hashPassword,
            role: role
        }, {
            where: {
                id: user.id
            }
        });
        res.status(200).json({ msg: "User Updated" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const deleteUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    try {
        await User.destroy({
            where: {
                id: user.id
            }
        });
        res.status(200).json({ msg: "User deleted" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}