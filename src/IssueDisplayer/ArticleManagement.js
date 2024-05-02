import React from 'react';

const ArticleManagement = ({ moveArticle, deleteArticle }) => {
  return (
    <div style={styles.container}>
      <button onClick={() => moveArticle('up')} style={styles.button}>Move Up</button>
      <button onClick={() => moveArticle('down')} style={styles.button}>Move Down</button>
      <button onClick={deleteArticle} style={styles.deleteButton}>Delete Article</button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px',
    marginTop: '10px',
  },
  button: {
    backgroundColor: '#4CAF50', // Green
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '5px'
  },
  deleteButton: {
    backgroundColor: '#f44336', // Red
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '5px'
  }
};

export default ArticleManagement;
