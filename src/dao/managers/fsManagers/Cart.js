import crypto from "crypto";
import utils from "../../../utils.js";
import { productsDao } from "../../index.dao.js";

export default class CartsDaoFs {
    static carts;
    constructor(path) {
        this.path = path;
        this.carts = [];
    }

    addCart = async () => {
        try {
            let data = await utils.readFile(this.path);
            this.carts = data?.length > 0 ? data : [];
            const id = crypto.randomUUID();

            const newCart = {
                id,
                timestamp: Date.now(),
                products: [],
            }

            this.carts.push(newCart);
            await utils.writeFile(this.path, this.carts);
            return newCart;
        } catch (error) {
            throw error;
        }

    };

    getCarts = async () => {
        try {
            let data = await utils.readFile(this.path);
            this.carts = data;
            return data?.length > 0 ? this.carts : "No hay carritos";
        } catch (error) {
            throw error;
        }
    };

    getCartById = async (id) => {
        try {
            let data = await utils.readFile(this.path);
            this.carts = data || [];
            let cart = this.carts.find((dato) => dato.id === id);

            return cart || `No existe el carrito ${id}`;

        } catch (error) {
            throw error;
        }
    };

    addProductToCart = async (cid, pid) => {
        try {
            const cart = await this.getCartById(cid);
            if (!cart) {
                return "Carrito no encontrado";
            }
            const productToAdd = await productsDao.getProductByID(pid);
            console.log(productToAdd)
            const { products } = cart;
            const index = products.findIndex(
                (product) => product.product.id === productToAdd.id
            );

            if (index !== -1) {
                products[index].quantity++;
            } else {
                products.push({
                    product: productToAdd,
                    quantity: 1,
                });
            }
            await this.updateCart(cart);
            return cart;
        } catch (error) {
            throw error;
        }
    };

    updateCart = async (cart) => {
        const { id } = cart;
        try {
            const carts = await this.getCarts();
            const index = carts.findIndex((carrito) => carrito.id === id);
            if (index === -1) {
                return "Carrito no encontrado, no es posible actualizarlo";
            }

            carts.splice(index, 1, cart);
            const response = await utils.writeFile(this.path, carts);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteCart(id) {
        try {
            let carts = await this.getCarts();
            let index = carts.findIndex(cart => cart.id === id);
            if (index !== -1) {
                let cart = this.carts[index];
                this.carts.splice(index, 1);
                await utils.writeFile(this.path, this.carts);
                return {
                    mensaje: "Carrito eliminado con éxito",
                    producto: cart
                };
            } else {
                return "Carrito no encontrado";
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteProductCart(id, productId) {
        try {
            const cart = await this.getCartById(id);
            if (!cart) {
                return "Carrito no encontrado";
            }
            const productToDelete = await productsDao.getProductByID(productId);
            console.log(productToDelete)
            const { products } = cart;
            const index = products.findIndex(
                (product) => product.product.id === productToDelete.id
            );

            if (index !== -1) {
                products.splice(index, 1);
                await this.updateCart(cart);
            }
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async updateProductQuantity(id, productId, quantity) {
        try {
            const cart = await this.getCartById(id);
            if (!cart) {
                return "Carrito no encontrado";
            }
            const productToUpdate = await productsDao.getProductByID(productId);
            console.log(productToUpdate)
            const { products } = cart;
            const index = products.findIndex(
                (product) => product.product.id === productToUpdate.id
            );

            if (index !== -1) {
                products[index].quantity = quantity;
                await this.updateCart(cart);
            }
            return cart;
        } catch (error) {
            throw error;
        }
    }

}