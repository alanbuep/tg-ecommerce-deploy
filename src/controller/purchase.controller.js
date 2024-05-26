import { cartsDao, usersDao } from "../dao/index.dao.js";
import { productsDao } from "../dao/index.dao.js";
import { ticketDao } from "../dao/index.dao.js";
import { calculateCartTotal } from "./carts.controller.js";
import { sendTicket } from "../services/mail/sendTicket.js";

async function finalizePurchase(req, res, next) {
    try {
        const { cid } = req.params;
        const user = req.session.user;

        const cart = await cartsDao.getCartById(cid);
        const total = await calculateCartTotal(cart);

        const result = await ticketDao.createTicket(cart, user, total);
        const ticketId = result.ticket._id;
        req.ticketId = ticketId;

        const userToUpdate = await usersDao.getUserByEmail(user);
        userToUpdate.cart = null;
        await usersDao.updateUser(userToUpdate._id, userToUpdate);
        await cartsDao.deleteCart(cid);

        const sendResult = await sendTicket(result.ticket, user, cart.products);
        console.log(sendResult);

        for (const cartProduct of cart.products) {
            const product = cartProduct.product;
            product.stock -= cartProduct.quantity;
            await productsDao.updateProduct(product._id, { stock: product.stock });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al finalizar la compra",
            error: error.message
        });
    }
}

export { finalizePurchase };