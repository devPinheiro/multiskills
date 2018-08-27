import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import session from 'express-session';
import expressValidator from 'express-validator';
import bodyParser from 'body-parser';
import mkdirp from 'mkdirp';
import resizeImg from 'resize-img';
import fs from 'fs-extra';
import fileUpload from 'express-fileupload';
import adminProducts from './routes/admin_products';
import page from './routes/page';
import adminPages from './routes/admin_pages';
import adminCategories from './routes/admin_categories';
import dbConfig from './config/database';

// connect to DB
mongoose.connect(dbConfig.database);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('Connected to DB');
});

// init app
const app = express();

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extende: false }));

// Set global errors variable and messages
app.locals.errors = null;
app.locals.messages = null;

// Express File Uploads
app.use(fileUpload());

// Express validator
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
    const namespace = param.split('.');
    const root = namespace.shift();
    let formParam = root;
    while (namespace.length) {
      formParam += `[${namespace.shift()}]`;
    }
    return {
      param: formParam,
      msg,
      value,
    };
  },
  customValidators: {
    isImage(value, filename) {
      const extension = (path.extname(filename)).toLowerCase();
      switch (extension) {
        case '.jpg':
          return '.jpg';
        case '.png':
          return '.png';
        case '.jpeg':
          return '.jpeg';
        case '':
          return '.jpg';
        default:
          return false;
      }
    },
  },
}));

// Express messages middleware
app.use(require('connect-flash')());

app.use((req, res, next) => {
  res.locals.messages = newFunction()(req, res);
  next();
});

// Express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: 'true',
  saveunintialized: 'true',
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set public folder
app.use(express.static(path.join(__dirname, 'public/')));

// Set routes
app.use('/', page);
app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategories);
app.use('/admin/products', adminProducts);

// start server
const port = 4000;

app.listen(port, () => {
  console.log(`server started on port: ${port}`);
});
function newFunction() {
  return require('express-messages');
}
