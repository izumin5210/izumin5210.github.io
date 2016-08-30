import "babel-polyfill";
import React, {Component} from "react";
import ReactDOM from "react-dom";

import {subscriber}     from "react-dispatcher-decorator";
import PromisedReducer  from "promised-reducer";

import {Seq, Map} from "immutable";
import axios from "axios";

import {Contribution, Contributions, store} from "../entities";

import ContributionGraph from "./ContributionGraph.jsx";


@subscriber((self, subscribe) => {
  const reducer = new PromisedReducer(self.state);
  reducer.on(":update", state => self.setState(state.toObject())); 
  subscribe("contributions:fetch", prop => {
    reducer.update(state => axios.get("https://s3-ap-northeast-1.amazonaws.com/kusa-store/20160825T075859508.json")
        .then(res => Map(state).set("contributions", Seq(res.data).map(c => new Contribution(c)).toList()))
    );
  });
})
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = store;
  }

  render() {
    return (
      <ContributionGraph contributions={this.state.contributions} />
    );
  }
}
