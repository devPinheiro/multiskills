import express from 'express';
import Page from '../models/page';

const router = express.Router();
// GET Home page
// set up route
router.get('/', (req, res) => {
  Page.findOne({ slug: 'home' }, (err, page) => {
    if (err) { console.log(err); }
    res.render('index', {
      title: page.title,
      content: page.content,
    });
  });
});


// GET a new page
// set up route
router.get('/:slug', (req, res) => {
  const slug = req.params.slug;

  Page.findOne({ slug }, (err, page) => {
    if (err) { console.log(err); }
    if (page) {
      res.render('index', {
        title: page.title,
        content: page.content,
      });
    }
  });
});
export default router;
