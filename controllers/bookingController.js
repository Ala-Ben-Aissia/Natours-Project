const { default: Stripe } = require("stripe");
const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const Booking = require("../models/bookingModel");
require("dotenv").config();
const {
   getAllDocs,
   getDoc,
   createDoc,
   updateDoc,
   deleteDoc,
} = require("../utils/docCRUD");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.getAllBookings = getAllDocs(Booking);
exports.getBooking = getDoc(Booking);
exports.AddBooking = createDoc(Booking);
exports.updateBooking = updateDoc(Booking);
exports.deleteBooking = deleteDoc(Booking);

exports.createCheckoutSession = catchAsync(async (req, res, next) => {
   // booked tour
   const tour = await Tour.findById(req.params.tourId);
   // create checkout session
   // https://stripe.com/docs/api/checkout/sessions/create
   const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/?user=${
         req.user.id
      }&tour=${tour.id}&price=${tour.price}`,
      // temporary (unsecure req.query use since anyone can book tours without paying)
      // exposed request query
      cancel_url: `${req.protocol}://${req.get("host")}/tours/${
         tour.slug
      }`,
      // return_url: `${req.protocol}://${req.get("host")}/`,
      customer_email: req.user.email,
      client_reference_id: tour.id,
      line_items: [
         {
            quantity: 1,
            price_data: {
               currency: "usd",
               product_data: {
                  name: tour.id,
                  description: tour.summary,
                  images: [
                     `https://www.natours.dev/img/tours/${tour.imageCover}`,
                  ],
               },
               unit_amount: tour.price * 100,
            },
         },
      ],
   });
   // checkout session response
   res.status(200).json({
      status: "success",
      session,
   });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
   const { user, tour, price } = req.query; // check success_url
   if (!(user && tour && price)) return next();
   await Booking.create({ user, tour, price });
   res.redirect(req.originalUrl.split("?")[0]); // do not expose query string params
});
