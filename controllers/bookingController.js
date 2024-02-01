const { default: Stripe } = require("stripe");
const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
   // booked tour
   const tour = await Tour.findById(req.params.tourId);
   // create checkout session
   // https://stripe.com/docs/api/checkout/sessions/create
   const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/`,
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
