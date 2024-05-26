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

export const sendTicket = async (ticket, user, cart) => {
    try {
        console.log("Sending ticket");

        const ticketDetails = `
            <p><strong>Código del ticket:</strong> ${ticket.code}</p>
            <p><strong>Fecha de compra:</strong> ${ticket.purchase_datetime}</p>
            <p><strong>Costo total:</strong> ${ticket.amount}</p>
            <p><strong>Productos comprados:</strong></p>
        `;

        const cartDetails = cart.map(cartItem => `
            <p><strong>Producto:</strong> ${cartItem.product.title}</p>
            <p><strong>Cantidad:</strong> ${cartItem.quantity}</p>
            <p><strong>Precio:</strong> ${cartItem.product.price}</p>
        `).join('');

        await transporter.sendMail({
            from: `Tienda-Gamer <${process.env.EMAIL}>`,
            to: user,
            subject: "Compra Finalizada",
            text: `Gracias por su compra.`,
            html: `
            <p>Hola ${user},</p>
            <p>Gracias por su compra.</p>
            ${ticketDetails}
            ${cartDetails}
        `,
        });

        return ("Correo enviado correctamente");

    } catch (error) {
        console.error("Error al enviar el correo:", error);
        return ("Error al enviar el ticket");
    }
}