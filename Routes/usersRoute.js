const express = require("express");
const router = express.Router();
const userControl = require("../Controllers/userControl");

router.post("/register", userControl.register);
router.post("/verify", userControl.verifyOTP);
router.post("/emailregister", userControl.emailRegister);
router.get("/products", userControl.getProudcts);
router.post("/login", userControl.login);
router.get("/product/:id", userControl.productById);
router.get("/getuser/:id", userControl.getUser);
router.post("/updateuser", userControl.updateUserData);
router.post("/addtocart", userControl.addToCart);
router.get("/cartcount/:id", userControl.getCartCount);
router.get("/viewcart/:id", userControl.viewCart);
router.get("/getorders/:id", userControl.viewOrder);
router.delete("/removecart/:id/:prod", userControl.removeCart);
router.put("/handleqty/:id/:prod", userControl.handleQty);
router.get("/payment/:id", userControl.payment);
router.post("/createpayment", userControl.createPayment);
router.post("/cod", userControl.cod);     
router.get("/orderspec/:id", userControl.orderSpec);

module.exports = router;
