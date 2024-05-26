import ProductsDaoDb from "./managers/dbManagers/products.js";
import CartsDaoDb from "./managers/dbManagers/carts.js";
import { ProductDaoFs } from "./managers/fsManagers/ProductManager.js";
import CartsDaoFs from "./managers/fsManagers/Cart.js";
import UsersDaoDb from "./managers/dbManagers/users.js";
import { UserDaoFs } from "./managers/fsManagers/UserManager.js";
import TicketDao from "./managers/dbManagers/ticket.js";
import { PERSISTENCE } from "../config/config.js";

export const productsDao = PERSISTENCE === "MONGO" ? new ProductsDaoDb() : new ProductDaoFs();

export const usersDao = PERSISTENCE === "MONGO" ? new UsersDaoDb() : new UserDaoFs();

export const cartsDao = PERSISTENCE === "MONGO" ? new CartsDaoDb() : new CartsDaoFs();

export const ticketDao = new TicketDao();