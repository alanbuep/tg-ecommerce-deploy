import { Router } from "express";
import { addCart, addProductToCart, addProductToUserCart, deleteCart, deleteProductCart, getCartById, getCarts, updateCart, updateProductQuantity } from "../controller/carts.controller.js";
import authUser from "../middlewares/authUser.js";
import checkStockProductsCart from "../middlewares/checks.js";
import { processPayment } from "../middlewares/mercadoPago.js";
import { generateMercadoPagoPreference } from "../middlewares/mercadoPago.js";

const router = Router();

router.get("/", getCarts);

router.get("/:cid", authUser, getCartById);

router.post("/", addCart);

router.post("/:cid/products/:pid", addProductToCart);

router.post("/products/:pid", authUser, addProductToUserCart);

router.delete("/:cid", deleteCart);

router.delete("/:cid/products/:pid", deleteProductCart);

router.put("/:cid", updateCart);

router.put("/:cid/products/:pid", updateProductQuantity);

router.get("/:cid/purchase", checkStockProductsCart, processPayment);

router.post("/create-preference", generateMercadoPagoPreference);

export default router;