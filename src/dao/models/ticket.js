import mongoose from "mongoose";
const { Schema } = mongoose;

const ticketCollection = "tickets";

const ticketSchema = new Schema({
    code: { type: String, required: true, unique: true },
    purchase_datetime: { type: Date, required: true, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true },
    cart: [{
        product: { type: Schema.Types.ObjectId, ref: 'products', required: true },
        quantity: { type: Number, required: true }
    }]
});

export const TicketModel = mongoose.model(ticketCollection, ticketSchema);