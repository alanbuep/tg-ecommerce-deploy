import { TicketModel } from "../../models/ticket.js";

export default class TicketDao {
    constructor() { }

    async createTicket(cart, user, total) {
        try {
            const newTicket = new TicketModel({
                code: `TCK-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
                purchase_datetime: new Date(),
                amount: total,
                purchaser: user,
                cart: cart.products.map(cartProduct => ({
                    product: cartProduct.product._id,
                    quantity: cartProduct.quantity
                }))
            });

            const savedTicket = await newTicket.save();

            return {
                success: true,
                message: "Compra finalizada con éxito",
                ticket: savedTicket
            };
        } catch (error) {
            return {
                success: false,
                message: "Error interno del servidor",
                error: error.message
            };
        }
    }

    async getAllTickets() {
        try {
            const tickets = await TicketModel.find().lean();
            return tickets;
        } catch (error) {
            throw new Error("Error al obtener los tickets: " + error.message);
        }
    }

    async getTicketById(ticketId) {
        try {
            const ticket = await TicketModel.findById(ticketId).populate('cart.product').lean();
            if (!ticket) {
                throw new Error("Ticket no encontrado");
            }
            return ticket;
        } catch (error) {
            throw new Error("Error al obtener el ticket: " + error.message);
        }
    }
}