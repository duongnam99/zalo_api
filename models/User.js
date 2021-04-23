const {
    GENDER_FEMALE,
    GENDER_MALE,
    GENDER_SECRET,
    ROLE_ADMIN,
    ROLE_CASHIER,
    ROLE_CUSTOMER, ROLE_INVENTORY
} =  require("../constants/constants");

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 30,
    },
    username: {
        type: String,
        required: true,
        max: 255,
        min: 6,
    },
    phone: {
        type: String,
        required: false,
    },
    gender: {
        type: String,
        enum: {
            values: [GENDER_MALE, GENDER_FEMALE, GENDER_SECRET],
            message: `Gender options : ${GENDER_MALE}, ${GENDER_FEMALE}, ${GENDER_SECRET}`
        },
        required: true,
        default: GENDER_SECRET,
    },
    address: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        max: 255,
        min: 6,
    },
    role: {
        enum: {
            values: [ROLE_CUSTOMER, ROLE_ADMIN, ROLE_CASHIER, ROLE_INVENTORY],
            message: `Role options : ${ROLE_CUSTOMER}, ${ROLE_ADMIN}, ${ROLE_CASHIER}, ${ROLE_INVENTORY}`
        },
        type: String,
        default: ROLE_CUSTOMER,
    },
});
userSchema.set('timestamps', true);
module.exports = mongoose.model('User', userSchema);
