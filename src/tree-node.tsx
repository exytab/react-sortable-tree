import React, { Children, FC, PropsWithChildren, cloneElement } from "react";
import { useDrop } from "react-dnd";

import { classnames } from "./utils/classnames";
import { canDrop as _canDrop, getTargetDepth } from "./utils/dnd-manager";

import "./tree-node.css";
import { TreeItem, TreePath } from ".";

let rafId = 0;

export interface TreeNode {
  node: TreeItem;
}

export interface FlatDataItem extends TreeNode, TreePath {
  lowerSiblingCounts: number[];
  parentNode: TreeItem;
}

export interface TreeRendererProps {
  treeIndex: number;
  treeId: string;
  swapFrom?: number | undefined;
  swapDepth?: number | undefined;
  swapLength?: number | undefined;
  scaffoldBlockPxWidth: number;
  lowerSiblingCounts: number[];
  rowDirection?: "ltr" | "rtl" | string | undefined;
  rowHeight: number | ((treeIndex: number, node: any, path: any[]) => number);

  listIndex: number;
  style?: React.CSSProperties | undefined;

  dndType: string;
  canNodeHaveChildren: (node) => boolean;
  maxDepth?: number | undefined;
  canDrop?: (params) => boolean;
  drop: (dropResult) => void;
  dragHover: (dragProps) => void;
  draggingTreeData: any[];
  treeData: any[];
  getNodeKey?: (node) => string;
  // Drop target
  // isOver: boolean;
  // canDrop?: boolean | undefined;
  // draggedNode?: TreeItem | undefined;

  // used in dndManager
  getPrevRow: () => FlatDataItem | undefined;
  node: TreeItem;
  path: number[];
}

const defaultProps = {
  swapFrom: undefined,
  swapDepth: undefined,
  swapLength: undefined,
  // canDrop: false,
  // draggedNode: undefined,
  rowDirection: "ltr",
};

const TreeNodeComponent: FC<PropsWithChildren<TreeRendererProps>> = (_props) => {
  const props = { ...defaultProps, ..._props };
  const {
    children,
    listIndex,
    swapFrom,
    swapLength,
    swapDepth,
    scaffoldBlockPxWidth,
    lowerSiblingCounts,
    dndType,
    canNodeHaveChildren,
    maxDepth,
    canDrop: treeRefcanDrop,
    drop,
    dragHover,
    draggingTreeData,
    treeData: treeReftreeData,
    getNodeKey,
    // isOver,
    // draggedNode,
    // canDrop,
    treeIndex,
    rowHeight,
    treeId: _treeId, // Delete from otherProps
    getPrevRow: _getPrevRow, // Delete from otherProps
    node: _node, // Delete from otherProps
    path: _path, // Delete from otherProps
    rowDirection,
    ...otherProps
  } = props;

  const [{ isOver, draggedNode, canDrop }, dropRef] = useDrop(() => ({
    accept: dndType,
    drop: (item, monitor) => {
      const dropTargetProps = props; // review?
      const result = {
        node: monitor.getItem().node,
        path: monitor.getItem().path,
        treeIndex: monitor.getItem().treeIndex,
        treeId: _treeId,
        minimumTreeIndex: dropTargetProps.treeIndex,
        depth: getTargetDepth(
          dropTargetProps,
          monitor,
          // component,
          canNodeHaveChildren,
          _treeId,
          maxDepth
        ),
      };

      drop(result);

      return result;
    },
    hover: (item, monitor) => {
      const dropTargetProps = props; // review?
      const targetDepth = getTargetDepth(
        dropTargetProps,
        monitor,
        // component,
        canNodeHaveChildren,
        _treeId,
        maxDepth
      );
      const draggedNode = monitor.getItem().node;
      const needsRedraw =
        // Redraw if hovered above different nodes
        dropTargetProps.node !== draggedNode ||
        // Or hovered above the same node but at a different depth
        targetDepth !== dropTargetProps.path.length - 1;

      if (!needsRedraw) {
        return;
      }

      // throttle `dragHover` work to available animation frames
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const item = monitor.getItem();
        // skip if drag already ended before the animation frame
        if (!item || !monitor.isOver()) {
          return;
        }
        dragHover({
          node: draggedNode,
          path: item.path,
          minimumTreeIndex: dropTargetProps.listIndex,
          depth: targetDepth,
        });
      });
    },
    canDrop: (item, monitor) => {
      const dropTargetProps = props; // review?
      const $ = _canDrop(
        dropTargetProps,
        monitor,
        canNodeHaveChildren,
        _treeId,
        maxDepth,
        treeRefcanDrop,
        draggingTreeData,
        treeReftreeData,
        getNodeKey
      );
      // console.log("canDrop", $);
      return $;
    },
    collect: (monitor) => {
      const dragged = monitor.getItem();
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        draggedNode: dragged ? dragged.node : undefined,
      };
    },
  })
  );

  const rowDirectionClass = rowDirection === "rtl" ? "rst__rtl" : undefined;

  // Construct the scaffold representing the structure of the tree
  const scaffoldBlockCount = lowerSiblingCounts.length;
  const scaffold: any[] = [];
  for (const [i, lowerSiblingCount] of lowerSiblingCounts.entries()) {
    let lineClass = "";
    if (lowerSiblingCount > 0) {
      // At this level in the tree, the nodes had sibling nodes further down

      if (listIndex === 0) {
        // Top-left corner of the tree
        // +-----+
        // |     |
        // |  +--+
        // |  |  |
        // +--+--+
        lineClass = "rst__lineHalfHorizontalRight rst__lineHalfVerticalBottom";
      } else if (i === scaffoldBlockCount - 1) {
        // Last scaffold block in the row, right before the row content
        // +--+--+
        // |  |  |
        // |  +--+
        // |  |  |
        // +--+--+
        lineClass = "rst__lineHalfHorizontalRight rst__lineFullVertical";
      } else {
        // Simply connecting the line extending down to the next sibling on this level
        // +--+--+
        // |  |  |
        // |  |  |
        // |  |  |
        // +--+--+
        lineClass = "rst__lineFullVertical";
      }
    } else if (listIndex === 0) {
      // Top-left corner of the tree, but has no siblings
      // +-----+
      // |     |
      // |  +--+
      // |     |
      // +-----+
      lineClass = "rst__lineHalfHorizontalRight";
    } else if (i === scaffoldBlockCount - 1) {
      // The last or only node in this level of the tree
      // +--+--+
      // |  |  |
      // |  +--+
      // |     |
      // +-----+
      lineClass = "rst__lineHalfVerticalTop rst__lineHalfHorizontalRight";
    }

    scaffold.push(
      <div
        key={`pre_${1 + i}`}
        style={{ width: scaffoldBlockPxWidth }}
        className={classnames(
          "rst__lineBlock",
          lineClass,
          rowDirectionClass ?? ""
        )}
      />
    );

    if (treeIndex !== listIndex && i === swapDepth) {
      // This row has been shifted, and is at the depth of
      // the line pointing to the new destination
      let highlightLineClass = "";

      if (listIndex === swapFrom! + swapLength! - 1) {
        // This block is on the bottom (target) line
        // This block points at the target block (where the row will go when released)
        highlightLineClass = "rst__highlightBottomLeftCorner";
      } else if (treeIndex === swapFrom) {
        // This block is on the top (source) line
        highlightLineClass = "rst__highlightTopLeftCorner";
      } else {
        // This block is between the bottom and top
        highlightLineClass = "rst__highlightLineVertical";
      }

      const style =
        rowDirection === "rtl"
          ? {
            width: scaffoldBlockPxWidth,
            right: scaffoldBlockPxWidth * i,
          }
          : {
            width: scaffoldBlockPxWidth,
            left: scaffoldBlockPxWidth * i,
          };

      scaffold.push(
        <div
          key={i}
          style={style}
          className={classnames(
            "rst__absoluteLineBlock",
            highlightLineClass,
            rowDirectionClass ?? ""
          )}
        />
      );
    }
  }

  const style =
    rowDirection === "rtl"
      ? { right: scaffoldBlockPxWidth * scaffoldBlockCount }
      : { left: scaffoldBlockPxWidth * scaffoldBlockCount };

  let calculatedRowHeight = rowHeight;
  if (typeof rowHeight === "function") {
    calculatedRowHeight = rowHeight(treeIndex, _node, _path);
  }
  return (
    <div
      {...otherProps}
      style={{ height: `${calculatedRowHeight}px` }}
      className={classnames("rst__node", rowDirectionClass ?? "")}
      ref={dropRef}
    >
      {scaffold}

      <div className="rst__nodeContent" style={style}>
        {Children.map(children, (child: any) =>
          cloneElement(child, {
            isOver,
            canDrop,
            draggedNode,
          })
        )}
      </div>
    </div>
  );
};

export default TreeNodeComponent;
