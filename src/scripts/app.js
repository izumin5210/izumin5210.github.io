import React    from "react";
import ReactDOM from "react-dom";

class HelloWorld extends React.Component {
  render() {
    return (
      <h1>Hello {this.props.name} !</h1>
    );
  }
}

ReactDOM.render(
  <HelloWorld name="izumin5210" />,
  document.getElementById("container")
);
