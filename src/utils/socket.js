// const iniTilizaScocket = (server) => {
//   const socket = require("socket.io");
//   const io = socket(server, {
//     origin: "http://localhost:5173",
//   });
//   io.on("connection", (socket) => {
//     //handel event
//     console.log("connection");
//     socket.on("joinChat",()=>{

//     });
//     socket.on("sendMessage",()=>{


//     }),
//     socket.on("disconnect",()=>{


//     })
//   });
// };
// module.exports =iniTilizaScocket
const { Server } = require("socket.io");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("joinChat", ({firstName,userId, targetUserId }) => {
        console.log("@@@",userId,targetUserId)
        const roomId=[userId,targetUserId].sort().join("_");
        console.log(`${firstName} User joined chat:${roomId}`);
        socket.join(roomId)
    //   socket.join();
    });

    // socket.on("messageReceived",()=>{
    //   console.log('Receved messge')
    // })
    socket.on("sendMessage", ({

      firstName,
      userId,
      targetUserId,
      text
    }) => {
      const roomId=[userId,targetUserId].sort().join("_")
      console.log(firstName + " "+ text)
     io.to(roomId).emit("messageReceived",{firstName,text})
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = initializeSocket;