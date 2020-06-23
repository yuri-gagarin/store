import React from "react";

interface SpacerProps {
  width: number | string;
  height: number | string;
};
// a spacer componet for whatever needs //
export const Spacer: React.FC<SpacerProps> = ({ width, height }): JSX.Element => {
  return <div style={{ width: width, height: height }}></div>
};

export default Spacer;