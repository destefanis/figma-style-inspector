import * as React from "react";
import { useState } from "react";
import "../styles/panel.css";
import classNames from "classnames";

declare function require(path: string): any;

function Panel(props) {
  return (
    <aside className="panel">
      {props.node ? (
        <h1 className="node-title">Name: {props.node.name}</h1>
      ) : (
        <h1 className="node-title">Placeholder</h1>
      )}
      <ul>
        <li>
          <div>
            <span>Node Type</span>
            <span>Rectangle</span>
          </div>
        </li>
      </ul>
    </aside>
  );
}

export default Panel;
