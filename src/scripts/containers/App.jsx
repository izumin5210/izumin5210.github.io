import React, { Component } from "react";

import { subscriber }   from "react-dispatcher-decorator";
import PromisedReducer  from "promised-reducer";

import { Seq, Map } from "immutable";
import axios from "axios";

import {
  Contribution,
  PrimarySkill,
  SecondlySkill,
  store,
} from "../entities";

import {
  Header,
  Section,
  ContributionGraph,
  PrimarySkillsChart,
  SecondlySkillsChart,
} from "../components";

import initialPrimarySkills   from "../data/primary_skills";
import initialSecondlySkills  from "../data/secondly_skills";

const contributionsUrl = "https://s3-ap-northeast-1.amazonaws.com/kusa-store/20160825T075859508.json";

@subscriber((self, subscribe) => {
  const reducer = new PromisedReducer(self.state);
  reducer.on(":update", state => self.setState(state.toObject()));
  subscribe("Contributions:fetch", () => {
    reducer.update(state => axios.get(contributionsUrl)
        .then(res => Map(state).set(
            "contributions",
            Seq(res.data).map(c => new Contribution(c)).toList()
        ))
    );
  });
  subscribe("PrimarySkills:fetch", () => {
    reducer.update(state => Map(state).set(
      "primarySkills",
      Seq(initialPrimarySkills).map(s => new PrimarySkill(s)).toList()
    ));
  });
  subscribe("SecondlySkills:fetch", () => {
    reducer.update(state => Map(state).set(
      "secondlySkills",
      Seq(initialSecondlySkills).map(s => new SecondlySkill(s)).toList()
    ));
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
        <Section name="PrimarySkills" title="Skills">
          <PrimarySkillsChart
            skills={this.state.primarySkills}
          />
        </Section>
        <Section name="SecondlySkills">
          <SecondlySkillsChart
            skills={this.state.secondlySkills}
          />
        </Section>
      </div>
    );
  }
}
