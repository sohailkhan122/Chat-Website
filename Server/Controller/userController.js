const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const registerController = async (req, res) => {
    const { name, email, password } = req.body;
    const profileImage = req.file;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use.' });
        }
        const newUser = new User({
            name,
            email,
            password,
            profileImage: {
                data: profileImage.buffer,
                contentType: profileImage.mimetype,
            },
        });
        await newUser.save();
        res.status(201).json({ success: true, message: 'User registered successfully.' });
    }
    catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
    }
};
const loginConreoller = async (req, res) => {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist && (await userExist.matchPassword(password))) {
        const token = jwt.sign({ _id: userExist._id }, '123456', { expiresIn: "30d" });

        res.status(200).json({ msg: 'Successfully Login', token });
    } else {
        res.status(400).json({ msg: "Invalid Email or Password" });
    }
};
const fetchAllUsersController = async (req, res) => {
    try {
        const allUsers = await User.find().select('-password');
        res.status(200).json({ success: true, data: allUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

const getSingleDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await User.findById(id).select('-password');

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json(document);
    } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateUserProfile = async (req, res) => {
    const { email, name } = req.body;
    const profileImage = req.file;

    try {
        let updateFields = { name };

        if (profileImage) {
            updateFields.profileImage = {
                data: profileImage.buffer,
                contentType: profileImage.mimetype,
            };
        }

        const updatedUser = await User.findOneAndUpdate({ email }, updateFields, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.status(200).json({ success: true, message: 'User profile updated successfully.', user: updatedUser });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ success: false, message: 'Failed to update user profile. Please try again.' });
    }
};

module.exports = { getSingleDocument };


module.exports = { registerController, loginConreoller, fetchAllUsersController, getSingleDocument, updateUserProfile };