import React from 'react';

function Week({ lived }) {
  const style = {
    width: '20px', // Width of the box
    height: '20px', // Height of the box
    border: '1px solid #000', // Border color and width
    borderRadius: '2px', // Border radius for rounded corners
    backgroundColor: lived ? '#68D391' : '#EDF2F7', // Color based on lived status
    boxSizing: 'border-box', // This ensures the padding and border are included in the total width and height
  };

  return <div style={style} />;
}

export default Week;
