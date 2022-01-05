import { io } from "socket.io-client";
import * as readline from "readline-sync";

// const client = io("https://see-fleet.herokuapp.com/", {
//   query: {
//     id: "999",
//     type: "driver",
//   },
// });

let name = readline.question("name: ")

const client = io("http://localhost:3333", {
  query: {
    name: name,
  },
});

client.connect();

client.on("newConnection", (data) => {
  console.log(data)
})

client.on("newDisconnection", (data) => {
  console.log(data)
})

// client.emit("online", (data) => {
//   for (let i in data) {
//     console.log(data[i]);
//   }
// });

// client.emit("sendMessageToAllUsers", {
//   name: name,
//   message: "Lucas não sabe programar de novo"
// });

// client.emit("message", {
//   name: name,
//   message: "Lucas não sabe programar",
//   emitter: "1TuSubaeUG8blSQWAAAB"
// });

// client.on("message", (data) => {
//   for (let i in data) {
//     console.log(data[i]);
//   }
// });


// client.emit("history", { authId: 999 });

// client.on("history", (data) => {
//   for (let i in data) {
//     console.log(data[i]);
//   }
// });

// client.on("disconnected", (data) => {
//   for (let i in data) {
//     console.log(data[i]);
//   }
// });

//let r = readline.question("Digite para enviar: ");
//
//client.emit("messageToSupervisor", {
//  message: r,
//  timestamp: new Date().getTime(),
//});
