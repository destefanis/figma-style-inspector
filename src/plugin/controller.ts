figma.showUI(__html__, { width: 580, height: 440 });

figma.ui.onmessage = msg => {
  // Fetch a specific node by ID.
  if (msg.type === "fetch-layer-data") {
    let layer = figma.getNodeById(msg.id);

    let keys = Object.keys(layer.__proto__);

    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === "parent" || keys[i] === "removed") {
        keys.splice(i, 1);
        i--;
      }
    }

    let layerData = JSON.stringify(layer, keys);

    figma.ui.postMessage({
      type: "fetched layer",
      message: layerData
    });
  }

  // Initalize the app
  if (msg.type === "run-app") {
    // Traverses the node tree
    function traverse(node) {
      if ("children" in node) {
        if (node.type !== "INSTANCE") {
          for (const child of node.children) {
            traverse(child);
          }
        }
      }
      return node;
    }

    // Loop through the current selection in Figma.
    let allNodes = traverse(figma.currentPage.selection);
    let serializedNodes = JSON.stringify(allNodes, [
      "name",
      "type",
      "children",
      "id"
    ]);

    // Pass the array back to the UI to be displayed.
    figma.ui.postMessage({
      type: "complete",
      message: serializedNodes
    });
  }

  // To be used for fetching style dev info.
  function checkForStyle(node) {
    if (node.fillStyleId) {
      let style = figma.getStyleById(node.fillStyleId);
      return style;
    } else {
      return;
    }
  }
};
