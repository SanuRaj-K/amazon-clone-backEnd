const express = require("express");
const router = express.Router();
const adminControl = require("../Controllers/adminControl");

router.get("/getusers", adminControl.allUsers);
router.get("/getuser/:id", adminControl.userById);
router.delete("/deleteuser/:id", adminControl.deleteUser);
router.get("/getproducts", adminControl.allProducts);
router.get("/getproduct/:id", adminControl.AdminproductById);
router.get("/getproducts/:id", adminControl.productCategory);
router.post("/addproduct", adminControl.addProduct);
router.put("/updateproduct", adminControl.updateProduct);
router.delete("/deleteproduct/:id", adminControl.deleteProduct);
router.get("/stats", adminControl.stats);
router.get("/orderdetails", adminControl.orderDetails);
router.get("/getuserorders/:id", adminControl.getOrderDetailsbyId);
router.put("/updatestatus/:id/:status", adminControl.orderStatus);
router.get("/chart", adminControl.chart);

module.exports = router;
