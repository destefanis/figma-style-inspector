import * as React from "react";
import { useState } from "react";
import "../styles/ui.css";

declare function require(path: string): any;

const App = ({}) => {
  const [nodeArray, setNodeAarray] = useState([]);

  const onRunLoop = React.useCallback(() => {
    parent.postMessage({ pluginMessage: { type: "run-app" } }, "*");
  }, []);

  // Hook for lifecycle
  React.useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = event => {
      const { type, message } = event.data.pluginMessage;

      // Plugin code returns this message after finished a loop.
      if (type === "complete") {
        setNodeAarray(message);
      }
    };
  }, []);

  function ListItem(props) {
    const node = props.node;

    let childNodes = null;
    // let childArray = new Array;

    // The component calls itself if there are children
    if (node.children) {
      node.children.forEach(child => {
        // Pass the plugin the ID of the layer we want to fetch.
        parent.postMessage(
          { pluginMessage: { type: "fetch-layer-data", id: child.id } },
          "*"
        );

        // Communicate with the plugin UI.
        React.useEffect(() => {
          window.onmessage = event => {
            const { type, layerData } = event.data.pluginMessage;

            if (type === "fetched layer") {
              console.log(layerData);
            }
          };
        }, []);
      });

      // childNodes = childArray.map(function(childNode) {
      //   console.log(childNode);
      //   return (
      //     <ListItem key={childNode.id} node={childNode} />
      //   );
      // });
    }

    return (
      <li className="list-item">
        <span className="list-arrow"></span>
        <span className="list-icon">
          <img src={require("../assets/" + node.type.toLowerCase() + ".svg")} />
        </span>
        <span className="list-name">{node.name.substring(0, 46)}</span>
        {childNodes ? <ul>{childNodes}</ul> : null}
      </li>
    );
  }

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
