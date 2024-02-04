const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const Review = require("../models/reviewModel");
const Booking = require("../models/bookingModel");

const deleteData = async (Model) => {
   const collection = Model.collection.name;
   await Model.deleteMany();
   console.log(`${collection} successfully deleted 🚮`);
   process.exit();
};

const [action, data] = process.argv[2]?.split("--") ?? [0, 0];
if (action === "delete") {
   if (data === "tours") deleteData(Tour);
   if (data === "users") deleteData(User);
   if (data === "reviews") deleteData(Review);
   if (data === "bookings") deleteData(Booking);
}
module.exports = deleteData;
