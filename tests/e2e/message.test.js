const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Group = require('../../src/models/Group');
const Message = require('../../src/models/Message');

let userToken;
let groupId;
let messageId;
let userId;  // To store the userId of the authenticated user

describe('Message API', () => {
    beforeAll(async () => {
        await User.deleteMany({});
        await Group.deleteMany({});
        await Message.deleteMany({});

        // Create a user
        const user = await User.create({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            isAdmin: false,
        });

        userId = user._id;  // Store the userId

        // Log in to get token
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'password123' });

        userToken = res.body.token;

        // Create a group
        const group = await Group.create({
            name: 'Test Group',
            description: 'This is a test group',
            admin: user._id,
            members: [user._id],
        });

        groupId = group._id;

        // Send a message in the group
        const messageRes = await request(app)
            .post('/api/messages')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                content: 'Hello, world!',
                groupId: groupId,
            });

        messageId = messageRes.body.data.message._id;
    }, 30000);

    it('should like a message', async () => {
        // Like the message
        const res = await request(app)
            .post(`/api/messages/${messageId}/toggle-like`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Message Liked');

        // Fetch the message to verify the like
        const message = await Message.findById(messageId);
        expect(message.likes.includes(userId.toString())).toBe(true);  // Check if the userId is added to likes
    });

    it('should dislike a message (unlike)', async () => {
        // Dislike the message (toggle again)
        const res = await request(app)
            .post(`/api/messages/${messageId}/toggle-like`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Message Disliked');

        // Fetch the message to verify the dislike
        const message = await Message.findById(messageId);
        expect(message.likes.includes(userId.toString())).toBe(false);  // Check if the userId is removed from likes
    });
});
