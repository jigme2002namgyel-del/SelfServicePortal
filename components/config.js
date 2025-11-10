// js/config.js
let API_URL = "/api"; // default
if (typeof window !== "undefined") {
  API_URL =
    window.location.hostname === "selfservice.bdb.bt"
      ? "https://selfservice.bdb.bt/api"
      : "/api";
}

const config = {
  api_url: API_URL,
  //api_url: "https://crm.bdb.bt/api",
  //api_url: "http://192.168.1.234/api",
  apiToken: "4f32eeb90fe529d:c147296c0562085",
};
//User Name: Portal
//info@bdb.bt

export default config;
