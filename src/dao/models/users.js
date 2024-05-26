import mongoose from "mongoose";
const { Schema } = mongoose;

const userCollection = "users";

const UserSchema = new mongoose.Schema({
    first_name: { type: String, require: true, max: 100 },
    last_name: { type: String, require: true, max: 100 },
    email: { type: String, require: true, max: 100 },
    password: { type: String, require: true, max: 100 },
    birth: { type: Date, require: true },
    role: { type: String, require: true, max: 100 },
    cart: { type: Schema.Types.ObjectId, ref: 'Cart' },
    documents: [{
        name: { type: String },
        reference: { type: String },
    }],
    last_connection: { type: Date },
});

export const UserModel = mongoose.model(userCollection, UserSchema);