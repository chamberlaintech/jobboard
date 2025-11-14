import User from "../models/User.js";
import { StatusCodes } from "http-status-codes"
import BadRequestError from "../errors/bad-request.js"
import UnauthenticatedError from "../errors/unauthenticated.js"
import NotFoundError from "../errors/not-found.js"

export const register = async (req, res) => {
    const user = await User.create({...req.body})
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({user: {name: user.name, role: user.role}, token})
}

export const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError("Please provide email and password")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new UnauthenticatedError("Invalid Credentials")
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid Credentials")
    }

    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ user: { name: user.name, role: user.role }, token })
}

export const updateProfile = async (req, res) => {
    const { name, email } = req.body;
    const { userId } = req.user;

    if (!name && !email) {
        throw new BadRequestError("Please provide name or email to update");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError(`No user found with id: ${userId}`);
    }

    // Check if name is being changed and if it's unique
    if (name && name !== user.name) {
        const existingUserWithName = await User.findOne({ name });
        if (existingUserWithName && existingUserWithName._id.toString() !== userId) {
            throw new BadRequestError("Name already taken");
        }
        user.name = name;
    }

    // Check if email is being changed and if it's unique
    if (email && email !== user.email) {
        const existingUserWithEmail = await User.findOne({ email });
        if (existingUserWithEmail && existingUserWithEmail._id.toString() !== userId) {
            throw new BadRequestError("Email already in use");
        }
        user.email = email;
    }

    await user.save();

    res.status(StatusCodes.OK).json({
        user: {
            name: user.name,
            email: user.email,
            role: user.role
        },
        msg: "Profile updated successfully"
    });
}

export const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const { userId } = req.user;

    if (!currentPassword || !newPassword) {
        throw new BadRequestError("Please provide both current and new password");
    }

    if (newPassword.length < 6) {
        throw new BadRequestError("Password must be at least 6 characters");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError(`No user found with id: ${userId}`);
    }

    // Verify current password
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Current password is incorrect");
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    res.status(StatusCodes.OK).json({
        msg: "Password updated successfully"
    });
}