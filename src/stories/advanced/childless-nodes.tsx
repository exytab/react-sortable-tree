import React, { useState } from "react";

import SortableTree from "../../../src";
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

const data = [
  {
    title: "Managers",
    expanded: true,
    children: [
      {
        title: "Rob",
        children: [],
        isPerson: true,
      },
      {
        title: "Joe",
        children: [],
        isPerson: true,
      },
    ],
  },
  {
    title: "Clerks",
    expanded: true,
    children: [
      {
        title: "Bertha",
        children: [],
        isPerson: true,
      },
      {
        title: "Billy",
        children: [],
        isPerson: true,
      },
    ],
  },
];

const ChildlessNodes: React.FC = () => {
  const [treeData, setTreeData] = useState(data);

  return (
    <div style={{ height: 300, width: 700 }}>
      <SortableTree
        canNodeHaveChildren={(node: any) => !node.isPerson}
        treeData={treeData}
        onChange={setTreeData}
      />
    </div>
  );
};

export default ChildlessNodes;
