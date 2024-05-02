import React from 'react';

const ContentManagement = ({ moveContentUp, moveContentDown, deleteContent }) => {
  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Content Controls</h3>
      <div style={styles.buttonsContainer}>
        <button onClick={moveContentUp} style={styles.button}>Move Content Up</button>
        <button onClick={moveContentDown} style={styles.button}>Move Content Down</button>
      </div>
      <button onClick={deleteContent} style={styles.deleteButton}>Delete Content</button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '20px',
    background: '#f8f9fa',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    marginTop: '20px',
    width: '100%', // Adjust width to fit your layout
  },
  header: {
    fontSize: '20px',
    color: '#333',
    marginBottom: '10px',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '75%', // Adjust width to fit your layout
  },
  button: {
    backgroundColor: '#4CAF50', // Green
    color: 'white',
    border: 'none',
    padding: '10px 0px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '13px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '5px',
    flex: 1, // Make buttons take equal space
  },
  deleteButton: {
    backgroundColor: '#f44336', // Red
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '13px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '5px',
    flex: 1, // Make buttons take equal space
  }
};

export default ContentManagement;
