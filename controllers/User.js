const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const httpStatus = require("../utils/httpStatus");
const bcrypt = require("bcrypt");
const {JWT_SECRET} = require("../constants/constants");
const {ROLE_CUSTOMER} = require("../constants/constants");
const userController = {};

// user User with role customer

userController.register = async (req, res, next) => {
    try {
        const {
            name,
            username,
            phone,
            gender,
            address,
            password
        } = req.body;

        let user = await UserModel.findOne({
            username: username
        })

        if (user) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: 'Username already exists'
            });
        }
        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new UserModel({
            name: name,
            username: username,
            phone: phone,
            gender: gender,
            address: address,
            password: hashedPassword,
            role: ROLE_CUSTOMER
        })

        try {
            const savedUser = await user.save();

            // login for User
            // create and assign a token
            const token = jwt.sign(
                {username: savedUser.username, role: savedUser.role, name: savedUser.name, id: savedUser._id},
                JWT_SECRET
            );
            res.status(httpStatus.CREATED).json({
                data: {
                    username: savedUser.username,
                    name: savedUser.name,
                    phone: savedUser.phone,
                    gender: savedUser.gender,
                    address: savedUser.address,
                    role: savedUser.role
                },
                token: token
            })
        } catch (e) {
            res.status(httpStatus.BAD_REQUEST).json({
                message: e.message
            });
        }
    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        });
    }
}
userController.login = async (req, res, next) => {
    try {
        const {
            username,
            password
        } = req.body;
        const user = await UserModel.findOne({
            username: username
        })
        if (!user) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: 'Username or password incorrect'
            });
        }

        // password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: 'Username or password incorrect'
            });
        }

        // login success

        // create and assign a token
        const token = jwt.sign(
            {username: user.username, role: user.role, name: user.name, id: user._id},
            JWT_SECRET
        );
        delete user["password"];
        res.status(httpStatus.OK).json({
            data: {
                username: user.username,
                name: user.name,
                phone: user.phone,
                gender: user.gender,
                address: user.address,
                role: user.role
            },
            token: token
        })
    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        });
    }
}
userController.createUser = async (req, res, next) => {
    try {
        const {
            name,
            username,
            phone,
            gender,
            address,
            password
        } = req.body;

        let user = await UserModel.findOne({
            username: username
        })

        if (user) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: 'Username already exists'
            });
        }
        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new UserModel({
            name: name,
            username: username,
            phone: phone,
            gender: gender,
            address: address,
            password: hashedPassword,
            role: ROLE_CUSTOMER
        })

        try {
            const savedUser = await user.save();
            res.status(httpStatus.CREATED).json({
                data: {
                    username: savedUser.username,
                    name: savedUser.name,
                    phone: savedUser.phone,
                    gender: savedUser.gender,
                    address: savedUser.address,
                    role: savedUser.role
                },
            })
        } catch (e) {
            res.status(httpStatus.BAD_REQUEST).json({
                message: e.message
            });
        }
    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        });
    }
}

module.exports = userController;