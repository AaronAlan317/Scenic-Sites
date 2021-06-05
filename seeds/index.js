
const mongoose = require('mongoose')
const cites = require('./cities')
const { places, descriptors } = require('./seedHelpers')


const Campground = require('../models/campground')
const cities = require('./cities')

mongoose.connect('mongodb://localhost:27017/Scenic_Sites_DB', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database Connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)]
const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 200; i++) {
        const rand1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const site = new Campground({
            author: '60b877cd3ec1b07e10a549ed',
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Similique repudiandae culpa ratione facilis cupiditate deleniti totam voluptates quae delectus quisquam temporibus qui, at itaque ad architecto eius accusamus dignissimos pariatur.',
            price,
            geometry: {
                "type": "Point",
                "coordinates": [cities[rand1000].longitude, cities[rand1000].latitude]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dsmmwdkb9/image/upload/v1622835406/ScenicSites/vrrtyprevaukzf5mypgc.jpg',
                    filename: 'ScenicSites/vrrtyprevaukzf5mypgc'
                },
                {
                    url: 'https://res.cloudinary.com/dsmmwdkb9/image/upload/v1622835406/ScenicSites/vxr0ms4saxyrxkgtgahl.jpg',
                    filename: 'ScenicSites/vxr0ms4saxyrxkgtgahl'
                }
            ],

        })
        await site.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})