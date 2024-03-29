import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { CronJob } from "cron";
dotenv.config();

import authRouter from "./routes/authRoutes.js";
import bookRouter from "./routes/bookRoutes.js";
import stripeRouter from "./routes/stripeRoutes.js";
import walletRouter from "./routes/walletRoutes.js";
import userRouter from "./routes/userRoutes.js";
import exchangeRouter from "./routes/exchangeRoutes.js";
import auctionRouter from "./routes/auctionRoutes.js";
import conversationRouter from "./routes/conversationRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import globalErrorHandler from "./controllers/errorController.js";
import { sendAuctionStartedEmail, sendAuctionWinnerEmail } from "./utils/sendgrid.js";

import Auction from "./models/Auction.js";
import User from "./models/User.js";
import Book from "./models/Book.js";

const io = new Server(8900, { cors: { origin: "*" } });

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

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

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) && users.push();
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

// Socket io connection
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
  });

  // When a user places a bid
  socket.on("placedBid", async (data) => {
    const auction = await Auction.findOne({ book: data.bookId })
      .populate("book")
      .populate("owner")
      .populate("participants.participant")
      .populate("activities.user");

    io.emit("placedBidResponse", { auction, bidderId: data.currentUserId });
  });

  // When a user creates auction settings, create a new cron job for the future
  socket.on("createAuctionSchedule", async (data) => {
    const auction1 = await Auction.findById(data._id);

    // Auction start cron job
    new CronJob(
      new Date(auction1.schedule.date),
      async () => {
        const auction2 = await Auction.findById(data._id)
          .populate("book")
          .populate("owner")
          .populate("participants.participant")
          .populate("activities.user");
        auction2.started = true;
        await auction2.save();
        io.emit("auctionStarted", auction2);
        sendAuctionStartedEmail(auction2.emailSubscribers, data.book._id);
      },
      null,
      true
    );
    // Auction end cron job
    new CronJob(
      new Date(auction1.schedule.endDate),
      async () => {
        const auction2 = await Auction.findById(data._id)
          .populate("book")
          .populate("owner")
          .populate("participants.participant")
          .populate("activities.user");

        let winner = {};
        let highestBid = 0;

        // Find the winner
        auction2.participants.forEach((participant) => {
          let totalMoney = 0;
          participant?.bids?.forEach((bid) => {
            totalMoney += bid.amount;
          });
          if (totalMoney > highestBid) {
            highestBid = totalMoney;
            winner = {
              participant: participant.participant,
              bid: totalMoney,
              bids: participant.bids,
              _id: participant._id,
            };
          }
        });

        // Make the book unavailable
        const auctionedBook = await Book.findById(auction2.book._id);
        auctionedBook.available = false;
        await auctionedBook.save();

        auction2.completed = true;
        auction2.winner = winner;
        auction2.completedAt = new Date();
        await auction2.save();
        io.emit("auctionEnded", auction2);
        if (winner.participant) {
          const winnerUser = await User.findById(winner.participant);
          sendAuctionWinnerEmail(winnerUser.email, auction2.book._id);
        }
      },
      null,
      true
    );
  });

  // when user disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected");
    removeUser(socket.id);
    // io.emit("getUsers", users);
  });
});

// Mount routes
app.use("/api/auth", authRouter);
app.use("/api/books", bookRouter);
app.use("/api/stripe", stripeRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/user", userRouter);
app.use("/api/exchange", exchangeRouter);
app.use("/api/auction", auctionRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/message", messageRouter);

// Global error handler
app.use(globalErrorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(chalk.inverse.blue(`Server started at port ${port}`));
});
