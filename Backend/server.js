// yZjRPppkyMKwATAP

// server.js

const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./connection");
const signupRoutes = require("./routes/signup_route");
const loginRoutes = require("./routes/login_route");
const supervisorRoute = require("./routes/supervisor_route");
const productRoute = require("./routes/product_route");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());
app.use(cors());

// Use admin routes
app.use("/api", signupRoutes);
// Use login routes
app.use("/api/admin", loginRoutes);
// use supervisor routes
app.use("/api/supervisor", supervisorRoute);
// use product routes
app.use("/api/product", productRoute);
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
