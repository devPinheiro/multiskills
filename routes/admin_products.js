import express from 'express';
import Category from '../models/category';
import Product from '../models/product';

const router = express.Router();

/**
 * GET admin product index
 */
router.get('/', (req, res) => {
  let count;
  Product.count((err, c) => {
    count = c;
  });

  Product.find((err, products) => {
    if (err) return console.log(err);
    res.render('admin/products', {
      products,
      count,
    });
  });
});

/**
 * GET add product
 */
router.get('/add-product', (req, res) => {
  const title = '';
  const price = '';
  const desc = '';
  res.render('admin/add_product ', {
    title,
  });
});

/**
 * POST page index
 */
router.post('/add-category', (req, res) => {
  req.checkBody('title', 'Title must have a value').notEmpty();
  const title = req.body.title;
  // let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
  const slug = title.replace(/\s+/g, '-').toLowerCase();
  const errors = req.validationErrors();
  if (errors) {
    res.render('admin/add_category', {
      errors,
      title,
      slug,
    });
  } else {
    Category.findOne({ slug }, (err, category) => {
      if (category) {
        req.flash('danger', 'Page slug exists, choose another');
        res.render('admin/add_category', {
          title,
          slug,
        });
      } else {
        const categoryNew = new Category({
          title,
          slug,
        });

        categoryNew.save((errNew) => {
          if (err) return console.log(errNew);

          req.flash('success', 'category added');
          res.redirect('/admin/categories');
        });
      }
    });
  }
});


/**
 * GET admin edit category page
 */
router.get('/edit-category/:slug', (req, res) => {
  Category.findOne({ slug: req.params.slug }, (err, category) => {
    const categoryId = category._id;
    if (err) return console.log(err);
    return res.render('admin/edit_category', {
      title: category.title,
      slug: category.slug,
      id: categoryId,
    });
  });
});

/**
 * POST admin edit category page
 */
router.post('/edit-category/:slug', (req, res) => {
  req.checkBody('title', 'Title must have a value').notEmpty();
  const title = req.body.title;
  const slug = title.replace(/\s+/g, '-').toLowerCase();
  const id = req.body.id;

  const errors = req.validationErrors();
  if (errors) {
    res.render('admin/edit_category', {
      errors,
      title,
      slug,
      id,
    });
  } else {
    Category.findOne({ slug, _id: { $ne: id } }, (err, page) => {
      if (page) {
        req.flash('danger', 'Page slug exists, choose another');
        res.render('admin/edit_category', {
          title,
          slug,
          id,
        });
      } else {
        Category.findById(id, (err, category) => {
          if (err) return console.log(err);
          category.title = title;
          category.slug = slug;
          category.save((err) => {
            if (err) return console.log(err);

            req.flash('success', 'Category edited succesfully');
            res.redirect(`/admin/categories/edit-category/${category.slug}`);
          });
        });
      }
    });
  }
});

/**
 * GET admin delete page
 */
router.get('/delete-category/:id', (req, res) => {
  Category.findByIdAndRemove(req.params.id, (err) => {
    if (err) return console.log(err);
    req.flash('success', 'Categories deleted succesfully');
    res.redirect('/admin/categories/');
  });
});


export default router;
