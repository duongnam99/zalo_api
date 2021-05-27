require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();
const fs = require('fs');
const cors = require('cors');
const DocumentModel = require("../models/Documents");
const {asyncWrapper} = require("../utils/asyncWrapper");

//CREATE EXPRESS APP
app.use(bodyParser.urlencoded({ extended: true }));
const ValidationMiddleware = require("../middlewares/validate");
const httpStatus = require("../utils/httpStatus");
const uploadsController = require("../controllers/Uploads");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    },
});

var upload = multer({ storage: storage });

uploadsRoutes = express.Router();
uploadsRoutes.post(
    '/photo',
    upload.single('photo'),
    ValidationMiddleware.validJWTNeeded,
    asyncWrapper(uploadsController.photo)
);

module.exports = uploadsRoutes;
