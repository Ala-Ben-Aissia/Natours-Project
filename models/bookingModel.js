const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
   user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: [true, "Booking must belong to a user"],
   },
   tour: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Tour",
      required: [true, "Booking must belong to a tour"],
   },
   price: {
      type: Number,
      required: [true, "Booking must have a price"],
   },
   createdAt: {
      type: Date,
      default: Date.now(),
   },
   paid: {
      type: Boolean,
      default: true,
   },
});

bookingSchema.pre("save", function (next) {
   this.createdAt = Date.now();
   next();
});

bookingSchema.pre(/^find/, function (next) {
   // does not affect performance since only admins and guides are allowed to query bookings
   this.populate("user").populate("tour", "name");
   next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
