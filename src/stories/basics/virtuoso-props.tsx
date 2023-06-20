import React, { useState } from "react";
import { VirtuosoHandle } from "react-virtuoso";

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
      { title: "Egg" },
    ],
  },
];

const VirtuosoProps: React.FC = () => {
  const [treeData, setTreeData] = useState(data);

  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  const virtuosoRef = React.createRef<VirtuosoHandle>();

  const isScrollingVirtuoso = (scrollingState: any) => {
    if (virtuosoRef?.current) {
      virtuosoRef?.current.getState(virtuosoState => {
        setIsScrolling(scrollingState);
        setScrollTop(virtuosoState.scrollTop);
      });
    }
  };

  return (
    <div>
      <div style={{ height: 300, width: 700 }}>
        <SortableTree
          treeData={treeData}
          onChange={setTreeData}
          virtuosoRef={virtuosoRef}
          virtuosoProps={{ isScrolling: isScrollingVirtuoso }}
        />
      </div>
      <hr />
        Current scrollTop:{" "}
      {isScrolling ? "..." : scrollTop}
    </div>
  );
};

export default VirtuosoProps;
