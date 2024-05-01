import React from "react";
import Photos from "./Photos"; // Make sure Photos is adapted for web use
import { theme } from "./theme"; 

const NewsBlock = ({ article, updateArticleAuthor, updateArticleDate, updateArticleTitle, updateArticleSummary, setCurrentArticleID,onMainImageUpload }) => {
  const { title, summary, author, image } = article;

  // Simulate navigation functionality - empty for now as specified
  const navigateToArticle = () => {

    setCurrentArticleID(article.id);
  };

  // Adjust marginTop based on image position for the title
  const titleStyle = {
    ...styles[`${title.size}Title`],
    marginTop: image.show && image.position === "top" ? theme.spacing.small : '0px',
  };

  const onPreMainImageUpload = (file) => {
  

    if (!file) return;
  
    // Create a URL for the uploaded file
    const imageUrl = URL.createObjectURL(file);
  
    // Update the article content with the new image URL
    onMainImageUpload(imageUrl, file, article.id);
    // Optionally, you might want to upload the file to your server here
    // For demonstration, we'll just log the imageUrl which can be used directly in <img> tags
    console.log("Image uploaded and accessible at:", imageUrl);
  };
  

  return (
    <div style={styles.storyWrapper} onClick={navigateToArticle}>
      {image.position === "side" && image.show && (
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <div style={{ flex: 1, paddingRight: theme.spacing.medium }}>
            <div contentEditable="true"
              style={{ ...titleStyle, ...styles.inputStyle }}
              onBlur={(e) => updateArticleTitle(e.currentTarget.textContent, article.id)}
            >{title.text}</div>
            {summary && summary.show && (
              <div contentEditable="true"
                style={{ ...styles.summary, ...styles.inputStyle }}
                onBlur={(e) => updateArticleSummary(e.currentTarget.textContent, article.id)}
              >{summary.content}</div>
            )}
            <div contentEditable="true"
              style={{ ...styles.author, ...styles.inputStyle, marginTop: theme.spacing.small }}
              onBlur={(e) => updateArticleAuthor(e.currentTarget.textContent, article.id)}
            >{author}</div>
          </div>
          <div style={{ width: '125px', height: '125px', marginTop: `${4.75 * (styles[`${title.size}Title`].fontSize / theme.titleSizes.medium.fontSize)}px` }}>
            <Photos imageInfo={image} isSquare={true} onImageUpload={onPreMainImageUpload}/>
          </div>
        </div>
      )}
      {image.position !== "side" && (
        <div>
          {image.position === "top" && image.show && <Photos imageInfo={image} onImageUpload={onPreMainImageUpload} />}
          <div style={styles.storyContent}>
            <div contentEditable="true"
              style={{ ...titleStyle, ...styles.inputStyle }}
              onBlur={(e) => updateArticleTitle(e.currentTarget.textContent, article.id)}
            >{title.text}</div>
            {summary && summary.show && (
              <div contentEditable="true"
                style={{ ...styles.summary, ...styles.inputStyle }}
                onBlur={(e) => updateArticleSummary(e.currentTarget.textContent, article.id)}
              >{summary.content}</div>
            )}
            <div contentEditable="true"
              style={{ ...styles.author, ...styles.inputStyle, marginTop: theme.spacing.small }}
              onBlur={(e) => updateArticleAuthor(e.currentTarget.textContent, article.id)}
            >{author}</div>
          </div>
          {image.position === "bottom" && image.show && (
            <div style={{ marginTop: theme.spacing.small }}>
              <Photos imageInfo={image} onImageUpload={onPreMainImageUpload}/>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Styles using object, similar to StyleSheet in React Native
const styles = {
  storyWrapper: {
    paddingLeft: `${theme.spacing.medium}px`,
    paddingRight: `${theme.spacing.medium}px`,
    paddingTop: '0px',
    paddingBottom: '0px',
    backgroundColor: "#fff",
    position: "relative",
    paddingVertical: '0px',
  },
  bigTitle: {
    ...theme.fonts.title,
    ...theme.titleSizes.big,
  },
  mediumTitle: {
    ...theme.fonts.title,
    ...theme.titleSizes.medium,
  },
  smallTitle: {
    ...theme.fonts.title,
    ...theme.titleSizes.small,
  },
  summary: {
    ...theme.fonts.summary,
    marginTop: theme.spacing.small,
  },
  author: {
    ...theme.fonts.author,
    marginTop: theme.spacing.small,
  },
  storyContent: {
    display: "flex",
    flexDirection: "column",
  },
  inputStyle: {
    border: 'none',
    outline: 'none',
  }
  

};

export default NewsBlock;
