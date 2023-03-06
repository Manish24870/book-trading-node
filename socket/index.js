const io = require("socket.io")(8910, {
  cors: {
    origin: "*",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  console.log("REMOVED");
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // For video call
  socket.emit("me", socket.id);

  socket.on("conversationSelected", (id) => {
    let user = users.filter((el) => el.userId === id);
    if (user) {
      io.emit("toCallUser", user[0]);
    }
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("endCall", (data) => {
    io.emit("callEnded");
  });

  // take user id and socket id from user
  // when user connects
  console.log("Chat User connected");
  socket.on("addUser", (userId) => {
    console.log(userId);
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // send and get message
  socket.on("sendMessage", ({ senderInfo, receiverInfo, text }) => {
    const user = getUser(receiverInfo._id);
    io.to(user.socketId).emit("getMessage", {
      senderInfo,
      text,
    });
  });

  // when user disconnects
  socket.on("disconnect", () => {
    console.log("Chat User disconnected");
    socket.broadcast.emit("callEnded");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
