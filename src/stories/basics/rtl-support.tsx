import React, { useState } from "react";

import SortableTree from "../../../src";
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

const data = [
  {
    title: "Chicken",
    expanded: true,
    children: [
      { title: "Egg" },
      { title: "Egg" },
      { title: "Egg" },
      { title: "Egg" },
      { title: "Egg" },
      { title: "Egg" },
    ],
  },
];

const RTLSupport: React.FC = () => {
  const [treeData, setTreeData] = useState(data);

  return (
    <div style={{ height: 300, width: 700 }}>
      <SortableTree
        rowDirection="rtl"
        treeData={treeData}
        onChange={setTreeData}
      />
    </div>
  );
};

export default RTLSupport;
