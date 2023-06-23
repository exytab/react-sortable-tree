import React, { Children, PropsWithChildren, cloneElement } from "react";
import { useDrop } from "react-dnd";

import { TreeItem } from ".";

const defaultProps = {
  canDrop: false,
  draggedNode: undefined,
};

type TreePlaceholderProps = {
  treeId: string;
  drop: any;
  dndType: string;

  // Drop target
  // isOver: boolean;
  // canDrop: boolean;
  // draggedNode: TreeItem;
}

const TreePlaceholder = (props: PropsWithChildren<TreePlaceholderProps>) => {
  props = { ...defaultProps, ...props };
  const { children, treeId, drop, dndType} = props;

  const [otherProps, dropRef] = useDrop(() => ({
    accept: dndType,
    drop: (item: TreeItem, monitor) => {
      const { node, path, treeIndex } = monitor.getItem();
      const result = {
        node,
        path,
        treeIndex,
        treeId,
        minimumTreeIndex: 0,
        depth: 0,
      };

      drop(result);

      return result;
    },
    collect: (monitor) => {
      const dragged = monitor.getItem();
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        draggedNode: dragged ? dragged.node : undefined,
      };
    },
  }), [treeId, drop, dndType]);

  return (
    <div ref={dropRef}>
      {Children.map(children, (child) =>
        cloneElement(child, {
          ...otherProps,
        })
      )}
    </div>
  );
};

export default TreePlaceholder;
