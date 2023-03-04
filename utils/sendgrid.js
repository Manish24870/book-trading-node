import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log(process.env);

// Function to send auction started email
export const sendAuctionStartedEmail = (users, auctionId) => {
  const emails = users.map((user) => user.email);
  const message = {
    to: emails,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: "Auction started",
    html: `<p>The auction has started</p><br></br><p>Auction link = http://localhost:3000/auction/${auctionId}/running</p>`,
  };

  sgMail
    .send(message)
    .then(() => console.log("Auction started mail send successfully"))
    .catch((err) => {
      Promise.reject(err);
    });
};
