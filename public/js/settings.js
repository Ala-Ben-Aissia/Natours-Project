import axios from "axios";
import { showAlert } from "./alerts";

export const updateUserData = async (username, email) => {
   try {
      const res = await axios.patch("/api/v1/auth/update-me", {
         username,
         email,
      });
      if (res.data.status === "success") {
         showAlert("success", "User successfully updated!");
         setTimeout(() => {
            location.reload(true);
         }, 2000);
      }
   } catch (err) {
      showAlert("error", err.response.data.message);
   }
};
