const guest = require('./routes/guest');
const connectDB = require('./config/db');

const dotenv = require('dotenv')
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');

//Load Configuration
dotenv.config({ path: './config/config.env' });


//connect db
connectDB();

const app = express();

//MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());









//VIEWS
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
//public
app.use(express.static(path.join(__dirname, 'public')));


//Routes
app.use('/', guest);






const port = process.env.PORT || 8080
app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`server at ${port}`);
})