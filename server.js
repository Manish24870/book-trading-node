import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";

import authRouter from "./routes/authRoutes.js";
import bookRouter from "./routes/bookRoutes.js";
import globalErrorHandler from "./controllers/errorController.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// Connect to databse
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log(chalk.inverse.blue("Databse connected..."));
  })
  .catch((err) => {
    console.log("Error connecting to databse");
    console.log(err);
  });

// Mount routes
app.use("/api/auth", authRouter);
app.use("/api/books", bookRouter);

// Global error handler
app.use(globalErrorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(chalk.inverse.blue(`Server started at port ${port}`));
});
