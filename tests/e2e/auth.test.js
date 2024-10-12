const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');

describe('Auth API', () => {
    beforeAll(async () => {
        await User.deleteMany({});
        await User.create({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            isAdmin: false,
        });
    }, 30000);

    it('should login a user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should not login with incorrect credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'wrongpassword' });

        expect(res.statusCode).toBe(401);
    });
});