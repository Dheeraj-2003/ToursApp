const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

exports.aliasTopTours = (req,res,next) =>{
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingAverage,summary,difficulty'
    next()
}

exports.getAllTours = catchAsync(async(req,res,next) => {

    // Execute Query
    const features = new APIFeatures(Tour.find(),req.query).filter().sort().limitFields().paginate()
    const tours = await features.query

    res.status(200).json({
        status: 'success',
        results: tours.length,
        message:'Tour list',
        data: {
            tours
        }
    })

    // try{
    //     //Execute Query
    //     const features = new APIFeatures(Tour.find(),req.query).filter().sort().limitFields().paginate()
    //     const tours = await features.query

    //     // res.status(200).json({
    //     //     status: 'success',
    //     //     results: tours.length,
    //     //     message:'Tour list',
    //     //     data: {
    //     //         tours
    //     //     }
    //     // })
    // } catch(err){
    //     res.status(404).json({
    //         status: 'fail',
    //         message: err
    //     })
    // }

})

exports.getTourById = catchAsync(async(req,res,next) => {
    const tour = await Tour.findById(req.params.id)

    if(!tour) {
        return next(new AppError('No tour found with that ID', 404))
    }

    res.status(200).json({
        status: 'succes',
        data:{
            tour
        }
    }) 

})

exports.createTour = catchAsync(async(req,res,next) => {

        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'created',
            data:{
                tour: newTour
            }
        })

})

exports.updateTour = catchAsync(async(req,res,next) => {

        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        if(!tour) {
            return next(new AppError('No tour found with that ID', 404))
        }

        res.status(200).json({
            status: 'success',
            message: "Updated the tour",
            data: {
                tour
            }
        })
    
})
exports.deleteTour = catchAsync(async(req,res,next) => {
        await Tour.findByIdAndDelete(req.params.id)

        res.status(204).json({
            status: 'success',
            message: "Deleted the tour",
            data: null
        })
}
)
exports.getTourStats = catchAsync(async(req,res,next) =>{
        const stats = await Tour.aggregate([
            {
                $match: {ratingsAverage:{$gte:4.5}}
            },
            {
                $group : {
                    _id : '$difficulty', 
                    num: {$sum:1 },
                    numRatings: {$sum: '$ratingsQuantity'},
                    avgRating: {$avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'}
                }
            },
            {
                $sort: {
                    avgPrice : 1
                }
            }
            // {
            //     $match: {
            //         _id: { $ne: 'easy'}
            //     }
            // }
        ])

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        })
})

exports.getMonthlyPlan = catchAsync(async(req,res,next) =>{
        const year = req.params.year * 1
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lt: new Date(`${year+1}-01-01`)
                    }
                }
            },
            {
                $group:{
                    _id: { $month: '$startDates'},
                    numTours: {$sum : 1},
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields: {
                    month: '$_id'
                }
            },
            {
                $project:{
                    $id:0
                }
            },
            {
                $sort: { numTours : -1}
            },
            {
                $limit: 12
            }
        ])

        res.status(200).json({
            stats: 'success',
            data:{
                plan
            }
        })
})