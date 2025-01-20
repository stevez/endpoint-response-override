const { overrideRouter, responseOverrideMiddleware } = require('./endpoint-response-override');

const express = require('express');
const request = require('supertest');

const app = express();
app.use(responseOverrideMiddleware);
app.use(express.json());
app.use(overrideRouter);

describe('Endpoint Response Override', () => {

    beforeEach(async () => {
        await request(app)
        .post('/reset?all=true');
    });

    it('should override response', async () => {
        const response = { status: 200, body: { message: 'Hello World' } };
        const override = { url: '/hello', method: 'GET', response };
        await request(app)
            .post('/register')
            .send(override)
            .expect(200);

        await request(app)
            .get('/hello')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(response.body);
    });

    it('should override response when registering the same parallel-index', async () => {
        const response = { status: 200, body: { message: 'Hello World' } };
        const override = { url: '/hello', method: 'GET', response };
        await request(app)
            .post('/register')
            .send(override)
            .expect(200);

        await request(app)
            .post('/register')
            .send({ url: '/hello', 
                    method: 'GET', 
                    response : { status: 200, body: { message: 'Hello Canada' } }})
            .expect(200);

        await request(app)
            .get('/hello')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(response.body);
    });

    it('should reset endpoints', async () => {
        const response = { status: 200, body: { message: 'Hello World' } };
        const override = { url: '/hello', method: 'GET', response };
        await request(app)
            .post('/register')
            .send(override)
            .expect(200);

        await request(app)
            .post('/reset')
            .expect(200);

        await request(app)
            .get('/hello')
            .expect(404);
    });

    it('should reset endpoints with invalid parallel-index', async () => {
        await request(app)
            .post('/reset')
            .set('x-parallel-index', '100')
            .expect(200);
    });

    it('should support regex for url', async () => {
        const response = { status: 200, body: { message: 'Hello World' } };
        const override = { url: '/hello', method: 'GET', response };
        await request(app)
            .post('/register')
            .send(override)
            .expect(200);

        await request(app)
            .get('/hello?name=Andy')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(response.body);
    });

    it('should override response with x-parallel-index in the header', async () => {
        const response = { status: 200, body: { message: 'Hello World' } };
        const override = { url: '/hello', method: 'GET', response };
        await request(app)
            .post('/register')
            .set('x-parallel-index', '1')
            .send(override)
            .expect(200);

        await request(app)
            .get('/hello')
            .set('x-parallel-index', '1')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(response.body);
    });

    it('should not override response when x-parallel-index is different', async () => {
        const response = { status: 200, body: { message: 'Hello World' } };
        const override = { url: '/hello', method: 'GET', response };
        await request(app)
            .post('/register')
            .set('x-parallel-index', '0')
            .send(override)
            .expect(200);

        await request(app)
            .get('/hello')
            .set('x-parallel-index', '1')
            .expect(404);
    });
});