const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelper");
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("DataBase Connected");
});
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 400; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "63d51caf2c8e37eb55153bd1",
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        " Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque praesentium asperiores totam incidunt placeat eveniet magnam veritatis ducimus labore, provident est corrupti nemo! Eius quia, voluptate sapiente sequi ex tempora!",
      location: `${cities[random1000].city},${cities[random1000].state}`,
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/ds3bp8jkn/image/upload/v1674972914/YelpCamp/f7bkucij7rj0mi9h31nf.jpg",
          filename: "YelpCamp/f7bkucij7rj0mi9h31nf",
        },
        {
          url: "https://res.cloudinary.com/ds3bp8jkn/image/upload/v1674972911/YelpCamp/mg7wb7iq5onjsdfurhjo.jpg",
          filename: "YelpCamp/mg7wb7iq5onjsdfurhjo",
        },
      ],
    });
    await camp.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
