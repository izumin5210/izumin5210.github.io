import "babel-polyfill";
import { createElement } from "react";
import ReactDOM from "react-dom";

import App from "./components/App";

ReactDOM.render(
  createElement(App),
  document.getElementById("container")
);
