const express = require("express");
const userRoutes = require("../User");
const typeRoutes = require("../Type");

const apiRoutes = express.Router();
//
// apiRoutes.get("/", function(req, res, next) {
//   res.json({ message: "from index api" });
// });

apiRoutes.use("/auth", userRoutes);
apiRoutes("/type", typeRoutes);
module.exports = apiRoutes;