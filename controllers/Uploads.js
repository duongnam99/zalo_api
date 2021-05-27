require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();
const fs = require('fs');
const { ObjectId } = require('mongodb');
const cors = require('cors');
const DocumentModel = require("../models/Documents");
const httpStatus = require("../utils/httpStatus");

//CREATE EXPRESS APP
app.use(bodyParser.urlencoded({ extended: true }));
var corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    },
});

var upload = multer({ storage: storage });

const uploadsController = {};
uploadsController.photo = async (req, res, next) => {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    // Define a JSONobject for the image attributes for saving to database
    console.log(encode_image);
    var finalImg = {
        contentType: req.file.mimetype,
        image: new Buffer(encode_image, 'base64'),
    };
    return res.status(httpStatus.OK).json({
        message: e.message
    });
    try {
        let document = new DocumentModel({

        })

        // try {
        //     const savedUser = await user.save();
        //
        //     // login for User
        //     // create and assign a token
        //     const token = jwt.sign(
        //         {username: savedUser.username, firstName: savedUser.firstName, lastName: savedUser.lastName, id: savedUser._id},
        //         JWT_SECRET
        //     );
        //     res.status(httpStatus.CREATED).json({
        //         data: {
        //             username: savedUser.username,
        //             firstName: savedUser.firstName,
        //             lastName: savedUser.lastName,
        //         },
        //         token: token
        //     })
        // } catch (e) {
        //     return res.status(httpStatus.BAD_REQUEST).json({
        //         message: e.message
        //     });
        // }
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message
        });
    }
}
module.exports = uploadsController;