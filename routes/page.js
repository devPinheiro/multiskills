import express from 'express';

const router = express.Router();

// set up route
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Home',
  });
});
export default router;
