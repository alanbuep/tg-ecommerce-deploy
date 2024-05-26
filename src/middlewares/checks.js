import { productsDao } from "../dao/index.dao.js";
import { cartsDao } from "../dao/index.dao.js";

export default async function checkStockProductsCart(req, res, next) {
    try {
        const { cid } = req.params;
        const cart = await cartsDao.getCartById(cid);

        const outOfStockProducts = [];

        for (const cartProduct of cart.products) {
            const quantity = cartProduct.quantity;
            const product = await productsDao.getProductByID(cartProduct.product._id);

            if (product.stock < quantity) {
                outOfStockProducts.push({
                    productId: product._id,
                    productName: product.title,
                    requested: quantity,
                    available: product.stock
                });
            }
        }

        if (outOfStockProducts.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Algunos productos no tienen stock suficiente",
                outOfStockProducts
            });
        }

        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
}