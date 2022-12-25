const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/camp-advisor', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Database connected")
    })
    .catch(err => {
        console.log("OH NO DATABASE CONNECTION ERROR!!!!")
        console.log(err)
    });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "63a4d1ac6ff0d08dac387c3e",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa nobis, exercitationem id eligendi et minima odit. Fuga veniam pariatur repudiandae provident ipsam ad earum corrupti ab voluptate deserunt, illum ut!',
            price: price,
            geometry: { type: 'Point', coordinates: [cities[random1000].longitude, cities[random1000].latitude] },
            images: [
                {
                    url: 'https://res.cloudinary.com/dtuw0raul/image/upload/v1671875157/CampAdvisor/gekhygdt9vsnwbbh8ty1.jpg',
                    filename: 'CampAdvisor/gekhygdt9vsnwbbh8ty1'
                },
                {
                    url: 'https://res.cloudinary.com/dtuw0raul/image/upload/v1671875157/CampAdvisor/yonnwxep0vnezx1amjo0.jpg',
                    filename: 'CampAdvisor/yonnwxep0vnezx1amjo0'
                },
                {
                    url: 'https://res.cloudinary.com/dtuw0raul/image/upload/v1671875161/CampAdvisor/ehn1jckzinc1w5codpts.jpg',
                    filename: 'CampAdvisor/ehn1jckzinc1w5codpts'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});