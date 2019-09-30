import * as React from "react";
import { useState, useEffect } from "react";
import "../styles/panel.css";
import PropertiesList from "./PropertiesList";
import StylesList from "./StylesList";
import Placeholder from "./Placeholder";

const copy = require("clipboard-copy");

function Panel(props) {
  const [buttonText, setButtonText] = useState("Copy");

  function updateCopy() {
    setButtonText("Copied!");

    setTimeout(() => {
      setButtonText("Copy");
    }, 750);
  }

  return (
    <aside className="panel">
      {props.node.name ? (
        <div className="title-wrapper">
          <h3 className="panel-title">{props.node.name}</h3>
          <button
            onClick={() => {
              copy(JSON.stringify(props.node));
              updateCopy();
            }}
            className="copy-button"
          >
            {buttonText}
          </button>
        </div>
      ) : (
        <Placeholder />
      )}
      {props.styles ? (
        <React.Fragment>
          <StylesList styles={props.styles} />
        </React.Fragment>
      ) : null}
      <PropertiesList properties={props.node} name={props.node.name} />
    </aside>
  );
}

export default Panel;
