figma.showUI(__html__, { width: 380, height: 600 });

figma.ui.onmessage = msg => {
  // Fetch a specific node by ID.
  if (msg.type === "fetch-layer-data") {
    let layer = figma.getNodeById(msg.id);

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
