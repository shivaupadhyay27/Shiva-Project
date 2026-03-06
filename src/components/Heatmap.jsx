import React, { useEffect, useState } from "react";
import { getActivity } from "../utils/activity";
function Heatmap() {

  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const data = getActivity();
    setActivity(data);
  }, []);

  const days = 30;

  const boxes = [];

  for (let i = 0; i < days; i++) {

    const active = activity[i];

    boxes.push(
      <div
        key={i}
        style={{
          width: "20px",
          height: "20px",
          margin: "4px",
          borderRadius: "4px",
          backgroundColor: active ? "#4caf50" : "#ddd"
        }}
      ></div>
    );
  }

  return (
    <div>
      <h2>Activity Heatmap</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 24px)"
        }}
      >
        {boxes}
      </div>

    </div>
  );
}

export default Heatmap;