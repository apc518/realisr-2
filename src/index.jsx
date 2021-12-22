import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";

const wasm = import("../build/realisr_2");

wasm.then(m => {
  ReactDOM.render(<App wasm={m}/>, document.getElementById("root"));
});