const Message = require('../models/Message');
const Group = require('../models/Group');
const catchAsync = require('../utils/catchAsync');

exports.sendMessage = catchAsync(async (req, res) => {
    const { content, groupId } = req.body;
    const sender = req.user.id;

    if (!content) {
        return res.status(400).json({ status: false, message: 'Missing field : content' });
    }
    const group = await Group.findById(groupId);
    if (!group) {
        return res.status(404).json({ status: false, message: 'Group not found' });
    }

    if (!group.members.includes(sender)) {
        return res.status(403).json({ status: false, message: 'You are not a member of this group' });
    }

    const newMessage = await Message.create({
        content,
        sender,
        group: groupId,
    });

    if (newMessage) {
        res.status(201).json({
            status: true,
            message: "Message sent.",
            data: {
                message: newMessage
            }
        });
    }
});

exports.toggleLikeMessage = catchAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the message to check if the user has already liked it
    const message = await Message.findById(id);

    if (!message) {
        return res.status(404).json({ status: false, message: 'Message not found' });
    }

    // Check if the user has already liked the message
    const hasLiked = message.likes.includes(userId);

    if (hasLiked) {
        // If user has liked, remove the like (dislike)
        await Message.findByIdAndUpdate(
            id,
            { $pull: { likes: userId } }
        );
        return res.status(200).json({
            status: true,
            message: "Message Disliked",
        });
    } else {
        // If user has not liked, add the like
        await Message.findByIdAndUpdate(
            id,
            { $addToSet: { likes: userId } }
        );
        return res.status(200).json({
            status: true,
            message: "Message Liked",
        });
    }
});


exports.getGroupMessages = catchAsync(async (req, res) => {
    const { groupId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const group = await Group.findById(groupId);
    if (!group) {
        return res.status(404).json({ status: false, message: 'Group not found' });
    }

    if (!group.members.includes(req.user.id)) {
        return res.status(403).json({ status: false, message: 'You are not a member of this group' });
    }

    const messages = await Message.find({ group: groupId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate('sender', 'username');

    const total = await Message.countDocuments({ group: groupId });

    res.status(200).json({
        status: true,
        total,
        data: {
            messages,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
        },
    });
});