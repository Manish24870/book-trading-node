import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

// Route = POST /api/conversation
// Function to create a new conversation
// Auth = true
export const createConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.body.senderId, req.body.receiverId] },
    }).populate("members");

    if (!conversation) {
      const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
      });
      newConversation.save().then(async (savedConversation) => {
        await savedConversation.populate("members");
        res.status(200).json({
          status: "success",
          conversation: savedConversation,
        });
      });
    } else {
      res.status(200).json({
        status: "success",
        conversation,
      });
    }
  } catch (err) {
    next(err);
  }
};

// Route = GET /api/conversation
// Function to get user conversations
// Auth = true
export const getConversations = async (req, res, next) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.user._id] },
    })
      .populate("members")
      .sort("-createdAt");
    res.status(200).json({
      status: "success",
      conversation,
    });
  } catch (err) {
    next(err);
  }
};
