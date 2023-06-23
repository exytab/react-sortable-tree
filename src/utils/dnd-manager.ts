import { getDepth } from "./tree-data-utils";

export const getTargetDepth = (
  dropTargetProps,
  monitor,
  // component,
  canNodeHaveChildren,
  treeId,
  maxDepth
) => {
  let dropTargetDepth = 0;

  const rowAbove = dropTargetProps.getPrevRow();
  if (rowAbove) {
    const { node } = rowAbove;
    let { path } = rowAbove;
    const aboveNodeCannotHaveChildren = !canNodeHaveChildren(node);
    if (aboveNodeCannotHaveChildren) {
      path = path.slice(0, -1);
    }

    // Limit the length of the path to the deepest possible
    dropTargetDepth = Math.min(path.length, dropTargetProps.path.length);
  }

  let blocksOffset;
  let dragSourceInitialDepth = (monitor.getItem().path || []).length;

  // When adding node from external source
  if (monitor.getItem().treeId === treeId) {
    // handle row direction support
    const direction = dropTargetProps.rowDirection === "rtl" ? -1 : 1;

    blocksOffset = Math.round(
      (direction * monitor.getDifferenceFromInitialOffset().x) /
        dropTargetProps.scaffoldBlockPxWidth
    );
  } else {
    // Ignore the tree depth of the source, if it had any to begin with
    dragSourceInitialDepth = 0;

    // if (component) {
    if (true) {
      // const relativePosition = component.node.getBoundingClientRect();
      // const leftShift =
      //   monitor.getSourceClientOffset().x - relativePosition.left;
      const relativePosition = monitor.getInitialSourceClientOffset();
      const leftShift =
        monitor.getSourceClientOffset().x - relativePosition.x;
      blocksOffset = Math.round(
        leftShift / dropTargetProps.scaffoldBlockPxWidth
      );
    } else {
      blocksOffset = dropTargetProps.path.length;
    }
  }

  let targetDepth = Math.min(
    dropTargetDepth,
    Math.max(0, dragSourceInitialDepth + blocksOffset - 1)
  );

  // If a maxDepth is defined, constrain the target depth
  if (maxDepth !== undefined && maxDepth !== undefined) {
    const draggedNode = monitor.getItem().node;
    const draggedChildDepth = getDepth(draggedNode);

    targetDepth = Math.max(
      0,
      Math.min(targetDepth, maxDepth - draggedChildDepth - 1)
    );
  }

  return targetDepth;
};

export const canDrop = (
  dropTargetProps,
  monitor,
  canNodeHaveChildren,
  treeId,
  maxDepth,
  treeRefcanDrop,
  draggingTreeData,
  treeReftreeData,
  getNodeKey
) => {
  if (!monitor.isOver()) {
    return false;
  }

  const rowAbove = dropTargetProps.getPrevRow();
  const abovePath = rowAbove ? rowAbove.path : [];
  const aboveNode = rowAbove ? rowAbove.node : {};
  const targetDepth = getTargetDepth(
    dropTargetProps,
    monitor,
    // undefined,
    canNodeHaveChildren,
    treeId,
    maxDepth
  );

  // Cannot drop if we're adding to the children of the row above and
  //  the row above is a function
  if (
    targetDepth >= abovePath.length &&
    typeof aboveNode.children === "function"
  ) {
    return false;
  }

  if (typeof treeRefcanDrop === "function") {
    const { node } = monitor.getItem();

    return treeRefcanDrop({
      node,
      prevPath: monitor.getItem().path,
      prevParent: monitor.getItem().parentNode,
      prevTreeIndex: monitor.getItem().treeIndex, // Equals -1 when dragged from external tree
      nextPath: dropTargetProps.children.props.path,
      nextParent: dropTargetProps.children.props.parentNode,
      nextTreeIndex: dropTargetProps.children.props.treeIndex,
    });
  }

  return true;
};
