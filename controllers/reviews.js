const Review = require('../models/review')
const Campground = require('../models/campground')

module.exports.creatReview = async (req, res) => {

    const site = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    site.reviews.push(review)
    await review.save()
    await site.save()
    req.flash('success', 'Created review')
    res.redirect(`/sites/${site._id}`)

}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Deleted review')
    res.redirect(`/sites/${id}`)

}