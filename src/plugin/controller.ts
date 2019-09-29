figma.showUI(__html__, { width: 720, height: 440 });

let selectedNodeId = "";

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

  function updateNodes(selection) {
    // Loop through the current selection in Figma.
    let allNodes = traverse(selection);
    let serializedNodes = JSON.stringify(allNodes, [
      "name",
      "type",
      "children",
      "id"
    ]);

    return serializedNodes;
  }

  // If no layer is selected
  if (msg.type === "update-selection") {
    console.log("message received");
    if (figma.currentPage.selection.length === 0) {
      return;
    } else {
      if (figma.currentPage.selection[0].id !== selectedNodeId) {
        let selection = figma.currentPage.selection;
        // Update the most recent selected node so we stop updating the UI.
        selectedNodeId = selection[0].id;
        // Pass the array back to the UI to be displayed.
        figma.ui.postMessage({
          type: "complete",
          message: updateNodes(selection)
        });
      }
    }
  }

  // Initalize the app
  if (msg.type === "run-app") {
    if (figma.currentPage.selection.length === 0) {
      return;
    } else {
      let selection = figma.currentPage.selection;

      // Set the intial node ID to compare to later.
      selectedNodeId = selection[0].id;

      // Pass the array back to the UI to be displayed.
      figma.ui.postMessage({
        type: "complete",
        message: updateNodes(selection)
      });
    }
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
