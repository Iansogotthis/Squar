const request = require('supertest');
const app = require('../server'); // Adjust the path as needed

describe('POST /squares', () => {
    it('should create a new square', async () => {
        const response = await request(app)
            .post('/squares')
            .send({ title: 'Test', plane: 'Test', purpose: 'Test', class: 'root', depth: 0, name: 'Root', size: 10, color: 'red', type: 'root' })
            .set('Authorization', 'Bearer your_jwt_token'); // Add the token as needed
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
    });
});
