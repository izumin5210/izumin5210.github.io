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
  static pageCount = 4;

  constructor(props) {
    super(props);
    this.state = {
      scrollTop: 0,
      windowHeight: window.innerHeight * 2,
      currentPage: 0,
      currentPosition: 0,
    };
  }

  componentWillMount() {
    this.setState(store);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll.bind(this));
  }

  handleScroll(event) {
    const scrollTop = event.srcElement.body.scrollTop;
    const windowHeight = window.innerHeight * 2;
    const currentPage = Math.floor(scrollTop / windowHeight);
    const currentPosition = (scrollTop % windowHeight) / windowHeight;
    this.setState({ scrollTop, windowHeight, currentPage, currentPosition });
  }

  calcHeight() {
    return this.state.windowHeight * App.pageCount;
  }

  calcPageTop(idx) {
    const { scrollTop, windowHeight, currentPage } = this.state;
    if (idx === currentPage || idx === currentPage + 1) {
      return 0;
    }
    return ((idx - currentPage) * windowHeight) - scrollTop;
  }

  calcPageOpacity(idx) {
    const { currentPage, currentPosition } = this.state;
    if (idx === currentPage) {
      if (currentPosition < 0.5) {
        return 1;
      } else if (currentPosition >= 0.5 && currentPosition < 0.7) {
        return 1 - ((currentPosition - 0.5) / (0.7 - 0.5));
      }
    } else if (idx === currentPage + 1) {
      if (currentPosition >= 0.8) {
        return (currentPosition - 0.8) / (1.0 - 0.8);
      }
    }
    return 0;
  }

  makePageStyle(idx) {
    return {
      top: this.calcPageTop(idx),
      opacity: this.calcPageOpacity(idx),
    };
  }

  render() {
    let page = 0;
    return (
      <div
        className="container-app"
        style={{ height: this.calcHeight() }}
      >
        <Header
          name="izumin5210"
          icon="/images/izumin.png"
          description={[
            "Software Engineer",
            "Research at Rekimoto Lab., The University of Tokyo",
          ]}
          style={this.makePageStyle(page++)}
        >
          <ContributionGraph
            rows={7}
            cols={31}
            contributions={this.state.contributions}
          />
        </Header>
        <Section name="PrimarySkills" title="Skills" style={this.makePageStyle(page++)}>
          <PrimarySkillsChart
            skills={this.state.primarySkills}
          />
        </Section>
        <Section name="SecondlySkills" style={this.makePageStyle(page++)}>
          <SecondlySkillsChart
            skills={this.state.secondlySkills}
          />
        </Section>
        <Section name="Talks" title="Talks" style={this.makePageStyle(page++)}>
          <TalkList
            talks={this.state.talks}
          />
        </Section>
      </div>
    );
  }
}
