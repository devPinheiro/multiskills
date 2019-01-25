import express from 'express';
import Product from '../../models/product';

const router = express.Router();
// GET Home page
// set up route
router.get('/', (req, res) => {
  Product.find((err, product) => {
    if (err) { console.log(err); }
    res.render('all_product', {
      title: 'All Products',
      products: product,
    });
  });
});


export default router;
