import * as React from "react";
import "../styles/panel.css";

declare function require(path: string): any;

function PropertiesList(props) {
  let obj = props.properties;

  const listItems = Object.keys(obj).map(key => (
    <li className="panel-list-item" value={obj.id}>
      <span className="list-item-key">{key}:</span>
      <span className="list-item-value">{JSON.stringify(obj[key])}</span>
    </li>
  ));

  return <ul className="panel-list">{listItems}</ul>;
}

function Panel(props) {
  return (
    <aside className="panel">
      {props.node.name ? null : (
        <h1 className="panel-title">Select a layer to get started :)</h1>
      )}
      <PropertiesList properties={props.node} />
    </aside>
  );
}

export default Panel;
