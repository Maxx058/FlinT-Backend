const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Enquiry = require("./models/Enquiry");
const Cart = require("./models/Cart");
const Orders = require("./models/Orders");
const Products = require("./models/Products");

require("dotenv").config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const PORT = process.env.PORT || 5000;
const DB_CONNECT = process.env.DB_CONNECT;

mongoose.connect(DB_CONNECT);

app.use(express.json());

app.get("/products", (req, res) => {
    Products.find({}).then((result) => {
        res.send(result);
    });
});

app.post("/enquiry", (req, res) => {
    console.log(req.body)
    new Enquiry({
            name: req.body.name,
            email: req.body.email,
            details: req.body.details,
            requirements: req.body.requirements,
            budget: req.body.budget,
        })
        .save()
        .then(() => {
            res.send({ status: "success", message: "Form submitted!" });
        })
        .catch((err) => {
            res.send({ status: "error", message: err.message });
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
    if (cartId != '' && cartId) {
        const products = req.body.products;
        Cart.findOneAndUpdate({ _id: cartId }, { products: products }, { new: true })
            .exec()
            .then((result) => {
                console.log(result);
                res.send({ result: result });
            }).catch(err => res.send("error"))
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

app.delete("/cart", (req, res) => {
    Cart.findOneAndDelete({ _id: req.body.cart_id })
        .then((result) => {
            res.send(result);
        }).catch(err => res.send("error"))
});
app.listen(PORT);