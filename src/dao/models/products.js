import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productsCollection = "products";

const ProductsSchema = new mongoose.Schema({
    title: { type: String, require: true },
    description: { type: String, require: true },
    code: { type: String, require: true, unique: true },
    price: { type: Number, require: true },
    status: { type: Boolean, require: true },
    stock: { type: Number, require: true },
    category: { type: String, require: true },
    thumbnail: { type: String, require: false },
    owner: { type: mongoose.Schema.Types.String, ref: 'users', required: true },
});

ProductsSchema.plugin(paginate);

export const ProductsModel = mongoose.model(productsCollection, ProductsSchema);