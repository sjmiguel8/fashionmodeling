import * as React from "react";

const Heart = React.forwardRef(({ color = "currentColor", size = 24, strokeWidth = 2, className, children, isSaved, ...props }, ref) => {
  const { isSaved: _isSaved, ...rest } = props; // Destructure isSaved
  const heartStyle = {
    fill: isSaved ? color : "none",
    stroke: color,
  };

  return (React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    style: heartStyle,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    ref: ref,
    ...rest, // Pass the rest of the props
  },
    children,
    React.createElement("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })));
});
Heart.displayName = "Heart";
export { Heart };
