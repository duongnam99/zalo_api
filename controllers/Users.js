const jwt = require("jsonwebtoken");
const UserModel = require("../models/Users");
const DocumentModel = require("../models/Documents");
const httpStatus = require("../utils/httpStatus");
const bcrypt = require("bcrypt");
const {JWT_SECRET} = require("../constants/constants");
const {ROLE_CUSTOMER} = require("../constants/constants");
const uploadFile = require('../functions/uploadFile');
const usersController = {};
usersController.register = async (req, res, next) => {
    try {
        const {
            phonenumber,
            password,
            username,
        } = req.body;

        let user = await UserModel.findOne({
            phonenumber: phonenumber
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
            phonenumber: phonenumber,
            password: hashedPassword,
            username: username
        })

        try {
            const savedUser = await user.save();

            // login for User
            // create and assign a token
            const token = jwt.sign(
                {username: savedUser.username, firstName: savedUser.firstName, lastName: savedUser.lastName, id: savedUser._id},
                JWT_SECRET
            );
            res.status(httpStatus.CREATED).json({
                data: {
                    id: savedUser._id,
                    phonenumber: savedUser.phonenumber,
                    username: savedUser.username,
                },
                token: token
            })
        } catch (e) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: e.message
            });
        }
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        });
    }
}
usersController.login = async (req, res, next) => {
    try {
        const {
            phonenumber,
            password
        } = req.body;
        const user = await UserModel.findOne({
            phonenumber: phonenumber
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
            {username: user.username, firstName: user.firstName, lastName: user.lastName, id: user._id},
            JWT_SECRET
        );
        delete user["password"];
        res.status(httpStatus.OK).json({
            data: {
                id: user._id,
                phonenumber: user.phonenumber,
                username: user.username,
            },
            token: token
        })
    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        });
    }
}
usersController.edit = async (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        let authorization = req.headers.authorization.split(' ')[1], decoded;
        try {
            decoded = jwt.verify(authorization, process.env.JWT_SECRET);
        } catch (e) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                success: false,
                message: 'unauthorized'
            });
        }
        const userId = decoded.id;
        let user;
        try {
            user = await UserModel.findById(userId);
            if (user == null) {
                return res.status(httpStatus.NOT_FOUND).json({message: "Can not find user"});
            }
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
        try {
            const {
                username,
                description,
                address,
                city,
                country,
                avatar,
                cover_image,
            } = req.body;
            let savedAvatarDocument = null;
            let savedCoverImageDocument = null;
            if (uploadFile.matchesFileBase64(avatar) !== false) {
                const avatarResult = uploadFile.uploadFile(avatar);
                if (avatarResult !== false) {
                    let avatarDocument = new DocumentModel({
                        fileName: avatarResult.fileName,
                        fileSize: avatarResult.fileSize,
                        type: avatarResult.type
                    });
                    savedAvatarDocument = await avatarDocument.save();
                }
            } else {
                savedAvatarDocument = await DocumentModel.findById(avatar);
            }
            if (uploadFile.matchesFileBase64(cover_image) !== false) {
                const coverImageResult = uploadFile.uploadFile(cover_image);
                if (coverImageResult !== false) {
                    console.log(coverImageResult);
                    let coverImageDocument = new DocumentModel({
                        fileName: coverImageResult.fileName,
                        fileSize: coverImageResult.fileSize,
                        type: coverImageResult.type
                    });
                    savedCoverImageDocument = await coverImageDocument.save();
                }
            } else {
                savedCoverImageDocument = await DocumentModel.findById(cover_image);
            }

            user = await UserModel.findOneAndUpdate({_id: userId}, {
                username: username,
                description: description,
                address: address,
                city: city,
                country: country,
                avatar: savedAvatarDocument !== null ? savedAvatarDocument._id : null,
                cover_image: savedCoverImageDocument !== null ? savedCoverImageDocument._id : null,
            }, {
                new: true,
                runValidators: true
            });

            if (!user) {
                return res.status(httpStatus.NOT_FOUND).json({message: "Can not find user"});
            }
            user = await UserModel.findById(userId).populate('avatar').populate('cover_image');
            return res.status(httpStatus.OK).json({
                data: user
            });
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                message: e.message
            });
        }
    }

    return res.status(httpStatus.UNAUTHORIZED).json({
        message: 'UNAUTHORIZED'
    });
}
usersController.show = async (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        let authorization = req.headers.authorization.split(' ')[1], decoded;
        try {
            decoded = jwt.verify(authorization, process.env.JWT_SECRET);
        } catch (e) {
            res.status(httpStatus.UNAUTHORIZED).json({
                success: false,
                message: 'unauthorized'
            });
        }
        const userId = decoded.id;
        console.log(userId)
        let user;
        try {
            user = await UserModel.findById(userId).populate('avatar').populate('cover_image');
            if (user == null) {
                return res.status(httpStatus.NOT_FOUND).json({message: "Can not find user"});
            }
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
        return res.status(httpStatus.OK).json({
            data: {
                id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                description: user.description,
                address: user.address,
                city: user.city,
                country: user.country,
                avatar: user.avatar,
                cover_image: user.cover_image,
            }
        });
    }

    return res.status(httpStatus.UNAUTHORIZED).json({
        message: 'UNAUTHORIZED'
    });
}

module.exports = usersController;