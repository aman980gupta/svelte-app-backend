const axios = require("axios");
const PORT = process.env.PORT || 5000
export default axios.create({baseURL:`http://localhost:${PORT}`})