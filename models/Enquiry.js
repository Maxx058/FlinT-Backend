const mongoose = require("mongoose");

const EnquiryModel = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    details: { type: String, required: true },
    requirements: { type: Array, required: true },
    budget: { type: String, required: true },
});

module.exports = mongoose.model("Enquiry", EnquiryModel, "enquiries");