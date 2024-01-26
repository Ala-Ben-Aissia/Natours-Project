import axios from "axios";
import { showAlert } from "./alerts";
export const logout = async () => {
   try {
      const res = await axios({
         method: "GET",
         url: "/api/v1/auth/logout",
      });
      if (res.data.status === "success") {
         showAlert("success", "Logged out successfully!");
         // location.reload(true); // use true to bypass cache
         location.assign("/");
      }
   } catch (err) {
      showAlert("error", "An Error Occured!");
   }
};
