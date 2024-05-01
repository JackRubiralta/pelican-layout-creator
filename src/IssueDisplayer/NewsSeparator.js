import React from 'react';

// Assuming the theme.js is properly adapted for web use
import { theme } from "./theme"; 

const NewsSeparator = () => {
  return (
    <div style={styles.separatorContainer}>
      <div style={styles.separator}></div>
    </div>
  );
};

// Convert StyleSheet.create to regular JS object suitable for React.js
const styles = {
  separatorContainer: {
    padding: `0 ${theme.spacing.medium}px`,
    display: 'flex', // Flexbox for layout alignment similar to React Native
    justifyContent: 'center', // Center children horizontally
  },
  separator: {
    height: '1.5px',
    backgroundColor: '#999999',
    width: '100%',
    margin: `${theme.spacing.medium + 4}px 0`, // Convert theme spacing to CSS units
  }
};

export default NewsSeparator;
