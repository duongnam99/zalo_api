require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const {PORT} = require("./constants/constants");
const {MONGO_URI} = require("./constants/constants");
// connect to mongodb
mongoose.connect(MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(res => {
    console.log("connected to mongodb");
})
    .catch(err => {
        console.log(err);
    })
const app = express();
// use middleware to parse body req to json
app.use(express.json());

// use middleware to enable cors
app.use(cors());

// route middleware
app.use("/", mainRouter);

app.get('/settings', function (req, res) {
    res.send('Settings Page');
});
app.listen(PORT, () => {
    console.log("server start - " + PORT);
})