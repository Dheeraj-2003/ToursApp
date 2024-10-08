const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const slugify = require('slugify')

const tourSchema = new mongoose.Schema({
    name : {
        type:String ,
        required: [true, 'A tour must have a name'], 
        unique: true,
    },
    slug: String,
    duration:{
        type: Number,
        required:[true,'A tour must have a duration']
    },
    maxGroupSize:{
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty:{
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: ['easy','medium','difficult']
    }
    ,
    ratingsAverage : { 
        type: Number, 
        min: 0, 
        max:5, 
        default: 4.5 
    },
    ratingsQuantity: {
        type:Number,
        default:0
    },
    price : { 
        type:Number , 
        required: [true, 'A tour must have a price']
    },
    priceDiscount: Number,
    summary:{
        type: String,
        trim: true,
        required: [true, 'A tour must have a Summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover:{
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    secretTour:{
        type: Boolean,
        default: false
    }
    ,
    startDates: [Date]
},
{
    toJSON: { virtuals: true },
    toObject: {virtuals: true}
})

tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
})

//DOCUMENT MIDDLEWARE: runs before .save() and.create()

// tourSchema.pre('save', function(next){
//     this.slug = slugify(this.name, { lower: true})
//     next()
// })

// // tourSchema.post('save', function(doc,next){
// //     console.log(docla);
// //     next()
// // })

//QUERY MIDDLEWARE
tourSchema.pre(/^find/,function(next){
    this.find({secretTour: {$ne: true}})
    next()
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;