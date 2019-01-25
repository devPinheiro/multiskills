import express from 'express';
import Product from '../../models/product';

const router = express.Router();
// GET Home page
// set up route
router.get('/', (req, res) => {
  Product.find((err, product) => {
    if (err) { console.log(err); }
    res.json({
      status: 'Success',
      data: product,
    });
  });
});


export default router;
