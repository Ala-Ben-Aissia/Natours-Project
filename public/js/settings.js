import axios from "axios";
import { showAlert } from "./alerts";

export const updateUserData = async (data, type) => {
   try {
      const res = await axios.patch(
         type === "password"
            ? "/api/v1/auth/update-password"
            : "/api/v1/auth/update-me",
         data
      );
      if (res.data.status === "success") {
         showAlert("success", `${type} successfully updated!`);
         setTimeout(() => {
            type === "password"
               ? location.assign("/login")
               : location.reload(true);
         }, 2000);
      }
   } catch (err) {
      if (err.response.data.error.code === 11000) {
         const [[field, value]] = Object.entries(
            err.response.data.error.keyValue
         );
         const msg = `${field} '${value}' already exists`;
         showAlert("error", msg);
      } else {
         showAlert("error", err.response.data.message);
      }
   }
};
