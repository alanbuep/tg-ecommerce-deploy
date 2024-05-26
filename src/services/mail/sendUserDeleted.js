import nodemailer from "nodemailer";
import dotenv from "dotenv";

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

export const sendUserDeleted = async (user) => {
    try {
        console.log("Sending warning");

        await transporter.sendMail({
            from: `Tienda-Gamer <${process.env.EMAIL}>`,
            to: user,
            subject: "Cuenta eliminada.",
            text: `Gracias por su tiempo con nosotros.`,
            html: `
            <p>Hola ${user},</p>
            <p>Por inactividad, su usuario ha sido eliminado.</p>
        `,
        });

        return ("Correo enviado correctamente");

    } catch (error) {
        console.error("Error al enviar el aviso:", error);
        return ("Error al enviar el aviso");
    }
}