import express from 'express';
import mkdirp from 'mkdirp';
import fs from 'fs';
import resizeImg from 'resize-img';

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
  const imageFile = typeof req.files.image !== 'undefined' ? req.files.image.name : '';
  req.checkBody('title', 'Title must have a value').notEmpty();
  req.checkBody('desc', 'Description must have a value').notEmpty();
  req.checkBody('price', 'Price must have a value').isDecimal();
  req.checkBody('image', 'Image must have be uploaded').isImage(imageFile);
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
        const finalPrice = parseFloat(price).toFixed(2);
        const product = new Product({
          title,
          errors,
          desc,
          price: finalPrice,
          category,
          slug,
          image: imageFile,
        });

        product.save((err) => {
          if (err) return console.log(err);
          mkdirp(`public/product_images/${product._id}/`, (kerr) => {
            console.log(kerr);
          });

          mkdirp(`public/product_images/${product._id}/gallery`, (merr) => {
            console.log(merr);
          });

          mkdirp(`public/product_images/${product._id}/gallery/thumbs`, (terr) => {
            console.log(terr);
          });

          if (imageFile !== '') {
            const productImage = req.files.image;
            const path = `public/product_images/${product._id}/${imageFile}`;

            productImage.mv(path, (err) => {
              console.log(err);
            });
          } else {
            console.log('empty image name');
          }

          req.flash('success', 'Product added');
          res.redirect('/admin/products');
        });
      }
    });
  }
});


/**
 * GET admin edit product
 */
router.get('/edit-product/:id', (req, res) => {
  let errors;
  if (req.session.errors) {
    errors = req.session.errors;
  }
  req.session.errors = null;

  Category.find((err, categories) => {
    Product.findById(req.params.id, (err, p) => {
      if (err) {
        console.log(err);
        res.redirect('/admin/products');
      } else {
        const galleryDir = `public/product_images/${p._id}/gallery`;
        let galleryImages = null;

        fs.readdir(galleryDir, (err, files) => {
          if (err) {
            console.log(err);
          } else {
            galleryImages = files;
            res.render('admin/edit_product', {
              title: p.title,
              id: p._id,
              errors: p.errors,
              desc: p.desc,
              categories,
              category: p.category.replace(/\s+/g, '-').toLowerCase(),
              price: p.price,
              image: p.image,
              galleryImage: galleryImages,
            });
          }
        });
      }
    });
  });
});

/**
 * POST admin edit product
 */
router.post('/edit-product/:id', (req, res) => {
  const imageFile = typeof req.files.image !== 'undefined' ? req.files.image.name : '';
  req.checkBody('title', 'Title must have a value').notEmpty();
  req.checkBody('desc', 'Description must have a value').notEmpty();
  req.checkBody('price', 'Price must have a value').isDecimal();
  req.checkBody('image', 'Image must have be uploaded').isImage(imageFile);

  const title = req.body.title;
  const desc = req.body.desc;
  const price = req.body.price;
  const category = req.body.category;
  const slug = title.replace(/\s+/g, '-').toLowerCase();
  const pimage = req.body.pimage;
  const id = req.params.id;
  const errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect(`/admin/products/edit-product/${id}`);
  } else {
    Product.findOne({ slug, _id: { $ne: id } }, (err, p) => {
      if (err) console.log(err);

      if (p) {
        req.flash('danger', 'Product title exists');
        res.redirect(`/admin/products/edit-product/${id}`);
      } else {
        Product.findById(id, (err, pr) => {
          if (err) { console.log(err); }

          pr.title = title;
          pr.slug = slug;
          pr.desc = desc;
          pr.price = parseFloat(price).toFixed(2);
          if (imageFile !== '') {
            pr.image = imageFile;
          }

          pr.save((err) => {
            if (err) { console.log(err); }

            if (imageFile !== '') {
              if (pimage !== '') {
                fs.unlink(`public/public_images/${id}/${pimage}`, (err) => {
                  if (err) { console.log(err); }
                });
              }
              const productImage = req.files.image;
              const path = `public/product_images/${id}/${imageFile}`;

              productImage.mv(path, (err) => {
                console.log(err);
              });
            }

            req.flash('success', 'Product edited');
            res.redirect('/admin/products');
          });
        });
      }
    });
  }
});

/**
 * POST product gallery
 */
router.post('/product-gallery/:id', (req, res) => {
  const productImage = req.files.file;
  const id = req.params.id;
  const path = `public/product_images/${id}/gallery/${req.files.file.name}`;
  const thumbPath = `public/product_images/${id}/gallery/thumbs/${req.files.file.name}`;

  productImage.mv(path, (err) => {
    if (err) { console.log(err); }
    resizeImg(fs.readFileSync(path), { width: 100, height: 100 }).then((buf) => {
      fs.writeFileSync(thumbPath, buf);
    });
  });

  res.sendStatus(200);
});


/**
 * GET admin delete page
 */
router.get('/delete-product/:id', (req, res) => {
  Product.findByIdAndRemove(req.params.id, (err) => {
    if (err) return console.log(err);
    req.flash('success', 'Product deleted succesfully');
    res.redirect('/admin/products/');
  });
});


export default router;
