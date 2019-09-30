import * as React from "react";
import { useState, useEffect } from "react";
import "../styles/styles.css";

const copy = require("clipboard-copy");

function StyleListItem(props) {
  const [buttonText, setButtonText] = useState("Copy");
  let style = props.style;

  function updateCopy() {
    setButtonText("Copied!");

    setTimeout(() => {
      setButtonText("Copy");
    }, 750);
  }

  return (
    <li className="style-item style-item--text">
      {style.type === "TEXT" ? (
        <div className="style-item-row">
          <span className="style-text-image">Ag</span>
          <span className="style-name">{style.name}</span>
        </div>
      ) : (
        <div className="style-item-row">
          <span className="style-fill-image"></span>
          <span className="style-name">{style.name}</span>
          <button
            onClick={() => {
              copy(JSON.stringify(style.name));
              updateCopy();
            }}
            className="copy-button copy-button--style-title"
          >
            {buttonText}
          </button>
        </div>
      )}
      {style.description ? (
        <div className="style-properties">
          <span className="list-item-key">Description</span>
          <span className="list-item-value">{style.description}</span>
        </div>
      ) : null}
      <div className="style-properties">
        <span className="list-item-key style-key">Style Key</span>
        <span className="list-item-value">{style.key}</span>
        <button
          onClick={() => {
            copy(JSON.stringify(style.key));
            updateCopy();
          }}
          className="copy-button copy-button--style"
        >
          {buttonText}
        </button>
      </div>
      <div className="properties-wrapper">
        <div className="style-properties">
          <span className="list-item-key">Type</span>
          <span className="list-item-value style-type">
            {style.type.toLowerCase()}
          </span>
        </div>
        <div className="style-properties">
          <span className="list-item-key">Remote</span>
          <span className="list-item-value style-type">
            {style.remote.toString()}
          </span>
        </div>
      </div>
    </li>
  );
}

function StylesList(props) {
  let styles = props.styles;

  const listItems = styles.map(style => {
    return <StyleListItem key={style.key} style={style} />;
  });

  return (
    <div>
      <ul className="panel-list style-list">{listItems}</ul>
    </div>
  );
}

export default StylesList;
