import { ProductsModel } from "../../models/products.js";
import CustomError from "../../../services/customError.js";
import enumErrors from "../../../services/enumError.js";
import { generateFindProductErrorInfo } from "../../../services/infoError.js";

export default class ProductsDao {
    constructor() {
        console.log("Working with mongoDB")
    }
    async getProducts() {
        let products = await ProductsModel.find().lean();
        return products;
    }

    async getProductByID(id) {
        let product = await ProductsModel.findById(id);
        if (!product) {
            CustomError.createError({
                name: "Error al buscar el producto",
                cause: generateFindProductErrorInfo(id),
                message: "Producto no encontrado",
                code: enumErrors.FIND_PRODUCT_ERROR,
            });
        }
        return product;
    }

    async saveProduct(product) {
        let addProduct = new ProductsModel(product);
        let result = await addProduct.save();
        return result;
    }

    async updateProduct(id, product) {
        const result = await ProductsModel.updateOne({ _id: id }, product);
        return result;
    }

    async deleteProduct(id) {
        const result = await ProductsModel.findByIdAndDelete(id);
        return result;
    }
}