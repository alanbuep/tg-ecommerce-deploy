import supertest from "supertest";
import { expect } from "chai";

// const expect = chai.expect;
const requester = supertest("http://localhost:8080");

let temporalTestCartID = "";

describe("Test ecommerce", () => {
    describe("Testing Router Products", () => {
        console.log("Testing Router Products");

        it("El endpoint GET /api/products debe entregar productos paginados", async () => {
            const result = await requester.get("/api/products");

            console.log("Result GET /api/products");
            console.log(result.body);
            console.log(result.statusCode);
            console.log(result.ok);
            console.log("###################################");
        });

        it("El endpoint POST /api/products debe crear un producto", async () => {

            const product = {
                title: "Test product",
                description: "Testing",
                code: "TEST",
                price: 1000000,
                status: true,
                stock: 100,
                category: "Testing",
                thumbnail: "",
                owner: "admin",
            }

            const result = await requester.post("/api/products").send(product);

            expect(result.ok);

            console.log("Result POST /api/products");
            console.log(result.body);
            console.log(result.statusCode);
            console.log(result.ok);
            console.log("###################################");
        });

        it("El endpoint GET /api/products/pid debe buscar el producto por id", async () => {

            const result = await requester.get("/api/products");

            expect(result.ok);

            const products = result.body.data;
            const productToFind = products.find((product) => product.code === "TEST");
            expect(productToFind.ok);
            const id = productToFind._id;
            const productByID = await requester.get(`/api/products/${id}`).send();

            console.log("Result GET by ID /api/products/pid");
            console.log(productByID.body);
            console.log(productByID.statusCode);
            console.log(productByID.ok);
            console.log("###################################");
        });

        it("El endpoint DELETE /api/products/pid debe eliminar el producto por id", async () => {

            const result = await requester.get("/api/products");

            expect(result.ok);

            const products = result.body.data;

            const productToFind = products.find((product) => product.code === "TEST");

            expect(productToFind.ok);
            const id = productToFind._id;

            const productToDelete = await requester.delete(`/api/products/${id}`).send();

            console.log("Result DELETE /api/products/pid");
            console.log(productToDelete.body);
            console.log(productToDelete.statusCode);
            console.log(productToDelete.ok);
            console.log("###################################");
        });

    });

    describe("Testing Router Carts", () => {
        console.log("Testing Router Carts");

        it("El endpoint GET /api/carts debe entregar todos los carritos", async () => {
            const result = await requester.get("/api/carts");

            console.log("Result GET /api/carts");
            console.log(result.body);
            console.log(result.statusCode);
            console.log(result.ok);
            console.log("###################################");
        });

        it("El endpoint POST /api/carts debe crear un carrito", async () => {

            const result = await requester.post("/api/carts");

            expect(result.ok);

            temporalTestCartID = result.body.data._id;

            console.log("Result POST /api/carts");
            console.log(result.body);
            console.log(result.statusCode);
            console.log(result.ok);
            console.log("###################################");
        });

        it("El endpoint DELETE /api/carts/cid debe eliminar el carrito por id", async () => {

            const result = await requester.delete(`/api/carts/${temporalTestCartID}`).send();

            expect(result.ok);

            console.log("Result DELETE /api/carts/cid");
            console.log(result.body);
            console.log(result.statusCode);
            console.log(result.ok);
            console.log("###################################");
        });

    });

});

describe("Testing Router Sessions", () => {
    console.log("Testing Router Sessions");

    it("El endpoint POST /api/sessions/login debe loguear al usuario", async () => {

        const user = {
            email: "alan@gmail.com",
            password: "123"
        }

        const result = await requester.post("/api/sessions/login").send(user);

        expect(result.ok);

        console.log("Result GET /api/sessions/login");
        console.log(result.body);
        console.log(result.statusCode);
        console.log(result.ok);
        console.log("###################################");
    });

    it("El endpoint GET /api/sessions/logout debe desloguear al usuario", async () => {

        const result = await requester.get("/api/sessions/logout");

        expect(result.ok);
        expect(result.redirect);

        console.log("Result GET /api/sessions/logout");
        console.log(result.statusCode);
        console.log(result.redirect);
        console.log("###################################");
    });

});
