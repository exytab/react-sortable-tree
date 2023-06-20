import React, { useState } from "react";

import SortableTree from "../../../src";
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

const data = [
  {
    title: "The file explorer theme",
    expanded: true,
    children: [
      {
        title: "Imported from @nosferatu500/theme-file-explorer",
        expanded: true,
        children: [
          {
            title: (
              <div>
                Find it on{" "}
                <a href="https://www.npmjs.com/package/@nosferatu500/theme-file-explorer">
                  npm
                </a>
              </div>
            ),
          },
        ],
      },
    ],
  },
  { title: "More compact than the default" },
  {
    title: (
      <div>
        Simply set it to the <code>theme</code> prop and you&rsquo;re
        done!
      </div>
    ),
  },
];

const Themes: React.FC = () => {
  const [treeData, setTreeData] = useState(data);

  return (
    <div style={{ height: 300, width: 700 }}>
      <SortableTree
        treeData={treeData}
        onChange={setTreeData}
      />
    </div>
  );
};

export default Themes;
