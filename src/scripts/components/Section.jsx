import React, { PropTypes } from "react";

export default function Section(props) {
  return (
    <section className={props.name} style={props.style}>
      {(() => {
        if ("title" in props) {
          return <h2 className={`${props.name}__title`}>{ props.title }</h2>;
        }
        return undefined;
      })()}
      { props.children }
    </section>
  );
}

Section.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object,
};

