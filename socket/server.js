const io = require("socket.io")(8900, {
  cors: {
    origin: "*",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) && users.push();
};

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
  });
  // when user disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected");
    // removeUser(socket.id);
    // io.emit("getUsers", users);
  });
});
