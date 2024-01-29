const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const userModel = require("./Schema/userSchema");
const userRoute = require("./Routes/usersRoute");
const adminRoute = require("./Routes/adminRoute");
const cors = require("cors");
const cookies = require("cookie-parser");
const port = 3005;
app.use(express.json());
app.use(cookies()); 

app.use(
  cors({
    origin: "https://amazon-clone-front-end-sage.vercel.app",
    credentials: true,
  })
);

app.use("/users", userRoute);
app.use("/admin", adminRoute);

app.listen(port, (req, res) => {
  console.log("app listening");
});
mongoose.connect("mongodb+srv://SanuRaj:vJHYX5XpmPCRmbYi@cluster0.wcy5y.mongodb.net/");
app.listen(5000, () => {
  console.log("Mongodb Connected");
});
