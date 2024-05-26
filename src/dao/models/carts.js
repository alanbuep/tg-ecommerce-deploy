import mongoose from "mongoose";
const { Schema } = mongoose;

const cartsCollection = "carts";

const CartsSchema = new Schema({
    timestamp: { type: Date, require: true },
    products: [{
        product: { type: Schema.Types.ObjectId, ref: 'products' },
        quantity: Number
    }]
})

export const CartsModel = mongoose.model(cartsCollection, CartsSchema);