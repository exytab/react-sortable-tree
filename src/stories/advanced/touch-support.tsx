import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

import { SortableTreeWithoutDndContext as SortableTree } from "../../../src";
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

// https://stackoverflow.com/a/4819886/1601953
const isTouchDevice = !!("ontouchstart" in window || navigator.maxTouchPoints);
const dndBackend = isTouchDevice ? TouchBackend : HTML5Backend;

const TouchSupport: React.FC = () => {
  const [treeData, setTreeData] = useState([
    { title: "Chicken", expanded: true, children: [{ title: "Egg" }] },
  ]);

  return (
    <DndProvider backend={dndBackend}>
      <div>
        <span>
            This is {!isTouchDevice && "not "}a touch-supporting browser
        </span>

        <div style={{ height: 300, width: 700 }}>
          <SortableTree
            treeData={treeData}
            onChange={setTreeData}
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default TouchSupport;
