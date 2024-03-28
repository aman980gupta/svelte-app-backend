const express = require("express");
const bodyParser = require("body-parser")
const env = require("dotenv").config()
const PORT = process.env.PORT || 5000
const cookieParser = require("cookie-parser")
const userRoute = require("./routes/user")
const dealerRoute = require("./routes/dealer")

const app = express();
app.use(cookieParser())
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use("/",userRoute);
app.use("/dealer",dealerRoute);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});