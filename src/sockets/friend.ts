const User = require('../models/users');

module.exports = function(io: any ,socket: any) {

  socket.on("add friend", (data: any) => {
    io.to(`${socket.id}`).emit("new friend", { data });
  });
  
}

