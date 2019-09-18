import * as React from "react";
import { useState } from "react";
import "../styles/ui.css";

declare function require(path: string): any;

function ListItem(props) {
  const node = props.node;
  let childNodes = null;

  // The component calls itself if there are children
  if (node.children) {
    let reversedArray = node.children.reverse();
    childNodes = reversedArray.map(function(childNode) {
      console.log(childNode);
      return <ListItem key={childNode.id} node={childNode} />;
    });
  }

  return (
    <li id={node.id} className={`list-item`}>
      <div className="list-flex-row">
        <span className="list-arrow"></span>
        <span className="list-icon">
          <img src={require("../assets/" + node.type.toLowerCase() + ".svg")} />
        </span>
        <span className="list-name">{node.name.substring(0, 46)}</span>
      </div>
      {childNodes ? <ul className="sub-list">{childNodes}</ul> : null}
    </li>
  );
}

const App = ({}) => {
  const [nodeArray, setNodeAarray] = useState([]);

  const onRunLoop = React.useCallback(() => {
    parent.postMessage({ pluginMessage: { type: "run-app" } }, "*");
  }, []);

  React.useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = event => {
      const { type, message } = event.data.pluginMessage;

      // Plugin code returns this message after finished a loop.
      if (type === "complete") {
        // The data received is serialized so we need to parse it before use.
        setNodeAarray(JSON.parse(message));
      }
    };
  }, []);

  function NodeList(props) {
    if (nodeArray.length) {
      let nodes = nodeArray;

      const listItems = nodes.map(node => (
        <ListItem key={node.id} node={node} />
      ));

      return <ul className="list">{listItems}</ul>;
    } else {
      return null;
    }
  }

  return (
    <div>
      <NodeList />
      <button id="create" onClick={onRunLoop}>
        Fetch Styles
      </button>
    </div>
  );
};

export default App;
