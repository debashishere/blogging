//core packages
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
//Database
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');
// routes
const api = require('./routes/api');
const upload = require('./routes/upload');
const profile = require('./routes/profile');
const dashboard = require('./routes/dashboard');
const home = require('./routes/home');
const article = require('./routes/article');
const auth = require('./routes/auth');
const comments = require('./routes/comment');
//dev
const dotenv = require('dotenv')
const logger = require('morgan');


//Load Configuration
dotenv.config({ path: './config/config.env' });

//passport config
require('./config/passport')(passport)

//connect db
connectDB();

const app = express();

//MIDDLEWARE
app.use(logger('tiny'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//session
app.use(session({
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        // clear session from store
        autoRemove: 'interval',
        autoRemoveInterval: 60, // (In minutes after session expires). Defaut in minute
        touchAfter: 24 * 3600 // pdate the session after (time period in seconds)
    }),
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    name: process.env.COOKIE_NAME,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60, // session will aslo expire 60 minutes
    }
}))


//VIEWS
//helpers
const { select, getFormatedDate, getRelativeDate, isCreator } = require('./helpers/hbs');
app.engine('handlebars', exphbs({
    helpers: {
        select,
        getFormatedDate,
        getRelativeDate,
        isCreator
    }
}));
app.set('view engine', 'handlebars');

//public
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));

//method override for DELETE
app.use(methodOverride('_method'));

//passport
app.use(passport.initialize());
app.use(passport.session());

//set global variables
app.use(function (req, res, next) {
    if (req.user) {
        loggedUser = req.user.toObject();
        res.locals.loggedUser = loggedUser;
        next();
    } else {
        res.locals.loggedUser = null
        next();
    }

})

// post cover_images TODO: store this in redis
global.__basedir = __dirname;
global.coverImages = []
global.updatedCoverImages = []
global.articleImages = []

//Routes
app.use('/', home);
app.use('/api', api);
app.use('/comments', comments)
app.use('/upload', upload);
app.use('/article', article);
app.use('/profile', profile);
app.use('/auth', auth);
app.use('/dashboard', dashboard);






const port = process.env.PORT || 8080
app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`server at ${port}`);
})