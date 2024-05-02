import React from "react";
import Photos from "./Photos"; // Make sure Photos is adapted for web use
import { theme } from "./theme";
import TextEditor from "./TextEditor";

const NewsBlock = ({
  article,
  updateArticleAuthor,
  updateArticleDate,
  updateArticleTitle,
  updateArticleSummary,
  setCurrentArticleID,
  onMainImageUpload,
}) => {
  const { title, summary, author, image } = article;

  // Simulate navigation functionality - empty for now as specified
  const navigateToArticle = () => {
    setCurrentArticleID(article.id);
  };

  // Adjust marginTop based on image position for the title
  const titleStyle = {
    ...styles[`${title.size}Title`],
    marginTop:
      image.show && image.position === "top" ? theme.spacing.small : "0px",
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
          <TextEditor
              text={title.text}
              onTextChange={(text) => updateArticleTitle(text, article.id)}
              style={{ ...titleStyle, ...styles.inputStyle }}
            />
            {summary && summary.show && (
               <TextEditor
               text={summary.content}
               onTextChange={(newText) => updateArticleSummary(newText, article.id)}
               style={{ ...styles.summary, ...styles.inputStyle }}
             />
            )}
            <TextEditor
              text={author}
              onTextChange={(newText) =>
                updateArticleAuthor(newText, article.id)
              }
              leadingText="By  "
              style={{
                ...styles.author,
                ...styles.inputStyle,
                marginTop: theme.spacing.small,
              }}
            />
          </div>
          <div
            style={{
              width: "125px",
              height: "125px",
              marginTop: `${
                4.75 *
                (styles[`${title.size}Title`].fontSize /
                  theme.titleSizes.medium.fontSize)
              }px`,
            }}
          >
            <Photos
              imageInfo={image}
              isSquare={true}
              onImageUpload={onPreMainImageUpload}
            />
          </div>
        </div>
      )}
      {image.position !== "side" && (
        <div>
          {image.position === "top" && image.show && (
            <Photos imageInfo={image} onImageUpload={onPreMainImageUpload} />
          )}
          <div style={styles.storyContent}>
            <TextEditor
              text={title.text}
              onTextChange={(text) => updateArticleTitle(text, article.id)}
              style={{ ...titleStyle, ...styles.inputStyle }}
            />
            {summary && summary.show && (
              <TextEditor
              text={summary.content}
              onTextChange={(newText) => updateArticleSummary(newText, article.id)}
              style={{ ...styles.summary, ...styles.inputStyle }}
            />
            
            )}
            <TextEditor
              text={author}
              onTextChange={(newText) =>
                updateArticleAuthor(newText, article.id)
              }
              leadingText="By  "

              style={{
                ...styles.author,
                ...styles.inputStyle,
                marginTop: theme.spacing.small,
              }}
            />
          </div>
          {image.position === "bottom" && image.show && (
            <div style={{ marginTop: theme.spacing.small }}>
              <Photos imageInfo={image} onImageUpload={onPreMainImageUpload} />
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
    paddingTop: "0px",
    paddingBottom: "0px",
    backgroundColor: "#fff",
    position: "relative",
    paddingVertical: "0px",
  },
  authorContainer: {
    display: 'flex', // Ensures that the label and text editor are in a row
    alignItems: 'center', // Vertically aligns the label and text editor
    // Additional styling might be necessary depending on your design requirements
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
    
  },
};

export default NewsBlock;
