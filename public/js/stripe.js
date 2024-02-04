import axios from "axios";
import { showAlert } from "./alerts";
const stripe = Stripe(process.env.STRIPE_PUBLIC_KEY);
export const bookTour = async (tourId) => {
   try {
      // Get checkout session from API
      const session = await axios.post(
         `/api/v1/bookings/checkout-session/${tourId}`
      );
      if (session.data.status === "success") {
         await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
         });
      }
      // checkout form + charge
   } catch (error) {
      showAlert("error", error);
   }
};
