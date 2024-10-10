const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

exports.createUser = catchAsync(async (req, res) => {
    const { username, email, password, isAdmin } = req.body;
    const isUserExist = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (isUserExist) {
        return res.status(400).json({ status: false, message: "User already exist with same name or email" })
    }

    const newUser = await User.create({
        username,
        email,
        password,
        isAdmin,
    });

    res.status(201).json({
        status: true,
        data: {
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                isAdmin: newUser.isAdmin,
            },
        },
    });
});

exports.editUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { username, isAdmin } = req.body;

    // Check if the user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
        return res.status(404).json({ status: false, message: 'User not found' });
    }

    // Prepare update object with only provided fields
    const updateData = {};
    if (username) updateData.username = username;
    if (isAdmin !== undefined && isAdmin !== "") updateData.isAdmin = isAdmin;

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
    );

    res.status(200).json({
        status: true,
        data: {
            user: {
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
            },
        },
    });
});

exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find().select('-password');

    res.status(200).json({
        status: true,
        results: users.length,
        data: { users },
    });
});