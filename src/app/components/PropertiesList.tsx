import * as React from "react";
import { useState, useEffect } from "react";
import "../styles/panel.css";

const copy = require("clipboard-copy");

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

    if (typeof newKey === "object" && newKey !== null) {
      if (key === "children") {
        newKey = newKey.length;
      } else if (newKey.name) {
        newKey = newKey.name;
      }
    }

    return JSON.stringify(newKey);
  }

  const listItems = Object.keys(obj).map(objKey => (
    <li
      className={`panel-list-item list-item--${objKey}`}
      value={obj.id}
      key={objKey}
    >
      <span className={`list-item-key key--${objKey}`}>{objKey}</span>
      <span
        className={`list-item-value item-value--${determineType(obj, objKey)}`}
      >
        {parseKey(obj[objKey], objKey)}
      </span>
      <button
        onClick={() => {
          copy(parseKey(obj[objKey], objKey).replace(/['"]+/g, ""));
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

export default PropertiesList;
