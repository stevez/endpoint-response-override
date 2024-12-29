const { overrideRouter, responseOverrideMiddleware } = require('./endpoint-response-override');

const express = require('express');
const request = require('supertest');

const app = express();
app.use(responseOverrideMiddleware);
app.use(express.json());
app.use(overrideRouter);

describe('Endpoint Response Override', () => {
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
});