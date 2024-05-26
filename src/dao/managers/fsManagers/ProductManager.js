import utils from "../../../utils.js";
import crypto from "crypto";

export class ProductDaoFs {
    constructor(path) {
        this.path = path;
        this.products = [];
    }

    async addProduct(title, description, code, price, status, stock, category, thumbnail) {

        if (!title || !description || !price || !code || !stock || !category || !status) {
            throw new Error("Todos los campos menos thumbnail son obligarorios");
        }
        try {
            if (!thumbnail) {
                thumbnail = "Not image"
            }
            let data = await utils.readFile(this.path);
            this.products = data?.length > 0 ? data : [];
        } catch (error) {
            throw error;
        }

        const validateCode = this.products.some(product => product.code === code);

        if (validateCode) {
            throw new Error("El campo Code ya se encuentra registrado");
        } else {
            const newProduct = {
                id: crypto.randomUUID(),
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnail,
            };
            this.products.push(newProduct);
            try {
                await utils.writeFile(this.path, this.products);
                return newProduct;
            } catch (error) {
                throw error;
            }
        }
    }

    async getProducts() {
        try {
            let data = await utils.readFile(this.path);
            this.products = data;
            return data?.length > 0 ? this.products : "No hay productos en stock";
        } catch (error) {
            throw error;
        }
    }

    async getProductByID(id) {
        try {
            let products = await this.getProducts();
            const productFound = products.find(product => product.id === id);
            if (productFound) {
                return productFound;
            } else {
                return "Producto no encontrado";
            }
        } catch (error) {
            throw new Error('Error buscando el producto: ' + error.message);
        }
    }

    async updateProduct(id, data) {
        try {
            let products = await this.getProducts();
            let index = products.findIndex(product => product.id === id);
            if (index !== -1) {
                this.products[index] = {
                    ...this.products[index],
                    ...data,
                };
                await utils.writeFile(this.path, products);
                return {
                    mensaje: "Producto actualizado con éxito",
                    producto: this.products[index],
                };
            } else {
                return "Producto no encontrado";
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            let products = await this.getProducts();
            let index = products.findIndex(product => product.id === id);
            if (index !== -1) {
                let product = this.products[index];
                this.products.splice(index, 1);
                await utils.writeFile(this.path, this.products);
                return {
                    mensaje: "Producto eliminado con éxito",
                    producto: product
                };
            } else {
                return "Producto no encontrado";
            }
        } catch (error) {
            throw error;
        }
    }
}

export default { ProductDaoFs };