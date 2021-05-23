const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        max: 255,
        min: 6,
    },
    password: {
        type: String,
        required: true,
        max: 255,
        min: 6,
    },
    firstName: {
        type: String,
        required: true,
        max: 30,
    },
    lastName: {
        type: String,
        required: true,
        max: 30,
    },
    description: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: false,
    },
    link: {
        type: String,
        required: false,
    },
    avatar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Documents',
    },
    cover_image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Documents',
    },
});
usersSchema.set('timestamps', true);
module.exports = mongoose.model('Users', usersSchema);
