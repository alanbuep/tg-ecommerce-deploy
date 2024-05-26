import { MessagesModel } from "../../models/messages.js"

export default class Message {
    constructor() {
        console.log("Working with mongoDB messages")
    }
    async getAllMesseges() {
        let messages = await MessagesModel.find().lean();
        return messages;
    }

    async getMessageById(id) {
        let message = await MessagesModel.findById(id);
        return message;
    }

    async saveMessage(message) {
        let addMessege = new MessagesModel(message);
        let result = await addMessege.save();
        return result;
    }

    async deleteMessege(id) {
        const result = await MessagesModel.findByIdAndDelete(id);
        return result;
    }
}