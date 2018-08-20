import mongoose from 'mongoose';

// Product Schema
const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  slug: {
    type: String,
    required: true,
  },

  desc: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  image: {
    type: String,
  },

  price: {
    type: Number,
    required: true,
  },

  sorting: {
    type: Number,
  },
});

const Product = mongoose.model('product', productSchema);
export default Product;
