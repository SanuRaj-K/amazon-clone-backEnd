const userModel = require("../Schema/userSchema");
const productModel = require("../Schema/productSchema");
const bcrypt = require("bcrypt");
const generate = require("../Helpers/JWT");
const stripSK = process.env.STRIPE_KEY;
const stripe = require("stripe")(stripSK);
 

const createPayment = async (req, res) => {
  const data = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2000,
    currency: 'usd',
  });
  res.json({ clientSecret: paymentIntent.client_secret });

};

const cod = async (req, res) => {
  const data = req.body;
  const userId = data.user;
  const cart = data.cart;

  const user = await userModel.findOne({ email: userId });
  if (user) {
    user.orders.push(cart);
    await user.save();
  }
};

const register = async (req, res) => {
  const user = new userModel({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
  });
  const existingUser = await userModel.findOne({ email: user.email });

  if (existingUser) {
    res.status(409).send(`${existingUser.email} already have an account`);
  } else {
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const verifySid = process.env.VERIFY_SID;
    const client = require("twilio")(accountSid, authToken);

    await client.verify.v2
      .services(verifySid)
      .verifications.create({ to: `+91${user.phone}`, channel: "sms" })
      .then((verification) => {
        if (verification.status === "pending") {
          res.status(200).send("success");
        } else {
          res.status(500).send("failed");
        }
      });
  }
};
const verifyOTP = async (req, res) => {
  const accountSid = process.env.ACCOUNT_SID;
  const authToken = process.env.AUTH_TOKEN;
  const verifySid = process.env.VERIFY_SID;
  const client = require("twilio")(accountSid, authToken);

  const user = req.body.formValues;

  const otp = req.body.otpnum;
  const phone = req.body.formValues.phone;
  client.verify.v2
    .services(verifySid)
    .verificationChecks.create({
      to: `+91${phone}`,
      code: otp,
    })
    .then(async (verification_check) => {
      if (verification_check.status === "approved") {
        const newUser = await userModel.create(user);
        const token = generate(newUser.email);
        res.status(200).json({ status: "success", token });
      } else {
        res.send("failed");
      }
    });
};

const emailRegister = async (req, res) => {
  const user = new userModel({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  const existingUser = await userModel.findOne({ email: user.email });
  if (existingUser) {
    res.status(409).send(`${existingUser.email} already have an account`);
  } else {
    await userModel.create(user);
    const name = req.body.username;

    res.status(200).send({ status: "success", name });
  }
};

const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await userModel.findOne({ email: email });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);

    if (auth) {
      const token = generate(email);
      res.cookie("authToken", token, { maxAge: 3600000, httpOnly: true });
      res.send({ status: "success", user: user, token: token });
    } else {
      res.send("incorrect username or password");
    }
  }
};

const getUser = async (req, res) => {
  const data = req.params.id;
  const user = await userModel.findById(data);

  res.send(user);
};

const getProudcts = async (req, res) => {
  const data = await productModel.find();
  res.send(data);
};

const productById = async (req, res) => {
  const id = req.params.id;
  const product = await productModel.findById(id);
  if (product) {
    res.send(product);
  } else {
    res.send("not found");
  }
};

const updateUserData = async (req, res) => {
  const userId = req.body.userId;
  // const userId=req.body
  const data = req.body.formValues;

  const user = await userModel.findById(userId);

  //  console.log(user);
  const updated = await userModel.findByIdAndUpdate(userId, {
    $set: {
      username: data.username,
      phone: data.phone,
      address: {
        place: data.place,
        housename: data.housename,
        pin: data.pin,
        post: data.post,
      },
    },
  });
  const newUpdated = await updated.save();
  res.send(newUpdated);
};

const addToCart = async (req, res) => {
  const token = req.body;
  const userMail = req.body.userId;

  const prodId = req.body.id;
  const user = await userModel.findOne({ email: userMail });
  const product = await productModel.findOne({ _id: prodId });
  if (user) {
    const isExist = user.cart.find((item) => item._id == prodId);

    if (isExist) {
      res.send({ status: "inCart" });
    } else {
      user.cart.push(product);
      await user.save();

      res.send({ status: "added", cartCount: user });
    }
  }
};

const getCartCount = async (req, res) => {
  const email = req.params.id;
  const user = await userModel.findOne({ email: email });

  res.send(user);
};
const viewCart = async (req, res) => {
  const id = req.params.id;
  const user = await userModel.findOne({ email: id });

  if (user.cart) {
    const cartItems = user.cart;

    res.send(cartItems);
  }
};

const removeCart = async (req, res) => {
  const userId = req.params.id;

  const prodId = req.params.prod;
  const user = await userModel.findOne({ email: userId });
  const id = user._id;

  const deleteItem = user.cart.filter((item) => item._id !== prodId);
  if (deleteItem) {
    const upatedUser = await userModel.findByIdAndUpdate(id, {
      $set: { cart: deleteItem },
    });
    await upatedUser.save();
    res.json({
      message: "product successfully deleted",
      data: upatedUser.cart,
    });
  }
};

const handleQty = async (req, res) => {
  const qty = req.body.quantity;
  const userId = req.params.id;
  const prodId = req.params.prod;
  const user = await userModel.findOne({ email: userId });
  const index = user.cart.findIndex((item) => item._id == prodId);

  if (index !== -1) {
    await userModel.updateOne(
      { _id: user._id, "cart._id": prodId },
      { $set: { "cart.$.quantity": qty } }
    );
    const updatedUser = await userModel.findById(user._id);

    res.send(updatedUser.cart);
  }
};

const payment = async (req, res) => {
  const id = req.params.id;
  const user = await userModel.findOne({ email: id });
  res.send(user);
};

module.exports = {
  register,
  verifyOTP,
  emailRegister,
  getProudcts,
  login,
  productById,
  getUser,
  updateUserData,
  addToCart,
  getCartCount,
  viewCart,
  removeCart,
  handleQty,
  payment,
  createPayment,
  cod,
};
