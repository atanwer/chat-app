const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');

let adminToken;

describe('User API', () => {
    beforeAll(async () => {
        await User.deleteMany({});
        const admin = await User.create({
            username: 'admin',
            email: 'admin@example.com',
            password: 'adminpass',
            isAdmin: true,
        });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@example.com', password: 'adminpass' });

        adminToken = res.body.token;
    }, 30000);

    it('should create a new user', async () => {
        const res = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                username: 'newuser',
                email: 'newuser@example.com',
                password: 'newpass123',
                isAdmin: false,
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.data.user).toHaveProperty('username', 'newuser');
    });

    it('should get all users', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.users).toBeInstanceOf(Array);
    });
});