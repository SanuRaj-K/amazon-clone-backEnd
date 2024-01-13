const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  Title: {
    type: String,
    required: true,
  },
  Description: {
    Color: String,
    RAM: String,
    ROM: String,
    Display: String,
    Processor: String,
  },
  Category: {
    type: String,
  },
  Image: {
    type: String,
  },
  Price: {
    type: Number,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
