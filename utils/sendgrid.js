import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send auction started email
export const sendAuctionStartedEmail = (users, auctionId) => {
  if (users.length > 0) {
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
  }
};

// Function to send auction winner email
export const sendAuctionWinnerEmail = (user, auctionId) => {
  const message = {
    to: user,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: "Auction winner",
    html: `<p>Congratulations, you have won the auction</p><br></br><p>Auction link = http://localhost:3000/auction/${auctionId}/running</p>`,
  };

  sgMail
    .send(message)
    .then(() => console.log("Auction winner mail send successfully"))
    .catch((err) => {
      Promise.reject(err);
    });
};

// Function to send password reset email
export const sendPasswordResetEmail = (user) => {
  const message = {
    to: user.email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: "Password reset",
    html: `<p>Click on the link here to reset your password.</p><br></br><p>Reset link= http://localhost:3000/new-password/${user.passwordResetString}.${user._id}</p>`,
  };

  sgMail
    .send(message)
    .then(() => console.log("Password reset email send successfully"))
    .catch((err) => {
      Promise.reject(err);
    });
};

// Function to send password reset success email
export const sendPasswordResetSuccessEmail = (user) => {
  const message = {
    to: user.email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: "Password reset successful",
    html: `<p>Your password was reset on ${new Date().toLocaleString()}.`,
  };

  sgMail
    .send(message)
    .then(() => console.log("Password reset successfully"))
    .catch((err) => {
      Promise.reject(err);
    });
};
