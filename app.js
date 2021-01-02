const guest = require('./routes/guest');
const auth = require('./routes/auth');
const connectDB = require('./config/db');
const profile = require('./routes/profile');

const dotenv = require('dotenv')
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');

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
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false
}))







//VIEWS
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
//public
app.use(express.static(path.join(__dirname, 'public')));


//passport
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/', guest);
app.use('/profile', profile);
app.use('/auth', auth);





const port = process.env.PORT || 8080
app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`server at ${port}`);
})