import axios from "axios";
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
         window.setTimeout(() => {
            // alert("Logged in successfully");
            location.assign("/"); // navigate to
         });
      }
   } catch (err) {
      alert(err.response.data.message);
   }
};
