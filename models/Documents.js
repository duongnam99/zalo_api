const {
    DOCUMENT_TYPE_VIDEO,
    DOCUMENT_TYPE_IMAGE,
    DOCUMENT_TYPE_OTHER
} = require('constants/constants');
const mongoose = require("mongoose");

const documentsSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true,
    },
    originalFileName: {
        type: String,
        required: true,
        max: 30,
    },
    fileSize: {
        type: Number,
        required: true,
    },
    fileType: {
        type: String,
        required: false,
    },
    mimeType: {
        type: String,
        required: false,
    },
    thumbnail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Documents'
    },
    type: {
        type: String,
        enum: [
            DOCUMENT_TYPE_VIDEO,
            DOCUMENT_TYPE_IMAGE,
            DOCUMENT_TYPE_OTHER
        ],
        required: true,
        default: DOCUMENT_TYPE_OTHER
    }
});
documentsSchema.set('timestamps', true);
module.exports = mongoose.model('Documents', documentsSchema);
