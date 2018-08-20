import express from 'express';
import Page from '../models/page';

const router = express.Router();

/**
 * GET admin page index
 */
router.get('/', (req, res) => {
  Page.find({}).sort({ sorting: 1 }).exec((err, pages) => {
    res.render('admin/pages', {
      pages,
    });
  });
});

/**
 * GET add page
 */
router.get('/add-page', (req, res) => {
  const title = '';
  const slug = '';
  const content = '';
  res.render('admin/add_page', {
    title,
    slug,
    content,
  });
});

/**
 * POST page index
 */
router.post('/add-page', (req, res) => {
  req.checkBody('title', 'Title must have a value').notEmpty();
  req.checkBody('content', 'Content must have a value').notEmpty();
  const title = req.body.title;
  // let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
  let slug = title.replace(/\s+/g, '-').toLowerCase();
  const content = req.body.content;

  const errors = req.validationErrors();
  if (errors) {
    res.render('/add_page', {
      errors,
      title,
      slug,
      content,
    });
  } else {
    Page.findOne({ slug }, (err, page) => {
      if (page) {
        req.flash('danger', 'Page slug exists, choose another');
        res.render('admin/add_page', {
          title,
          slug,
          content,
        });
      } else {
        const page = new Page({
          title,
          slug,
          content,
          sorting: 100,
        });

        page.save((err) => {
          if (err) return console.log(err);

          req.flash('success', 'Page added');
          res.redirect('/admin/pages');
        });
      }
    });
  }
});

/**
 * POST admin reorder page index
 */
router.post('/reorder-page', (req, res) => {
  const ids = req.body['id()'];

  let count = 0;

  ids.forEach((id) => {
    count++;
    
    (function (count) {
      Page.findById(id, (err, page) => {
        page.sorting = counter;
        page.save((err) => {
          if (err) return console.log(err);
        });
      });
    }(count));
  });
});

/**
 * GET admin edit page
 */
router.get('/edit-page/:slug', (req, res) => {
  Page.findOne({ slug: req.params.slug }, (err, page) => {
    const pageId = page._id;
    if (err) return console.log(err);
    return res.render('admin/edit_page', {
      title: page.title,
      slug: page.slug,
      content: page.content,
      id: pageId,
    });
  });
});

/**
 * POST admin  edit page
 */
router.post('/edit-page/:slug', (req, res) => {
  req.checkBody('title', 'Title must have a value').notEmpty();
  req.checkBody('content', 'Content must have a value').notEmpty();
  const title = req.body.title;
  const content = req.body.content;
  // let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
  let slug = title.replace(/\s+/g, '-').toLowerCase();
  const id = req.body.id;

  const errors = req.validationErrors();
  if (errors) {
    res.render('admin/edit_page', {
      errors,
      title,
      slug,
      content,
      id,
    });
  } else {
    Page.findOne({ slug, _id: { $ne: id } }, (err, page) => {
      if (page) {
        req.flash('danger', 'Page slug exists, choose another');
        res.render('admin/edit_page', {
          title,
          slug,
          content,
          id,
        });
      } else {
        Page.findById(id, (err, page) => {
          if (err) return console.log(err);
          page.title = title;
          page.content = content;
          page.slug = slug;
          page.save((err) => {
            if (err) return console.log(err);

            req.flash('success', 'Page edited succesfully');
            res.redirect(`/admin/pages/edit-page/${ page.slug}`);
          });
        });
      }
    });
  }
});

/**
 * POST admin edit page index
 */
// router.post('/reorder-page', (req, res) => {
//   const ids = req.body['id()'];

//   let count = 0;

//   for (const id in ids) {
//     count++;
//     (function (count) {
//       Page.findById(id, (err, page) => {
//         page.sorting = counter;
//         page.save((err) => {
//           if (err) return console.log(err);
//         });
//       });
//     })(count);
//   }
// });

/**
 * GET admin delete page
 */
router.get('/delete-page/:id', (req, res) => {
  Page.findByIdAndRemove(req.params.id, function (err) {
    if (err) return console.log(err);
    req.flash('success', 'Page deleted succesfully');
    res.redirect(`/admin/pages/`);
  });
});


export default router;
