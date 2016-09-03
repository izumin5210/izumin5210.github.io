import "babel-polyfill";
import { createElement } from "react";
import ReactDOM from "react-dom";

import App from "./containers/App";

ReactDOM.render(
  createElement(App),
  document.getElementById("container")
);
