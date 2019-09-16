figma.showUI(__html__);

// Recursive function to assign the current node
// to a new object and check if it has children
function checkIfNested(node) {
  let copyNode = new Object();
  copyNode.name = node.name;
  copyNode.type = node.type;
  copyNode.id = node.id;

  if ("children" in node) {
    let children = node.children;
    copyNode.children = [];

    children.forEach(function(child) {
      checkIfNested(child);
      copyNode.children.push(child);
    });
  }

  return copyNode;
}

figma.ui.onmessage = msg => {
  // Fetch a specific node by ID.
  if (msg.type === "fetch-layer-data") {
    let layer = figma.getNodeById(msg.id);
    let returnData = checkIfNested(layer);

    figma.ui.postMessage({
      type: "fetched layer",
      layerData: returnData
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
    let allResults = [];

    // Loop through each node and a copy of that object to the array.
    allNodes.forEach(function(node) {
      let copyNode = new Object();
      copyNode = checkIfNested(node);
      allResults.push(copyNode);
    });

    // Pass the array back to the UI to be displayed.
    figma.ui.postMessage({
      type: "complete",
      message: allResults
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
