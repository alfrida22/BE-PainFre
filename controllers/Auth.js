import Users from "../models/UsersModel.js";
import argon2d from "argon2";


export const Login = async (req, res) => {
    const user = await Users.findOne({
        where: {
                email: req.body.email
            }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    const match = await argon2d.verify(user.password, req.body.password);
    if(!match) return res.status(400).json({msg: "Password Salah"});
    req.session.userId = user.uuid;
    const uuid = user.uuid;
    const nama = user.nama;
    const email = user.email;
    const role = user.role;
    res.status(200).json({uuid, nama, email, role});
}

export const Me = async (req, res)=>{
    if(!req.session.userId){
        return res.status(401).json({msg: "Mohon login ke akun Anda!"});
    }
    const user = await Users.findOne({
        attributes:['uuid', 'nama', 'email', 'role'],
        where: {
                uuid: req.session.userId
            }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    res.status(200).json(user);
}

export const Logout = (req, res) => {
    if (req.session) { // Pastikan session ada
        req.session.destroy((err) => { // Hapus session
            if (err) return res.status(400).json({ msg: "Tidak berhasil logout" });
            res.status(200).json({ msg: "Berhasil logout" });
        });
    } else {
        res.status(400).json({ msg: "Tidak ada session untuk dihapus" });
    }
};