const Group = require('../models/Group');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');


exports.createGroup = catchAsync(async (req, res) => {
    const { name, description } = req.body;
    const admin = req.user._id;

    const existingGroup = await Group.findOne({ name, admin });

    if (existingGroup) {
        return res.status(400).json({
            status: false,
            message: 'A group with the same name already exists. Please choose a different name.',
        });
    }


    const newGroup = await Group.create({
        name,
        description,
        admin,
        members: [admin],
    });
    if (newGroup) {
        res.status(201).json({
            status: true,
            message: 'Group Created.',
        });
    }
});

exports.getGroupDetails = catchAsync(async (req, res) => {
    const { groupId } = req.params;

    const group = await Group.findOne({ _id: groupId, members: req.user.id })
        .populate('admin', 'username email')
        .populate('members', 'username email');

    if (!group) {
        return res.status(404).json({
            status: false,
            message: 'Group not found',
        });
    }

    res.status(200).json({
        status: true,
        group,
    });
});


exports.deleteGroup = catchAsync(async (req, res) => {
    const { id } = req.params;
    const group = await Group.findOneAndDelete({ _id: id, admin: req.user.id });

    if (!group) {
        return res.status(404).json({ status: false, message: 'Group not found.' });
    }

    res.status(200).json({
        status: true,
        message: "Group deleted successfully.",
    });
});

exports.searchGroups = catchAsync(async (req, res) => {
    const { query } = req.query;
    const groups = await Group.find({
        name: { $regex: query, $options: 'i' },
        members: req.user._id
    });

    res.status(200).json({
        status: true,
        results: groups.length,
        groups
    });
});



exports.addMember = catchAsync(async (req, res) => {
    const { groupId, userId } = req.body;

    // Check if the user exists
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
        return res.status(404).json({ status: false, message: 'User not found' });
    }

    // Check if the user is already a member of the group
    const group = await Group.findOne({ _id: groupId, admin: req.user.id });
    if (!group) {
        return res.status(404).json({ status: false, message: 'Group not found or you are not the admin' });
    }

    if (group.members.includes(userId)) {
        return res.status(400).json({ status: false, message: 'User is already a member of this group' });
    }

    group.members.push(userId);
    await group.save();

    res.status(200).json({
        status: true,
        message: 'User added successfully.'
    });
});