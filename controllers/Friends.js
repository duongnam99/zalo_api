const jwt = require("jsonwebtoken");
const UserModel = require("../models/Users");
const httpStatus = require("../utils/httpStatus");
const bcrypt = require("bcrypt");
const {JWT_SECRET} = require("../constants/constants");
const {ROLE_CUSTOMER} = require("../constants/constants");
const friendsController = {};

module.exports = friendsController;