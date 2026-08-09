const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  payment: {
    type: String,
    required: true
  },
  items: [
    {
      id: Number,
      name: String,
      price: Number,
      rating: String,
      image: String
    }
  ],
  total: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    default: () => new Date().toLocaleString()
  },
  status: {
    type: String,
    default: "Order Confirmed"
  }
});

module.exports = mongoose.model("Order", orderSchema);