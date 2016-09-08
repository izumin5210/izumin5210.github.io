import React, { Component, PropTypes }  from "react";
import { dispatcher }                   from "react-dispatcher-decorator";

import { Talks } from "../entities";

@dispatcher
export default class TalkList extends Component {
  static propTypes = {
    talks: PropTypes.instanceOf(Talks).isRequired,
  };

  componentWillMount() {
    this.context.dispatch("Talks:fetch");
  }

  render() {
    const items = this.props.talks.map((t, i) => ([
      <dt className="Talks__itemTitle" key={`talk-${i}-title`}>
        <a href={t.url} target="_blank" rel="noopener noreferrer">
          {t.title}
        </a>
      </dt>,
      <dd className="Talks__itemEvent" key={`talk-${i}-event`}>
        <a href={t.event.url} target="_blank" rel="noopener noreferrer">
          {t.event.name}
        </a>
      </dd>,
      <dd className="Talks__itemDate" key={`talk-${i}-date`}>
        <time dateTime={t.talkedOn.format("YYYY-MM-DD")}>
          {t.talkedOn.format("D MMM., YYYY")}
        </time>
      </dd>,
    ]));
    return (
      <div>
        <dl className="Talks__list">
          {items}
        </dl>
        <p className="Talks__moreTalks">
          ...and more talks
          (slides in <a href="//speakerdeck.com/izumin5210">SpeakerDeck</a>)
        </p>
      </div>
    );
  }
}
