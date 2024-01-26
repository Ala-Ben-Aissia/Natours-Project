import axios from "axios";
import { showAlert } from "./alerts";

export const login = async (email, password) => {
   try {
      const res = await axios({
         method: "POST",
         url: "/api/v1/auth/login",
         data: {
            email,
            password,
         },
      });
      // console.log(res);
      // res.data => API json response
      if (res.data.status === "success") {
         showAlert("success", "Logged in successfully!");
         location.assign("/"); // navigate to
      }
   } catch (err) {
      showAlert("error", err.response.data.message);
   }
};
