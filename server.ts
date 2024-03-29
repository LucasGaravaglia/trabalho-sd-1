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

  socket.on("register", (data, callback) => {
    try {
      if (typeof data.name === "undefined")
        throw new Error("invalid data.name");
      let connections = chat.getOnlineUsers();
      if (!!connections.find((c) => c.name == data.name)) {
        callback(true);
        throw new Error("already registered user.name");
      }
      chat.insert(data.name, socket);
      connections.forEach((user) => {
        chat.getSocket(user.socketId).emit("newConnection", {
          name: data.name,
          id: socket.id,
        });
      });
      callback(false);
    } catch (err) {
      console.log(`Error(register - New Connection): ${err.message}`);
    }
  });

  socket.on("message", (data) => {
    try {
      let objDate = new Date();
      chat.getSocket(data.receiverId).emit("message", {
        message: data.message,
        senderName: chat.getUserName(socket.id),
        senderSocketId: socket.id,
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

  socket.on("online", (callback) => {
    try {
      console.log(`Attempt to get online list`);
      callback(chat.getOnlineUsers(socket));
    } catch (err) {
      console.log(`Error(online): ${err.message}`);
    }
  });

  socket.on("sendFile", (data) => {
    try {
      let objDate = new Date();
      chat.getSocket(data.receiverId).emit("file", {
        file: data.file,
        fileName: data.fileName,
        fileType: data.fileType,
        senderName: chat.getUserName(socket.id),
        senderSocketId: socket.id,
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

  socket.on("sendFileToAllUsers", (data) => {
    try {
      let objDate = new Date();
      chat.getOnlineUsers(socket).forEach((user) => {
        chat.getSocket(user.socketId).emit("fileFromGeneral", {
          file: data.file,
          fileName: data.fileName,
          fileType: data.fileType,
          senderName: chat.getUserName(socket.id),
          senderSocketId: socket.id,
          date: `${objDate.getDate()}-${
            objDate.getMonth() + 1
          }-${objDate.getFullYear()}`,
          time: `${objDate.getHours()}-${objDate.getMinutes()}-${objDate.getSeconds()}`,
          timeZone: objDate.getTimezoneOffset(),
        });
      });
    } catch (err) {
      console.log(`Error(sendFileToAllUsers): ${err.message}`);
    }
  });

  socket.on("sendMessageToAllUsers", (data) => {
    try {
      let objDate = new Date();
      chat.getOnlineUsers(socket).forEach((user) => {
        chat.getSocket(user.socketId).emit("messageAllUsers", {
          message: data.message,
          senderName: chat.getUserName(socket.id),
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
