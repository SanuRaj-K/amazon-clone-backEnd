const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
