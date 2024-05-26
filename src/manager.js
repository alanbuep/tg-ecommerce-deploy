import { ProductManager } from "./dao/managers/fileSystemManager/ProductManager.js";
import { __dirname } from "./utils.js";

console.log("dirname", __dirname);

let tiendaGamer = new ProductManager("/productsList.json");
tiendaGamer.getProducts().then((data) => console.log(data));