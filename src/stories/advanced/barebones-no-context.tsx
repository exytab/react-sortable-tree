import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { SortableTreeWithoutDndContext as SortableTree } from "../../../src";
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

const BarebonesNoContext: React.FC = () => {
  const [treeData, setTreeData] = useState([
    { title: "Chicken", expanded: true, children: [{ title: "Egg" }] },
  ]);

  return (
    <div style={{ height: 300, width: 700 }}>
      <DndProvider backend={HTML5Backend}>
        <SortableTree
          treeData={treeData}
          onChange={setTreeData}
        />
      </DndProvider>
    </div>
  );
};

export default BarebonesNoContext;
