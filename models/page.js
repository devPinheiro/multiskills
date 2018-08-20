import mongoose from 'mongoose';

// page Schema
const pageSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  slug: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  sorting: {
    type: Number,
  },
});

const Page = mongoose.model('page', pageSchema);
export default Page;
