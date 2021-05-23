const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    described: {
        type: String,
        required: false
    },
    images: [
        {
            document: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Documents"
            }
        }
    ],
    videos: [
        {
            document: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Documents"
            }
        }
    ]
});
postsSchema.set('timestamps', true);
module.exports = mongoose.model('Posts', postsSchema);
