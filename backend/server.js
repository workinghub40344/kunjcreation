const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productRoutes = require("./routes/productRoutes.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");

app.get("/", (req, res) => {
  res.send("API is running...");
});

const adminRoutes = require("./routes/adminRoutes.js");

app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
