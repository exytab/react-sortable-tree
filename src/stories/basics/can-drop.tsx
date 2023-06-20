import React, { useState } from "react";

import SortableTree from "../../../src";
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

const data = [
  {
    id: "trap",
    title: "Wicked witch",
    subtitle: "Traps people",
    expanded: true,
    children: [{ id: "trapped", title: "Trapped" }],
  },
  {
    id: "no-grandkids",
    title: "Jeannie",
    subtitle: "Doesn't allow grandchildren",
    expanded: true,
    children: [{ id: "jimmy", title: "Jimmy" }],
  },
  {
    id: "twin-1",
    title: "Twin #1",
    isTwin: true,
    subtitle: "Doesn't play with other twin",
  },
  {
    id: "twin-2",
    title: "Twin #2",
    isTwin: true,
    subtitle: "Doesn't play with other twin",
  },
];

const CanDrop: React.FC = () => {
  const [treeData, setTreeData] = useState(data);

  const canDrop = ({ node, nextParent, prevPath, nextPath }: any) => {
    if (prevPath.indexOf("trap") >= 0 && nextPath.indexOf("trap") < 0) {
      return false;
    }

    if (node.isTwin && nextParent && nextParent.isTwin) {
      return false;
    }

    const noGrandkidsDepth = nextPath.indexOf("no-grandkids");
    if (noGrandkidsDepth >= 0 && nextPath.length - noGrandkidsDepth > 2) {
      return false;
    }

    return true;
  };

  return (
    <div style={{ height: 300, width: 700 }}>
      <SortableTree
        treeData={treeData}
        canDrop={canDrop}
        // Need to set getNodeKey to get meaningful ids in paths
        getNodeKey={({ node }: any) => node.id}
        onChange={setTreeData}
      />
    </div>
  );
};

export default CanDrop;
