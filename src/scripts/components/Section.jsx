import React, { PropTypes } from "react";

export default function Section(props) {
  return (
    <section className={props.name}>
      <h2 className={`${props.name}__title`}>{ props.title }</h2>
      { props.children }
    </section>
  );
}

Section.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

