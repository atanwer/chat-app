const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Group = require('../../src/models/Group');

let userToken;
let groupId;

describe('Group API', () => {
    beforeAll(async () => {
        await User.deleteMany({});
        await Group.deleteMany({});
        await User.create({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            isAdmin: false,
        });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'password123' });

        userToken = res.body.token;
    }, 30000);

    it('should create a new group', async () => {
        const res = await request(app)
            .post('/api/groups')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: 'Test Group',
                description: 'This is a test group',
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.data.group).toHaveProperty('name', 'Test Group');
        groupId = res.body.data.group._id;
    });

    it('should search for groups', async () => {
        const res = await request(app)
            .get('/api/groups/search?query=Test')
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data.groups).toBeInstanceOf(Array);
        expect(res.body.data.groups.length).toBeGreaterThan(0);
    });
});