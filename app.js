// External dependency
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');

// Internal dependency
const homeRoute = require('./route/homeRoute');
const loginRoute = require('./route/loginRoute');
const signupRoute = require('./route/signupRoute');
const showDrugRoute = require('./route/showDrugRoute');
const addDrugRoute = require('./route/addDrugRoute');
const dueRoute = require('./route/dueRoute');

// express app
const app = express();
dotenv.config();

// data base connection
mongoose
    .connect(process.env.MONGOOSE_STRING)
    .then(() => {
        console.log('data base connection successfully');
    })
    .catch((err) => {
        console.log(err);
    });

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// route
app.use('/', homeRoute);
app.use('/login', loginRoute);
app.use('/signup', signupRoute);
app.use('/show', showDrugRoute);
app.use('/add', addDrugRoute);
app.use('/due', dueRoute);

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// template engine
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
});
