const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            success: true,
            message: "User Registered Successfully ✅",
            user,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

       const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
    return res.status(401).json({
        success: false,
        message: "Invalid password",
    });
}

const token = jwt.sign(
    {
        userId: user._id,
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d",
    }
);

return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
});

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
    return res.status(404).json({
        success: false,
        message: "User not found",
    });
}
       return res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
    },
});

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateProfile = async (req, res) => {
    try {

        const { name, email } = req.body;
        const user = await User.findById(req.user.userId);
        if (!user) {
    return res.status(404).json({
        success: false,
        message: "User not found",
    });
}
user.name = name;
user.email = email; 

await user.save();

return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
    },
});

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
};