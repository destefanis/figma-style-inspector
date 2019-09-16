figma.showUI(__html__);

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
  if (msg.type === "fetch-layer-data") {
    let layer = figma.getNodeById(msg.id);
    let returnData = checkIfNested(layer);

    figma.ui.postMessage({
      type: "fetched layer",
      layerData: returnData
    });
  }

  if (msg.type === "run-app") {
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

    let allNodes = traverse(figma.currentPage.selection);
    let allResults = [];

    allNodes.forEach(function(node) {
      let copyNode = new Object();
      copyNode = checkIfNested(node);
      allResults.push(copyNode);
    });

    figma.ui.postMessage({
      type: "complete",
      message: allResults
    });
  }

  function checkForStyle(node) {
    if (node.fillStyleId) {
      let style = figma.getStyleById(node.fillStyleId);
      return style;
    } else {
      return;
    }
  }
};
