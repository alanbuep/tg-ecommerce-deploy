import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { generateTokenLink } from "../../utils.js";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORDEMAIL,
    }, tls: {
        rejectUnauthorized: false,
    },
});

export const mailRestore = async (req, res) => {
    try {
        const { user } = req.session;
        console.log("mail restore");
        console.log(user);
        const token = generateTokenLink(user);
        const resetLink = `http://localhost:8080/restorepassword?token=${token}`;
        await transporter.sendMail({
            from: `Tienda-Gamer <${process.env.EMAIL}>`,
            to: user,
            subject: "Restablecer contraseña",
            text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
            html: `<p>Hola ${user},</p><p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
        });

        res.json({ status: "success", message: "Correo enviado correctamente" });

    } catch (error) {
        console.error("Error al enviar el correo:", error);
        res.status(500).json({ status: "error", message: "Error al enviar el correo" });
    }
};