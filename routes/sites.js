const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const sites = require('../controllers/sites')
const Campground = require('../models/campground')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

const { isLoggedIn, isAuthor, validateSite } = require('../middleware')


router.route('/')
    .get(catchAsync(sites.index))
    .post(isLoggedIn, upload.array('image'), validateSite, catchAsync(sites.createSite))



router.get('/new', isLoggedIn, sites.renderNewForm)


router.route('/:id')
    .get(catchAsync(sites.showSite))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateSite, catchAsync(sites.updateSite))
    .delete(isLoggedIn, isAuthor, catchAsync(sites.deleteSite))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(sites.renderEditForm))
module.exports = router