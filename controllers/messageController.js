import Message from "../models/Message.js";

// Route = POST /api/message
// Function to create a new message
// Auth = true
export const createMessage = async (req, res, next) => {
  try {
    const newMessage = new Message({
      sender: req.user._id,
      text: req.body.text,
      conversationId: req.body.conversationId,
    });
    newMessage.save().then(async (savedMessage) => {
      await savedMessage.populate({
        path: "conversationId",
        populate: {
          path: "members",
          model: "User",
        },
      });
      await savedMessage.populate("sender");

      res.status(200).json({
        status: "success",
        message: savedMessage,
      });
    });
  } catch (err) {
    next(err);
  }
};

// Route = POST /api/message/:conversationId
// Function to get all the messages of a conversation
// Auth = true
export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    })
      .populate({
        path: "conversationId",
        populate: {
          path: "members",
          model: "User",
        },
      })
      .populate("sender");

    res.status(200).json({
      status: "success",
      messages,
    });
  } catch (err) {
    next(err);
  }
};
