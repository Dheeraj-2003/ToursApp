const fs = require('fs')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require("../../models/tourModel")

require('dotenv').config();

dotenv.config({path: 'config.env'});
const DB = 'mongodb+srv://dheeraj:dheeraj24@cluster0.upac1os.mongodb.net/natours?retryWrites=true&w=majority'


mongoose.connect(process.env.DATABASE_LOCAL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() =>{
    console.log('DB connection successful');
}).catch(err=>{
    console.log(err)
})

// Read JSON file
const tours =  JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'))

// Import data into DB

const importData = async() =>{
    try {
        await Tour.create(tours)
        console.log('Data Succesfully loaded')
        process.exit()
    } catch(err){
        console.log(err);
        process.exit()
    }
}

// Delete all the data from DB

const deleteData = async() =>{
    try{
        await Tour.deleteMany()
        console.log('Data succesfully deleted')
        process.exit()
    }catch(err){
        console.log('Error deleting data:\n', err)
        process.exit()
    }
}

if(process.argv[2] === '--import'){
    importData()
} else if(process.argv[2] === '--delete'){
    deleteData()
}