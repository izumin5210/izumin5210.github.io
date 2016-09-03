import React, { Component } from "react";

import { subscriber }   from "react-dispatcher-decorator";
import PromisedReducer  from "promised-reducer";

import { Seq, Map } from "immutable";
import axios from "axios";

import { Contribution, store } from "../entities";

import {
  ContributionGraph,
  Header,
} from "../components";

const contributionsUrl = "https://s3-ap-northeast-1.amazonaws.com/kusa-store/20160825T075859508.json";

@subscriber((self, subscribe) => {
  const reducer = new PromisedReducer(self.state);
  reducer.on(":update", state => self.setState(state.toObject()));
  subscribe("contributions:fetch", () => {
    reducer.update(state => axios.get(contributionsUrl)
        .then(res => Map(state).set(
            "contributions",
            Seq(res.data).map(c => new Contribution(c)).toList()
        ))
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
      <div className="container-app">
        <Header
          name="izumin5210"
          icon="/images/izumin.png"
          description={[
            "Software Engineer",
            "Research at Rekimoto Lab., The University of Tokyo",
          ]}
        >
          <ContributionGraph
            rows={7}
            cols={31}
            contributions={this.state.contributions}
          />
        </Header>
      </div>
    );
  }
}
