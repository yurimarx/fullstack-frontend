import axios from "axios";

const { REACT_APP_API_HOST } = process.env;

export default axios.create({
  baseURL: REACT_APP_API_HOST,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Authorization", 
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
    "Content-type": "application/json"
  },
  auth: {
    username: "_SYSTEM",
    password: "SYS"
  }
});
