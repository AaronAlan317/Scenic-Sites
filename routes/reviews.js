const express = require('express')
const router = express.Router({ mergeParams: true })

const Review = require('../models/review')
const Campground = require('../models/campground')
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware')
const { reviewSchema } = require('../schemas.js')
const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')
const reviews = require('../controllers/reviews')





router.post('/', isLoggedIn, validateReview, catchAsync(reviews.creatReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router