import React from 'react';

// Assuming the theme.js is adapted for web use, including appropriate CSS unit conversions
import { theme } from "./theme"; 

const SectionSeparator = ({ sectionName, style }) => {
  return (
    <div style={{...styles.separatorContainer, ...style}}>
      <div style={styles.separator} />
      <div style={styles.textContainer}>
        <span style={styles.separatorText}>{sectionName}</span>
      </div>
    </div>
  );
};

// Convert StyleSheet.create to regular JS object suitable for React.js
const styles = {
  separatorContainer: {
    padding: `0 ${theme.spacing.medium}px`,

    alignSelf: "center",
    marginVertical: `${theme.spacing.large + 7 + 3}px`,
    marginBottom: '5px',
  },
  separator: {
    height: '2.4px',
    backgroundColor: "#303030",
    width: "100%",
  },
  textContainer: {
    marginTop: '3px',
    display: "flex",
    justifyContent: "flex-start", // Correct CSS property for alignment
    alignItems: "flex-start", // Correct CSS property for vertical alignment
    height: 'auto',
  },
  separatorText: {
    color: "#303030",
    fontSize: '11.3px', // Ensure your theme.js translates these appropriately for the web
    textAlign: "left",
    textTransform: "uppercase",
    fontWeight: 'bold',
    fontFamily: "utm-times-bold",
    letterSpacing: '0.7px',
  },
};

export default SectionSeparator;
