const express = require("express");
const mongoose = require("mongoose");
const Enquiry = require("./models/Enquiry");
const Cart = require("./models/Cart");
const Orders = require("./models/Orders");

require("dotenv").config();

const PORT = process.env.PORT || 5000;
const DB_CONNECT = process.env.DB_CONNECT;

const app = express();
mongoose.connect(DB_CONNECT);

app.use(express.json());

app.post("/enquiry", (req, res) => {
  new Enquiry({
    name: req.body.name,
    email: req.body.email,
    details: req.body.details,
    budget: req.body.budget,
  })
    .save()
    .catch((err) => {
      res.send({ status: "error", message: "Please fill all fields" });
    })
    .then(() => {
      res.send({ status: "success", message: "Form submitted!" });
    });
});

app.post("/checkout", (req, res) => {
  Cart.findOneAndDelete({ _id: req.body.cart_id })
    .then((result) => {
      res.send(result);
      new Orders({
        username: result.username,
        products: result.products,
        email: result.email,
      })
        .save()
        .then((result) => console.log(result));
    })
    .catch((err) => {
      if (err) {
        res.send({ status: "error", message: "Cart not found" });
      }
    });
});

app.post("/cart", (req, res) => {
  const cartId = req.body.cart_id;
  if (cartId) {
    const products = req.body.products;
    Cart.findOneAndUpdate(
      { _id: cartId },
      { products: products },
      { new: true }
    )
      .exec()
      .then((result) => {
        console.log(result);
        res.send({ result: result });
      });
  } else {
    new Cart({
      username: req.body.username,
      email: req.body.email,
      products: req.body.products,
    })
      .save()
      .catch((err) => {
        res.send({ status: "error", message: "Please fill all fields" });
      })
      .then((result) => {
        res.send({
          status: "success",
          message: "Cart added!",
          cart_id: result._id,
        });
      });
  }
});

app.listen(PORT);
