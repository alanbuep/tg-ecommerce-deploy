import mongoose from "mongoose";

const messagesCollection = "messages";

const messagesSchema = mongoose.Schema({
    user: { type: String, require: true },
    message: { type: String, require: true },
    timestamp: { type: Date, require: true },
})

export const MessagesModel = mongoose.model(messagesCollection, messagesSchema);