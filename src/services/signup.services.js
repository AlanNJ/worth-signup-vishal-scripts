import axios from "axios";
import Swal from "sweetalert2";
const API_URL = "http://localhost:8081/api/auth/";

const register = (username, email, phoneNo, password, referalUser) => {
  Swal.fire({
    title: "Please wait...",
    text: "Processing your request",
  });
  return axios.post(API_URL + "signup", {
    username,
    email,
    phoneNo,
    password,
    referalUser,
  });
};

const verifyUser = (code) => {
  return axios.get(API_URL + "confirm/" + code).then((response) => {
    return response.data;
  });
};

export default {
  register,
  verifyUser,
};
