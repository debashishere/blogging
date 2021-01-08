const article = require('./routes/article');
const auth = require('./routes/auth');
const connectDB = require('./config/db');
const profile = require('./routes/profile');
const dashboard = require('./routes/dashboard');
const home = require('./routes/home');

const dotenv = require('dotenv')
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');



//Load Configuration
dotenv.config({ path: './config/config.env' });

//passport config
require('./config/passport')(passport)

//connect db
connectDB();

const app = express();

//MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
}


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
const { select } = require('./helpers/hbs');
app.engine('handlebars', exphbs({
    helpers: {
        select
    }
}));
app.set('view engine', 'handlebars');

//public
app.use(express.static(path.join(__dirname, 'public')));

//method override for DELETE
app.use(methodOverride('_method'));

//passport
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/', home);
app.use('/article', article);
app.use('/profile', profile);
app.use('/auth', auth);
app.use('/dashboard', dashboard);





const port = process.env.PORT || 8080
app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`server at ${port}`);
})