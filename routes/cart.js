import express from 'express';
import Product from '../models/product';


const router = express.Router();
// GET  add Product to Cart
router.get('/add/:product', (req, res) => {
  const slug = req.params.product;
  Product.findOne({ slug }, (err, p) => {
    if (err) { console.log(err); }

    if (typeof req.session.cart === 'undefined') {
      req.session.cart = [];
      req.session.cart.push({
        title: slug,
        qty: 1,
        price: parseFloat(p.price).toFixed(2),
        images: `/product_images/${p._id}/${p.image}`,
      });
    } else {
      const cart = req.session.cart;
      const newItem = true;

      for (let i = 0; i < cart.length; i++) {
        const element = array[i];     
      }
    }
  });
});


export default router;
