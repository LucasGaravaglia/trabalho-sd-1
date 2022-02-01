import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./App";
import { Toaster } from "react-hot-toast";
import { ChakraProvider } from "@chakra-ui/react";

ReactDOM.render(
  <React.StrictMode>
    <div>
      <Toaster />
    </div>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
