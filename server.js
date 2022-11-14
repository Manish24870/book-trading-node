import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(chalk.inverse.blue(`Server started at port ${port}`));
});
