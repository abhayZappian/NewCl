import React, { memo } from "react";

const ConditionalRendering = memo(({ isVisible, children }) => (
  <div>{isVisible && children}</div>
));

export default ConditionalRendering;
