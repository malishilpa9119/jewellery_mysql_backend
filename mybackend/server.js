require("dotenv").config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('./config/dbConnection');

const userRouter = require('./routes/userRoute');
const adminRouter = require('./routes/adminRoute');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use('/public/images', express.static(path.join(__dirname, '/public/images')));
app.use(bodyParser.urlencoded({extended:true}));

app.use(cors());

app.use('/user', userRouter);
app.use('/admin', adminRouter);

//error handling
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        message:err.message,
    })
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Server is running on port 3000'));