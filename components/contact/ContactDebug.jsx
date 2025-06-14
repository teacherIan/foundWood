// Simple debug version of Contact component
import React from 'react';

function ContactDebug({ showContactPage }) {
  console.log('ContactDebug rendered with showContactPage:', showContactPage);

  if (!showContactPage) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        height: '300px',
        backgroundColor: 'blue',
        border: '5px solid orange',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
      }}
    >
      CONTACT COMPONENT IS VISIBLE
      <br />
      showContactPage: {showContactPage ? 'true' : 'false'}
    </div>
  );
}

export default ContactDebug;
