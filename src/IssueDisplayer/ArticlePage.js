import React from "react";
import Photos from "./Photos"; // Adapt Photos for web as needed
import { theme } from "./theme";

const ArticlePage = ({ article, updateArticleContent, updateMainImageCaption, addNewContent, onMainImageUpload }) => {
  if (!article) {
    return <div style={styles.center}><p>Loading...</p></div>;
  }

  // Update image caption in the article content
  const updateImageCaption = (newCaption, index) => {
    updateArticleContent({ caption: newCaption }, article.id, index);
  };

  const titleStyle = {
    ...styles.title,
    marginTop: article.image && article.image.position === "top" ? theme.spacing.small : 0
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
  
  
  const renderMainImage = (position) => {
    if (article.image && article.image.source && article.image.position === position) {
      return (
        <div style={
          position === "bottom"
            ? { marginTop: theme.spacing.small }
            : { marginTop: 0 }
        }>
          <Photos imageInfo={article.image} showCaption={true} onCaptionUpdate={(newCaption) => updateMainImageCaption(newCaption, article.id)} onImageUpload={(file) => onPreMainImageUpload(file)}/>
        </div>
      );
    }
    return null;
  };
  const handleBlur = (content, idx) => {
    const newText = content.currentTarget.textContent;
 
    updateArticleContent({ text: newText }, article.id, idx);
  };
  const onImageUpload1 = (file1, index) => {
  

  
    // Create a URL for the uploaded file
    const imageUrl = URL.createObjectURL(file1);
  
    // Update the article content with the new image URL
    updateArticleContent({ source: `${imageUrl}`, file: file1 }, article.id, index);

    // Optionally, you might want to upload the file to your server here
    // For demonstration, we'll just log the imageUrl which can be used directly in <img> tags
    console.log("Image uploaded and accessible at:", imageUrl);
  };

  

  return (
    <div style={styles.container}>
      {article.image && article.image.position === "top" && (
        renderMainImage("top")
      )}
      <div style={titleStyle}>{article.title.text}</div>
      <div style={styles.author}>Published on {article.date} by {article.author}</div>
      {article.image && article.image.position === "bottom" && (
        renderMainImage("bottom")
      )}
      <div style={styles.articleContent}>
        {article.content.map((item, index) => (
          <div key={index}>
            {item.type === "paragraph" && <div style={styles.contentParagraph} onBlur={(e) => handleBlur(e, index)} contentEditable={true}>{item.text}</div>}
            {item.type === "header" && <div style={styles.contentHeader} onBlur={(e) => handleBlur(e, index)} contentEditable={true}>{item.text}</div>}
            {item.type === "image" && (
              <div style={styles.contentImage}>
                <Photos
                  imageInfo={item}
                  showCaption={true}
                  onCaptionUpdate={(newCaption) => updateImageCaption(newCaption, index)}

                  onImageUpload={(file) => onImageUpload1(file, index)}
                  />
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={styles.addButtonContainer}>
        <button onClick={() => addNewContent("paragraph")} style={styles.addButton}>Add Paragraph</button>
        <button onClick={() => addNewContent("header")} style={styles.addButton}>Add Header</button>
        <button onClick={() => addNewContent("image")} style={styles.addButton}>Add Image</button>
      </div>
    </div>
  );
};

const SIZE_MULTIPLIER = 1.15;

const styles = {
  container: {
    padding: `${theme.spacing.medium}px`,
    backgroundColor: theme.colors.background,
  },
  title: {
    ...theme.fonts.title,
    fontSize: `${theme.titleSizes.big.fontSize * SIZE_MULTIPLIER}px`,
    lineHeight: `${theme.titleSizes.big.lineHeight * SIZE_MULTIPLIER}px`,
    marginTop: `${theme.spacing.medium}px`,
    border: 'none',
    outline: 'none',
  },
  author: {
    ...theme.fonts.author,
    marginTop: `${theme.spacing.small}px`,
    border: 'none',
    outline: 'none',
  },
  articleContent: {
    display: "flex",
    flexDirection: "column",
    border: 'none',
    outline: 'none',
  },
  contentParagraph: {
    ...theme.fonts.content,
    marginTop: `${theme.spacing.medium}px`,
    border: 'none',
    outline: 'none',
  },
  contentHeader: {
    ...theme.fonts.content,
    fontSize: `${theme.fonts.content.fontSize * 1.2}px`,
    marginTop: `${theme.spacing.medium}px`,
    marginBottom: `${-theme.spacing.medium}px`,
    border: 'none',
    outline: 'none',
  },
  contentImage: {
    width: "100%",
    marginTop: `${theme.spacing.medium}px`,
  },
  mainImage: {
    width: "100%",
    marginTop: `${theme.spacing.small}px`,
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  addButtonContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: `${theme.spacing.medium}px`,
  },
  addButton: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  inputStyle: {
    border: 'none',
    outline: 'none',
  }
};

export default ArticlePage;
