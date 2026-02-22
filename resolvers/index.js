const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");

const resolvers = {
    Query: {
        test: () => "Server working",

        login: async (_, { usernameOrEmail, password }) => {
            const user = await User.findOne({
                $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
            });

            if (!user) {
                return { status: false, message: "Invalid credentials", token: null, user: null };
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return { status: false, message: "Invalid credentials", token: null, user: null };
            }

            const token = jwt.sign(
                { userId: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            return { status: true, message: "Login successful", token, user };
        },
        employees: async () => {
            return await Employee.find();
        },
    },

    Mutation: {
        signup: async (_, { username, email, password }) => {
            const existing = await User.findOne({ $or: [{ username }, { email }] });
            if (existing) {
                return { status: false, message: "Username or email already exists", token: null, user: null };
            }

            const hashed = await bcrypt.hash(password, 10);
            const user = await User.create({ username, email, password: hashed });

            const token = jwt.sign(
                { userId: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            return { status: true, message: "Signup successful", token, user };
        },
    },
};

module.exports = resolvers;