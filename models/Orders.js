const mongoose = require("mongoose");

const OrderModel = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  products: { type: Array, required: true },
});

module.exports = mongoose.model("Order", OrderModel, "orders");
