import { productsDao } from "../dao/index.dao.js";
import CustomError from "../services/customError.js";
import enumErrors from "../services/enumError.js";
import { generateAddProductErrorInfo } from "../services/infoError.js";

async function getProducts(req, res) {
    const { limit } = req.query;
    try {
        const products = await productsDao.getProducts();
        if (limit) {
            let productsLimit = products.slice(0, Number(limit));
            res.json({
                data: productsLimit,
                limit: limit,
                quantity: productsLimit.length
            });
        } else {
            res.json({
                data: products,
                limit: false
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos');
    }
}

async function getProductsByID(req, res) {
    const { pid } = req.params || req;
    console.log(pid)
    try {
        const product = await productsDao.getProductByID(pid);
        if (product) {
            res.json({ message: "Success", data: product });
        } else {
            res.status(404).json({
                message: "El producto solicitado no existe",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error interno del servidor",
            data: error,
        });
    }
};

async function saveProduct(req, res, next) {
    try {
        console.log(req.body)
        console.log(req.session)
        const product = req.body;
        const user = req.session.user;
        console.log(product);
        if (!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category) {
            CustomError.createError({
                name: "Error al crear el producto",
                cause: generateAddProductErrorInfo(product),
                message: "Uno o más campos son inválidos",
                code: enumErrors.ADD_PRODUCT_ERROR,
            });
        }
        if (!product.thumbnail) {
            product.thumbnail = "Not image"
        }
        if (!user) {
            product.owner = user;
        }else{
            product.owner = "admin";
        }
        const productSaved = await productsDao.saveProduct(product);
        console.log("El owner: " + product.owner)
        console.log(" Guardo el producto: ")
        console.log(productSaved);
        res.status(200).json({ message: "Producto cargado con éxito", data: product });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        });
    }
};

async function updateProduct(req, res) {
    const { pid } = req.params;
    const { productToUpdated } = req.body;
    try {
        const productFind = await getProductsByID(pid)
        if (productFind) {
            const productUpdated = await productsDao.updateProduct(pid, productToUpdated);
            res.status(200).json({
                message: "Producto actualizado con éxito",
                data: respuestaDB
            });
        } else {
            res.status(404).json({
                message: "El producto solicitado no existe",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        });
    }
}

async function deleteProduct(req, res) {
    try {
        const { pid } = req.params;
         // const user = req.user || res.session;
        let product = await productsDao.getProductByID(pid);
        if (product) {
            // if (product.owner === user) {
            const respuesta = await productsDao.deleteProduct(pid);
            console.log("Producto eliminado con exito: ", respuesta)
            // }
            res.status(200).json({
                message: "Producto eliminado con éxito",
                data: product
            });
        } else {
            res.status(404).json({
                message: "El producto solicitado no existe",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        });
    }
}

export { getProducts, getProductsByID, saveProduct, updateProduct, deleteProduct };