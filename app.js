if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}


const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const ejsMate = require('ejs-mate')
const User = require('./models/user')
const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL ||'mongodb://localhost:27017/Scenic_Sites_DB'
const { siteSchema, reviewSchema } = require('./schemas.js')
const ExpressError = require('./utils/ExpressError')

const methodOverride = require('method-override')



const { validate } = require('./models/campground')

const userRoutes = require('./routes/users')
const sitesRoutes = require('./routes/sites')
const reviewsRoutes = require('./routes/reviews')



mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database Connected")
})

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


// To parse req.body
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const store = MongoStore.create({
    mongoUrl: dbURL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'ThisIsAProcess'
    }
});
store.on("error", function(e){
    console.log("Session store error")
})
const sessionConfig = {
    name:"session",
    secret: 'ThisIsAProcess',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {

    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes)
app.use('/sites', sitesRoutes)
app.use('/sites/:id/review', reviewsRoutes)
app.get('/', (req, res) => {
    res.render('home')
})



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    //setting defautls if not given
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})