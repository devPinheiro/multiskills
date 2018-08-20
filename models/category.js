import mongoose from 'mongoose';

// category Schema
const categorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  slug: {
    type: String,
    required: true,
  },

});

const Category = mongoose.model('Category', categorySchema);
export default Category;
