const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');


require('dotenv').config();

dotenv.config({path: 'config.env'});

const app = express();

const globalErrorHandler = require('./controllers/errorController')
const AppError = require('./utils/appError')
const tourRouter = require('./Routes/tourRoutes')
const userRouter = require('./Routes/userRoutes')


//Middlewares

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`))


app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    next();
})

//Routes

app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);

app.all('*',(req,res,next)=>{
    // const err = new Error(`Can't find ${req.originalUrl} on this server`)
    // err.statusCode = 404
    // err.status = 'fail'

    next(new AppError(`Can't find ${req.originalUrl} on this server`,404))
} )

app.use(globalErrorHandler)

module.exports = app;