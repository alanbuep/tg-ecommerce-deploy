import { cartsDao } from '../dao/index.dao.js';
import { calculateCartTotal } from '../controller/carts.controller.js';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.MPTOKEN;

async function processPayment(req, res, next) {
    try {
        const { cid } = req.params;
        const cart = await cartsDao.getCartById(cid);
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Carrito no encontrado"
            });
        }
        const total = await calculateCartTotal(cart);

        res.status(200).json({
            success: true,
            total: total,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al procesar el pago",
            error: error.message
        });
    }
}

async function generateMercadoPagoPreference(req, res) {
    try {
        console.log("MercadoPago Preference")
        const client = new MercadoPagoConfig({ accessToken: TOKEN });

        console.log(req.body.title)
        console.log(req.body.quantity)
        console.log(req.body.price)
        console.log(req.body.cartId)
        console.log(req.session.user)
        const cid = req.body.cartId;

        const body = {
            items: [
                {
                    title: req.body.title,
                    quantity: Number(req.body.quantity),
                    unit_price: Number(req.body.price),
                    currency_id: "ARS",
                }
            ],
            back_urls: {
                "success": `http://localhost:8080/finalizePurchase/${cid}`,
                "failure": "https://www.coderhouse.com/ar/",
                "pending": "https://www.coderhouse.com/ar/"
            },
            auto_return: "approved",
        };

        const preference = new Preference(client);
        const result = await preference.create({ body });
        res.json({
            id: result.id,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error al generar la preferencia de Mercado Pago",
        });
    }
}

export { processPayment, generateMercadoPagoPreference };
