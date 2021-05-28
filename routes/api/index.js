const express = require("express");
const usersRoutes = require("../Users");
const friendsRoutes = require("../Friends");
const postCommentRoutes = require("../PostComment");
const postLikeRoutes = require("../PostLike");
const postReportRoutes = require("../PostReport");
const postsRoutes = require("../Posts");
const uploadsRoutes = require("../Uploads");
const chatsRoutes = require("../Chats");

const apiRoutes = express.Router();

apiRoutes.use("/users", usersRoutes);
apiRoutes.use("/friends", friendsRoutes);
apiRoutes.use("/postComment", postCommentRoutes);
apiRoutes.use("/postLike", postLikeRoutes);
apiRoutes.use("/postReport", postReportRoutes);
apiRoutes.use("/posts", postsRoutes);
apiRoutes.use("/uploads", uploadsRoutes);
apiRoutes.use("/chats", chatsRoutes)

module.exports = apiRoutes;