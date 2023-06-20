import React, { FC, useState } from "react";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { SortableTreeWithoutDndContext as SortableTree } from "../../../src";
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

// -------------------------
// Create an drag source component that can be dragged into the tree
// https://react-dnd.github.io/react-dnd/docs-drag-source.html
// -------------------------
// This type must be assigned to the tree via the `dndType` prop as well
const externalNodeType = "yourNodeType";

const YourExternalNodeComponent: FC<{ node: { title: string } }> = (props) => {
  const { node } = props;

  const [_, drag] = useDrag({
    type: externalNodeType,
    item: { node: { node } },
    options: {
      dropEffect: "copy",
    },
  }, []);

  return (
    <div ref={drag}
      style={{
        display: "inline-block",
        padding: "3px 5px",
        background: "blue",
        color: "white",
      }}
    >
      {node.title}
    </div>
  );
};

const ExternalNode: React.FC = () => {
  const [treeData, setTreeData] = useState([{ title: "Mama Rabbit" }, { title: "Papa Rabbit" }]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div style={{ height: 300, width: 700 }}>
          <SortableTree
            treeData={treeData}
            onChange={setTreeData}
            dndType={externalNodeType}
          />
        </div>
        <YourExternalNodeComponent node={{ title: "Baby Rabbit" }} />← drag
        this
      </div>
    </DndProvider>
  );
};

export default ExternalNode;
