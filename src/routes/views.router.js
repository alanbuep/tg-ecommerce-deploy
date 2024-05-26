import { Router } from "express";
import authUser from "../middlewares/authUser.js";
import authAdmin from "../middlewares/authAdmin.js";

import { cartsByIdView, cartsView, chatView, getPaginateProducts, realtimePaginate, finalizeView } from "../controller/views.controller.js";
import { finalizePurchase } from "../controller/purchase.controller.js";
import checkStockProductsCart from "../middlewares/checks.js";

const router = Router();

router.get("/", getPaginateProducts);

router.get("/products", getPaginateProducts);

router.get("/realtime", authAdmin, realtimePaginate);

router.get("/chat", authUser, chatView);

router.get("/carts", cartsView);

router.get("/carts/:cid", cartsByIdView);

router.get("/finalizePurchase/:cid", checkStockProductsCart, finalizePurchase, finalizeView)

export default router;