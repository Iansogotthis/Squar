// tests/server.test.js
const request = require('supertest');
const app = require('../server'); // Adjust the path as needed

describe('API Tests', () => {
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

  describe('GET /squares', () => {
    it('should fetch all squares', async () => {
      const response = await request(app).get('/squares');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /squares/:id', () => {
    it('should fetch a square by ID', async () => {
      const postResponse = await request(app)
        .post('/squares')
        .send({ title: 'Test', plane: 'Test', purpose: 'Test', class: 'root', depth: 0, name: 'Root', size: 10, color: 'red', type: 'root' })
        .set('Authorization', 'Bearer your_jwt_token');
      const squareId = postResponse.body.id;

      const getResponse = await request(app).get(`/squares/${squareId}`);
      expect(getResponse.statusCode).toBe(200);
      expect(getResponse.body).toHaveProperty('id', squareId);
    });
  });

  describe('PUT /squares/:id', () => {
    it('should update a square', async () => {
      const postResponse = await request(app)
        .post('/squares')
        .send({ title: 'Test', plane: 'Test', purpose: 'Test', class: 'root', depth: 0, name: 'Root', size: 10, color: 'red', type: 'root' })
        .set('Authorization', 'Bearer your_jwt_token');
      const squareId = postResponse.body.id;

      const putResponse = await request(app)
        .put(`/squares/${squareId}`)
        .send({ title: 'Updated Test', plane: 'Updated Test', purpose: 'Updated Test', class: 'root', depth: 0, name: 'Root', size: 10, color: 'blue', type: 'root' })
        .set('Authorization', 'Bearer your_jwt_token');
      expect(putResponse.statusCode).toBe(200);
      expect(putResponse.body).toHaveProperty('message', 'Square updated successfully');
    });
  });

  describe('DELETE /squares/:id', () => {
    it('should delete a square', async () => {
      const postResponse = await request(app)
        .post('/squares')
        .send({ title: 'Test', plane: 'Test', purpose: 'Test', class: 'root', depth: 0, name: 'Root', size: 10, color: 'red', type: 'root' })
        .set('Authorization', 'Bearer your_jwt_token');
      const squareId = postResponse.body.id;

      const deleteResponse = await request(app).delete(`/squares/${squareId}`).set('Authorization', 'Bearer your_jwt_token');
      expect(deleteResponse.statusCode).toBe(200);
      expect(deleteResponse.body).toHaveProperty('message', 'Square deleted successfully');
    });
  });
});
