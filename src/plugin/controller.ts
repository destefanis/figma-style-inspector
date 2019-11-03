figma.showUI(__html__, { width: 720, height: 440 });

let selectedNodeId = "";

figma.ui.onmessage = msg => {
  // Fetch a specific node by ID.
  if (msg.type === "fetch-layer-data") {
    let layer = figma.getNodeById(msg.id);
    let styles = checkForStyles(layer);
    let promisesArray = [];

    // We have to fetch each style Async, so we create an array of promises
    if (styles.length >= 1) {
      styles.forEach(function(style) {
        promisesArray.push(figma.importStyleByKeyAsync(style.key));
      });
    }

    // Once the promises resolve, send that data to the UI.
    Promise.all(promisesArray).then(values => {
      let stylesData = JSON.stringify(values, [
        "name",
        "description",
        "key",
        "type",
        "remote",
        "paints",
        "font"
      ]);

      figma.ui.postMessage({
        type: "fetched styles",
        message: stylesData
      });
    });

    let keys = Object.keys(layer.__proto__);
    keys.unshift("id");

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

  // When the UI isn't focused and the app is polling for changes
  // it runs against this snippet to see if a new layer has been selected.
  if (msg.type === "update-selection") {
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

  // We don't know what styles a node will have so check for all of them.
  function checkForStyles(node) {
    let nodeStyles = [];

    if (node.fillStyleId) {
      nodeStyles.push(figma.getStyleById(node.fillStyleId));
    }
    if (node.backgroundStyleId) {
      nodeStyles.push(figma.getStyleById(node.backgroundStyleId));
    }
    if (node.textStyleId) {
      nodeStyles.push(figma.getStyleById(node.textStyleId));
    }
    if (node.strokeStyleId) {
      nodeStyles.push(figma.getStyleById(node.strokeStyleId));
    }
    if (node.effectStyleId) {
      nodeStyles.push(figma.getStyleById(node.effectStyleId));
    }

    return nodeStyles;
  }
};
