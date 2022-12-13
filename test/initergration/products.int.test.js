const request = require('supertest');
const app = require('../../app');
const newProduct = require('../data/new_product.json');

let firstProduct;
it('POST /api/products', async () => {
    const response = await request(app)
        .post('/api/products')
        .send(newProduct);
    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(newProduct.name);
    expect(response.body);
    expect(response.body.description).toBe(newProduct.description);
});

it('return 500 POST /api/products', async () => {
    const response = await request(app)
        .post('/api/products')
        .send({ name: 'phone' });
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({ message: "Product validation failed: description: Path `description` is required."});
});

it('GET /api/products', async () => {
    const response = await request(app).get('/api/products');
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].name).toBeDefined();
    expect(response.body[0].description).toBeDefined();
    firstProduct = response.body[0];
});

it('GET /api/product/:productId', async () => {
    const response = await request(app).get(`/api/products/${firstProduct._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(firstProduct.name);
    expect(response.body.description).toBe(firstProduct.description);
});

it('GET error /api/product/:productId', async () => {
    const response = await request(app).get('/api/products/639724c088b476db5fec52e1');
    expect(response.statusCode).toBe(404);
});