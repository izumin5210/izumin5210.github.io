import React, { Component } from "react";
import { subscriber }       from "react-dispatcher-decorator";

import { store }  from "../entities";
import reducers   from "../reducers";

import {
  Header,
  Section,
  ContributionGraph,
  PrimarySkillsChart,
  SecondlySkillsChart,
  TalkList,
} from "../components";


@subscriber(reducers)
export default class App extends Component {
  componentWillMount() {
    this.setState(store);
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
        <Section name="Talks" title="Talks">
          <TalkList
            talks={this.state.talks}
          />
        </Section>
      </div>
    );
  }
}
