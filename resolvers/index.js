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
        employeeById: async (_, { id }) => {
            return await Employee.findById(id);
        },
        searchEmployeesByFilter: async (_, { designation, department }) => {
            const filter = {};
            if (designation) filter.designation = designation;
            if (department) filter.department = department;

            return await Employee.find(filter);
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
        addEmployee: async (_, { input }) => {
            const employee = await Employee.create({
                ...input,
                date_of_joining: new Date(input.date_of_joining),
            });

            return employee;
        },
        updateEmployeeById: async (_, { id, input }) => {
            const updateData = { ...input };

            if (input.date_of_joining) {
                updateData.date_of_joining = new Date(input.date_of_joining);
            }

            const updated = await Employee.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });

            return updated;
        },
        deleteEmployeeById: async (_, { id }) => {
            const deleted = await Employee.findByIdAndDelete(id);
            return deleted;
        },

    },
};

module.exports = resolvers;