const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const userModel = require("./Schema/userSchema");
const userRoute = require("./Routes/usersRoute");
const cors = require("cors");
const cookies = require("cookie-parser");
const port = 3005;
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/users", userRoute);
app.use(cookies());

app.listen(port, (req, res) => {
  console.log("app listening");
});
mongoose.connect("mongodb://localhost:27017/amazon");
app.listen(5000, () => {
  console.log("Mongodb Connected");
});
