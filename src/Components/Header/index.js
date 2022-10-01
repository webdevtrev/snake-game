import React from "react";
import "./styles.scss";
export default function Header() {
  return (
    <div className="Header">
      <h1>Snake Game by webdevtrev</h1>
      <div>
        use <kbd>W</kbd>
        <kbd>A</kbd>
        <kbd>S</kbd>
        <kbd>D</kbd>
        or
        <kbd>Arrow Up</kbd>
        <kbd>Arrow Left</kbd>
        <kbd>Arrow Down</kbd>
        <kbd>Arrow Right</kbd>
        to move
      </div>
    </div>
  );
}
