import { ProductsModel } from "../dao/models/products.js";
import { cartsDao, ticketDao } from "../dao/index.dao.js";
import { getCarts, getCartById, calculateCartTotal } from "../controller/carts.controller.js";
import { productsDao } from "../dao/index.dao.js";

async function getPaginateProducts(req, res) {
    try {
        const { limit, page, query, sort } = req.query;
        const isSorted = () => {
            if (sort === "asc") {
                return 1;
            } else {
                return -1;
            }
        };

        const parsedQuery = () => {
            if (query) {
                const queryObj = JSON.parse(query);
                return queryObj;
            }
            return {};
        };

        const productsData = await ProductsModel.paginate(parsedQuery(), {
            limit: limit || 2,
            page: page || 1,
            sort: sort ? { price: isSorted() } : null,
            lean: true,
        });

        const { docs, hasPrevPage, hasNextPage, totalPages, prevPage, nextPage } = productsData;

        const products = docs;
        const user = req.session.user;

        res.render("products", {
            title: "Listado de productos",
            products: products,
            style: "css/styles.css",
            scriptName: "products.js",
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevPage: prevPage,
            currentPage: productsData.page,
            nextPage: nextPage,
            user: user,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        }
        )
        console.log(error)
    }
}

async function realtimePaginate(req, res) {
    try {
        const { limit, page, query, sort } = req.query;
        const isSorted = () => {
            if (sort === "asc") {
                return 1;
            } else {
                return -1;
            }
        };

        const parsedQuery = () => {
            if (query) {
                const queryObj = JSON.parse(query);
                return queryObj;
            }
            return {};
        };

        const productsData = await ProductsModel.paginate(parsedQuery(), {
            limit: limit || 2,
            page: page || 1,
            sort: sort ? { price: isSorted() } : null,
            lean: true,
        });

        const { docs, hasPrevPage, hasNextPage, totalPages, prevPage, nextPage } = productsData;

        const products = docs;
        const user = req.session.user;

        res.render("realtime", {
            title: "Administrador de productos",
            products: products,
            style: "css/styles.css",
            scriptName: "realtime.js",
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevPage: prevPage,
            currentPage: productsData.page,
            nextPage: nextPage,
            user: user,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        }
        )
        console.log(error)
    }
}

async function chatView(req, res) {
    res.render("chat", {
        title: "Chat",
        style: "css/styles.css",
        scriptName: "chat.js",
    });
}

async function cartsView(req, res) {
    try {
        const carts = await getCarts();
        console.log(carts)
        res.render("carts", {
            title: "Carritos",
            carts: carts,
            style: "css/styles.css",
        });

    } catch (error) {
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        })
        console.log(error)
    }
}

async function cartsByIdView(req, res) {
    try {
        const { cid } = req.params;
        const user = req.session.user;
        const cart = await cartsDao.getCartById(cid);
        console.log(cart)
        const total = await calculateCartTotal(cart);
        res.render("cart", {
            title: "Carrito",
            cart: cart,
            scriptName: "checkout.js",
            style: "../css/styles.css",
            user: user,
            total: total,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        })
        console.log(error)
    }
}

async function finalizeView(req, res) {
    try {
        console.log("El ticket id es:")
        console.log(req.ticketId)
        const tid = req.ticketId;
        const user = req.session.user;
        const ticket = await ticketDao.getTicketById(tid);

        res.render("finalize", {
            title: "Compra Finalizada",
            ticket: ticket,
            user: user,
            scriptName: "finalize.js",
            style: "../css/styles.css",
        });

    } catch (error) {
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        })
        console.log(error)
    }
}

export { getPaginateProducts, realtimePaginate, chatView, cartsView, cartsByIdView, finalizeView };