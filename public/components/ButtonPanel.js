import React from 'react';

export const ButtonPanel = ({ zoom, move }) => {
  return (
    <div className="button-container">
      <button id="increase" className="increase-btn" onClick={() => zoom(1)}>
        +
      </button>
      <button id="decrease" className="decrease-btn" onClick={() => zoom(-1)}>
        -
      </button>
      <button id="increase" className="increase-btn" onClick={() => move(300)}>
        L
      </button>
      <button id="decrease" className="decrease-btn" onClick={() => move(-300)}>
        R
      </button>
    </div>
  );
};
