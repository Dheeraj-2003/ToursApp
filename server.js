const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException',err => {
    console.log('UNHANDLED EXCEPTION! Shutting down...')
    console.log(err.name,err.message)
    process.exit(1)
})

require('dotenv').config();
const app = require('./app');

const DB = 'mongodb+srv://dheeraj:dheeraj24@cluster0.upac1os.mongodb.net/natours?retryWrites=true&w=majority'

dotenv.config({path: 'config.env'});

mongoose.connect(process.env.DATABASE_LOCAL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() =>{
    console.log('DB connection successful');
})

const port = process.env.PORT || 3000
const server = app.listen(port,() => {
    console.log(`App running on port ${port}`)
});

process.on('unhandledRejection',err => {
    console.log('UNHANDLED REJECTION! Shutting down...')
    console.log(err.name,err.message)
    server.close(()=>{
        process.exit(1)
    })
})