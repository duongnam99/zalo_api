const friendController = require("../controllers/Friends");
const {asyncWrapper} = require("../utils/asyncWrapper");
const express = require("express");
const friendsRoutes = express.Router();
const ValidationMiddleware = require("../middlewares/validate");
const auth = require("../middlewares/auth");

friendsRoutes.post("/set-request-friend", auth, friendController.setRequest);
friendsRoutes.post("/get-requested-friend", auth, friendController.getRequest);
friendsRoutes.post("/set-accept", auth, friendController.setAccept);


module.exports = friendsRoutes;