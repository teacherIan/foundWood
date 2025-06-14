// Simple debug version of Types component
import React from 'react';

function TypesDebug({ showTypes }) {
  console.log('TypesDebug rendered with showTypes:', showTypes);

  if (!showTypes) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: '200px',
        backgroundColor: 'red',
        border: '5px solid yellow',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
      }}
    >
      TYPES COMPONENT IS VISIBLE
      <br />
      showTypes: {showTypes ? 'true' : 'false'}
    </div>
  );
}

export default TypesDebug;
