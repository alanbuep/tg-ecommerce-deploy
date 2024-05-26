import { faker } from "@faker-js/faker";

async function generateProducts(req, res) {
    const productsMocking = [];
    try {
        for (let i = 0; i < 100; i++) {
            let product = {
                id: faker.database.mongodbObjectId(),
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                code: faker.commerce.isbn(),
                price: faker.commerce.price(),
                status: faker.datatype.boolean(),
                stock: Math.floor(Math.random() * 100),
                category: faker.commerce.department(),
                thumbnail: faker.image.url()
            };

            productsMocking.push(product);
        }
        res.json({
            data: productsMocking,
            limit: false
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos');
    }
}

export { generateProducts };