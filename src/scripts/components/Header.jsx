import React, { PropTypes } from "react";

export default function Header(props) {
  const componentName = "Header";
  const description = props.description.map((d, i) => (
    <li key={`${componentName}__description__item${i}`}>{d}</li>
  ));
  return (
    <header className={componentName}>
      <div className={`${componentName}__profile`}>
        <figure className={`${componentName}__icon`}>
          <img src={props.icon} alt={props.name} />
        </figure>
        <div>
          <h1 className={`${componentName}__name`}>{props.name}</h1>
          <ul className={`${componentName}__description`}>
            { description }
          </ul>
        </div>
      </div>
      { props.children }
    </header>
  );
}

Header.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  description: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node,
};
