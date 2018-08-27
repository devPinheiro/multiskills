import express from 'express';
import mkdirp from 'mkdirp';
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

  Category.find((err, categories) => {
    res.render('admin/add_product', {
      title,
      desc,
      categories,
      price,
    });
  });
});

/**
 * POST page index
 */
router.post('/add-product', (req, res) => {
  const imageFile = typeof req.files.image !== 'undefined' ? req.files.image : '';
  req.checkBody('title', 'Title must have a value').notEmpty();
  req.checkBody('desc', 'Description must have a value').notEmpty();
  req.checkBody('price', 'Price must have a value').isDecimal();
  req.checkBody('iamge', 'Image must have be uploaded').isImage(imageFile);
  const title = req.body.title;
  const desc = req.body.desc;
  const price = req.body.price;
  const category = req.body.category;
  const slug = title.replace(/\s+/g, '-').toLowerCase();
  const errors = req.validationErrors();
  if (errors) {
    Category.find((err, categories) => {
      res.render('admin/add_product', {
        errors,
        title,
        desc,
        categories,
        price,
      });
    });
  } else {
    Product.findOne({ slug }, (err, product) => {
      if (product) {
        req.flash('danger', 'Product slug exists, choose another');
        res.render('admin/add_product', {
          title,
          slug,
        });
      } else {
        const finalPrice = parseFloat(price).toFixed(2);
        const product = new Product({
          title,
          desc,
          finalPrice,
          category,
          slug,
        });

        product.save((errNew) => {
          if (err) return console.log(errNew);
          mkdirp(`/public/product_images/${product._id}/`, (kerr) => {
            console.log(kerr);
          });

          mkdirp(`/public/product_images/${product._id}/gallery`, (merr) => {
            console.log(merr);
          });

          mkdirp(`/public/product_images/${product._id}/gallery/thumbs`, (terr) => {
            console.log(terr);
          });

          if (imageFile !== '') {
            const productImage = req.files.image;
            const path = `/public/product_images/${product._id}/${imageFile}`;
           
            productImage.mv(path, (nerr) => {
              console.log(nerr);
            });
          }
          req.flash('success', 'Product added');
          res.redirect('/admin/products');
        });
      }
    });
  }
});


// /**
//  * GET admin edit category page
//  */
// router.get('/edit-category/:slug', (req, res) => {
//   Category.findOne({ slug: req.params.slug }, (err, category) => {
//     const categoryId = category._id;
//     if (err) return console.log(err);
//     return res.render('admin/edit_category', {
//       title: category.title,
//       slug: category.slug,
//       id: categoryId,
//     });
//   });
// });

// /**
//  * POST admin edit category page
//  */
// router.post('/edit-category/:slug', (req, res) => {
//   req.checkBody('title', 'Title must have a value').notEmpty();
//   const title = req.body.title;
//   const slug = title.replace(/\s+/g, '-').toLowerCase();
//   const id = req.body.id;

//   const errors = req.validationErrors();
//   if (errors) {
//     res.render('admin/edit_category', {
//       errors,
//       title,
//       slug,
//       id,
//     });
//   } else {
//     Category.findOne({ slug, _id: { $ne: id } }, (err, page) => {
//       if (page) {
//         req.flash('danger', 'Page slug exists, choose another');
//         res.render('admin/edit_category', {
//           title,
//           slug,
//           id,
//         });
//       } else {
//         Category.findById(id, (err, category) => {
//           if (err) return console.log(err);
//           category.title = title;
//           category.slug = slug;
//           category.save((err) => {
//             if (err) return console.log(err);

//             req.flash('success', 'Category edited succesfully');
//             res.redirect(`/admin/categories/edit-category/${category.slug}`);
//           });
//         });
//       }
//     });
//   }
// });

// /**
//  * GET admin delete page
//  */
// router.get('/delete-category/:id', (req, res) => {
//   Category.findByIdAndRemove(req.params.id, (err) => {
//     if (err) return console.log(err);
//     req.flash('success', 'Categories deleted succesfully');
//     res.redirect('/admin/categories/');
//   });
// });


export default router;
