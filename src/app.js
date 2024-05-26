import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import cors from "cors";
import Message from "./dao/managers/dbManagers/messages.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
import loginRouter from "./routes/login.router.js";
import sessionRouter from "./routes/session.router.js";
import usersRouter from "./routes/users.router.js";
import signupRouter from "./routes/signup.router.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import { generateToken, passportCall, authorization, } from "./utils.js";
import { getProducts, getProductsByID, saveProduct, updateProduct, deleteProduct } from "./controller/products.controller.js";
import { addLogger } from "./middlewares/logger.mid.js";
import { mailRestore } from "./services/mail/restore.password.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const DB_URL = process.env.DB_URL; /* || "mongodb://localhost:27017/ecommerce" */

const chatDB = new Message();


let visitas = 0;
let messages = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Conexion con base de datos
const environment = async () => {
    mongoose
        .connect(DB_URL)
        .then(() => {
            console.log("Base de datos conectada")
        })
        .then(async () => {
            const result = await chatDB.getAllMesseges();
            messages = result;
        })
        .catch((error) => {
            console.log("Error en la conexión con la base de datos", error)
        });
};

environment();

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Desafio_Documantacion_API",
            version: "1.0.0",
            description: "desafio 13",
            contact: {
                name: "Coderhouse",
            },
            servers: ["http://localhost:8080"],
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJsdoc(swaggerOptions);

app.use(
    session({
        store: MongoStore.create({
            mongoUrl: DB_URL,
            ttl: 90,
        }),
        secret: process.env.CODERSECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/users', usersRouter);
app.use("/", viewsRouter);

app.use("/", sessionRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);

app.use(addLogger);
app.get('/loggerTest', (req, res) => {
    req.logger.debug('Debug message');
    req.logger.http('HTTP message');
    req.logger.info('Info message');
    req.logger.warn('Warning message');
    req.logger.error('Error message');
    req.logger.log('fatal', 'Fatal message');
    res.send('Logging test realizado');
});

initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

// app.get("/api/sessions/current", passportCall("jwt"), authorization("admin"), (req, res) => {
//     res.status(200).json(req.user);
// });

app.get("/messages", (req, res) => {
    res.json(messages);
});

const server = app.listen(PORT, () => {
    console.log(`Server is running in port:${PORT}`);
});

// Conexion websocket
const io = new Server(server);

io.on("connection", (socket) => {
    console.log("nuevo cliente conectado ");
    socket.on("addProduct", async (req) => {
        console.log(req)
        const product = req.body;
        const title = product.title;
        const description = product.description;
        const code = product.code;
        const price = product.price;
        const status = product.status;
        const stock = product.stock;
        const category = product.category;
        const thumbnail = product.thumbnail;
        const owner = req.user;
        try {
            let productToSave = {
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnail,
                owner,
            };
            const result = await saveProduct(productToSave);
            const allProducts = await getProducts();
            // console.log(allProducts);
            result && io.emit("updateProducts", allProducts);
        } catch (err) {
            console.log(err);
        }
    });

    socket.on("deleteProduct", async (productToDelete) => {
        console.log(productToDelete);
        try {
            const result = await deleteProduct(productToDelete);
            const allProducts = getProducts();
            console.log(allProducts);
            result && io.emit("updateProducts", allProducts);
        } catch (err) {
            console.log(err);
        }
    });

    socket.on("new-user", async (data) => {
        console.log("nuevo cliente conectado", data.user);
        socket.user = data.user;
        socket.id = data.id;
        visitas++;
        socket.broadcast.emit("new-user-connected", {
            message: `Se ha conectado un nuevo usuario: ${visitas}`,
            user: data.user,
        });
        io.emit("messageLogs", messages);
    });

    socket.on("message", async (data) => {
        let newMessage = { ...data, timestamp: new Date() }
        messages.push({ ...data, id: socket.id, date: new Date().toISOString() });
        io.emit("messageLogs", messages);
        try {
            const result = await chatDB.saveMessage(newMessage);
        } catch (err) {
            console.log(err);
        }
    });
});