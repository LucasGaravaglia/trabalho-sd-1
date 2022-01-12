import * as bodyParser from "body-parser";
import * as express from "express";
import * as http from "http";
import { Server, Socket } from "socket.io";
import { User, Chat } from "./chat";

const app = express();
const jsonParser = bodyParser.json();
const port = process.env.PORT || 3333;

const chat = Chat();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["*"],
    allowedHeaders: ["*"],
    credentials: false,
  },
});

io.on("connection", async (socket) => {
  console.log(
    `New connection: ${socket.id}. This connection is not registered yet.`
  );
  try {
    if (typeof socket.handshake.query.name === "undefined")
      throw new Error("invalid query.name");
    let connections = chat.getOnlineUsers();
    chat.insert(socket.handshake.query.name, socket);
    connections.forEach((user) => {
      chat.getSocket(user.socketId).emit("newConnection", {
        name: socket.handshake.query.name,
        id: socket.id,
      });
    });
  } catch (err) {
    console.log(`Error(register - New Connection): ${err.message}`);
  }

  socket.on("message", (data) => {
    try {
      let objDate = new Date();
      chat.getSocket(data.receiver).emit("message", {
        message: data.message,
        name: data.senderName,
        date: `${objDate.getDate()}-${
          objDate.getMonth() + 1
        }-${objDate.getFullYear()}`,
        time: `${objDate.getHours()}-${objDate.getMinutes()}-${objDate.getSeconds()}`,
        timeZone: objDate.getTimezoneOffset(),
      });
      console.log(`New message sent: ${data.message}`);
    } catch (err) {
      console.log(`Error(message): ${err.message}`);
    }
  });

  socket.on("online", (socketId, callback) => {
    try {
      console.log(`Attempt to get online list`);
      if (typeof socketId === "undefined" || socketId === null) {
        console.log("invalid socket, socket id is null");
        callback(chat.getOnlineUsers());
      } else {
        callback(chat.getOnlineUsers(socket));
      }
    } catch (err) {
      console.log(`Error(online): ${err.message}`);
    }
  });

  socket.on("sendFile", (data) => {
    try {
      let objDate = new Date();
      chat.getSocket(data.reciever).emit("sendFile", {
        file: data.file,
        name: data.name,
        date: `${objDate.getDate()}-${
          objDate.getMonth() + 1
        }-${objDate.getFullYear()}`,
        time: `${objDate.getHours()}-${objDate.getMinutes()}-${objDate.getSeconds()}`,
        timeZone: objDate.getTimezoneOffset(),
      });
      console.log(`New file sent: ${data.message}`);
    } catch (err) {
      console.log(`Error(sendFile): ${err.message}`);
    }
  });

  socket.on("sendMessageToAllUsers", (data) => {
    try {
      let objDate = new Date();
      chat.getOnlineUsers().forEach((user) => {
        chat.getSocket(user.socketId).emit("message", {
          message: data.message,
          name: data.name,
          date: `${objDate.getDate()}-${
            objDate.getMonth() + 1
          }-${objDate.getFullYear()}`,
          time: `${objDate.getHours()}-${objDate.getMinutes()}-${objDate.getSeconds()}`,
          timeZone: objDate.getTimezoneOffset(),
        });
      });
    } catch (err) {
      console.log(`Error(sendMessageToAllUsers): ${err.message}`);
    }
  });

  socket.on("disconnect", (reason) => {
    try {
      chat.remove(socket);
      let connections = chat.getOnlineUsers();
      connections.forEach((user) => {
        chat.getSocket(user.socketId).emit("newDisconnection", {
          name: socket.handshake.query.name,
          id: socket.id,
        });
      });
      console.log(`Connection removed: ${socket.id}`);
    } catch (err) {
      console.log(`Error(disconnect): ${err.message}`);
    }
  });
});

/**
 * Server listener.
 */
server.listen(port, () => {
  console.log(`...\n...\n\tServer running at port ${port}\n...\n...`);
});
