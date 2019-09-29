import * as React from "react";
import { useState, useEffect } from "react";
import "../styles/panel.css";

declare function require(path: string): any;
const copy = require("clipboard-copy");

function StylesList(props) {
  const [buttonText, setButtonText] = useState("Copy");
  let obj = props.properties;

  function updateCopy() {
    setButtonText("Copied!");

    setTimeout(() => {
      setButtonText("Copy");
    }, 750);
  }

  const listItems = Object.keys(obj).map(key => (
    <li className={`panel-list-item list-item--${key}`}>
      <span className={`list-item-key key--${key}`}>{key}</span>
      <span className={`list-item-value`}>{JSON.stringify(obj[key])}</span>
      <button
        onClick={() => {
          copy(JSON.stringify(obj[key]));
          updateCopy();
        }}
        className="copy-button"
      >
        {buttonText}
      </button>
    </li>
  ));

  return (
    <div>
      <ul className="panel-list">{listItems}</ul>
    </div>
  );
}

function PropertiesList(props) {
  const [buttonText, setButtonText] = useState("Copy");
  let obj = props.properties;

  function determineType(obj, key) {
    let val = typeof obj[key];
    return val;
  }

  function updateCopy() {
    setButtonText("Copied!");

    setTimeout(() => {
      setButtonText("Copy");
    }, 750);
  }

  function parseKey(obj, key) {
    let newKey = obj;

    if (typeof newKey === "object") {
      if (key === "children") {
        newKey = newKey.length;
      } else if (newKey.name) {
        newKey = newKey.name;
      }
    } else if (typeof newKey === "array") {
      newKey = newKey.length;
    }

    return JSON.stringify(newKey);
  }

  const listItems = Object.keys(obj).map(key => (
    <li className={`panel-list-item list-item--${key}`} value={obj.id}>
      <span className={`list-item-key key--${key}`}>{key}</span>
      <span
        className={`list-item-value item-value--${determineType(obj, key)}`}
      >
        {parseKey(obj[key], key)}
      </span>
      <button
        onClick={() => {
          copy(parseKey(obj[key], key));
          updateCopy();
        }}
        className="copy-button"
      >
        {buttonText}
      </button>
    </li>
  ));

  return (
    <div>
      <ul className="panel-list">{listItems}</ul>
    </div>
  );
}

function Panel(props) {
  return (
    <aside className="panel">
      {props.node.name ? (
        <h3 className="panel-title">{props.node.name}</h3>
      ) : (
        <h3 className="panel-title">Select a layer to get started :)</h3>
      )}
      {props.styles ? null : (
        <React.Fragment>
          <h4 className="section-title">Styles</h4>
          <StylesList properties={props.styles} />
        </React.Fragment>
      )}
      {/* <h4 className="section-title">Properties</h4> */}
      <PropertiesList properties={props.node} name={props.node.name} />
    </aside>
  );
}

export default Panel;
