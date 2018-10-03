import express from 'express';
import fs from 'fs';
import Product from '../models/product';
import Category from '../models/category';

const router = express.Router();
// GET  all Products
router.get('/catalogue', (req, res) => {
  Product.find({}, (err, product) => {
    if (err) { console.log(err); }
    res.render('all_product', {
      title: 'All Products',
      products: product,
    });
  });
});

// GET  all Products by Category
router.get('/:category', (req, res) => {
  const slug = req.params.category;

  Category.findOne({ slug }, (eer, category) => {
    Product.find({ category: slug }, (err, products) => {
      if (err) { console.log(err); }
      res.render('cat_products', {
        title: category.title,
        products,
      });
    });
  });
});

// GET  Single Products View
router.get('/:category/:product', (req, res) => {
  let galleryImages = null;

  Product.findOne({ slug: req.params.product }, (err, product) => {
    if (err) {
      console.log(err);
    } else {
      const galleryDir = `public/product_images/${product._id}/gallery`;

      fs.readdir(galleryDir, (err, files) => {
        if (err) {
          console.log(err);
        } else {
          galleryImages = files;

          res.render('product', {
            title: product.title,
            p: product,
            galleryImages,
          });
        }
      });
    }
  });
});

export default router;
