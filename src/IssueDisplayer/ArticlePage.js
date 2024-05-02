import React from "react";
import Photos from "./Photos"; // Adapt Photos for web as needed
import { theme } from "./theme";
import TextEditor from "./TextEditor";

const ArticlePage = ({
  article,
  updateArticleContent,
  updateMainImageCaption,
  addNewContent,
  onMainImageUpload, 
  deleteLastContentItem,
  updateArticleTitle,
  updateArticleAuthor,
  setCurrentContentIndex,
  currentContentIndex,
}) => {
  if (!article) {
    return (
      <div style={styles.center}>
        <p>Loading...</p>
      </div>
    );
  }

  

  // Update image caption in the article content
  const updateImageCaption = (newCaption, index) => {
    updateArticleContent({ caption: newCaption }, article.id, index);
  };

  const titleStyle = {
    ...styles.title,
    marginTop:
      article.image && article.image.position === "top"
        ? theme.spacing.small
        : 0,
  };

  const handleListKeyDown = (e, parentIndex, index) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default Enter behavior (newline)
      insertListItem(parentIndex, index + 1);
    } else if (e.key === "Backspace" && e.currentTarget.textContent === "") {
      e.preventDefault(); // Prevent default Backspace behavior (browser navigation)
      if (article.content[parentIndex].items.length > 1) {
        removeListItem(parentIndex, index);
      }
    }
  };

  const insertListItem = (parentIndex, index) => {
    const newItems = [...article.content[parentIndex].items];
    newItems.splice(index, 0, "Enter list item here..."); // Include filler text
    updateArticleContent({ items: newItems }, article.id, parentIndex);
    // Wait for the state update and then focus the new item
    setTimeout(() => {
      const newElement = document.querySelector(
        `[data-index='${parentIndex}-${index}']`
      );
      if (newElement) {
        newElement.focus(); // Set focus to the new list item
      }
    }, 0);
  };

  const removeListItem = (parentIndex, index) => {
    const newItems = [...article.content[parentIndex].items];
    if (newItems.length > 1) {
      newItems.splice(index, 1); // Remove item at the index
      updateArticleContent({ items: newItems }, article.id, parentIndex);
      // Focus management
      setTimeout(() => {
        // Try to set focus to the previous item, if it exists; otherwise, set to the next item
        const previousIndex = index - 1;
        const newIndex = previousIndex >= 0 ? previousIndex : index;
        const focusElement = document.querySelector(
          `[data-index='${parentIndex}-${newIndex}']`
        );
        if (focusElement) {
          focusElement.focus();
        }
      }, 0);
    }
  };

  const updateListItem = (e, parentIndex, index) => {
    const newItems = [...article.content[parentIndex].items];
    newItems[index] = e.target.textContent; // Update text content
    updateArticleContent({ items: newItems }, article.id, parentIndex);
  };

  const handlePaste = (e) => {
    e.preventDefault(); // Stop data from being inserted
    const text = e.clipboardData.getData("text/plain"); // Get text representation of clipboard
    document.execCommand("insertHTML", false, text); // Insert text manually where the cursor is
  };

  const renderContentItem = (item, index) => {
    const isSelected = index === currentContentIndex;

    // Base style for selected content
    const selectedStyle = {
      outline: '2px solid black', // Example style for selected items
      backgroundColor: 'transparent', // Light background to highlight selection
      outlineOffset: '2px',

    };
    switch (item.type) {
      case "paragraph":
        return (
          <div

          onClick={() => setCurrentContentIndex(index)}
          style={isSelected ? { ...styles.contentParagraph, ...selectedStyle } : styles.contentParagraph}
            onBlur={(e) => handleBlur(e, index)}
            suppressContentEditableWarning={true}
            onPaste={(e) => handlePaste(e)}
            contentEditable={true}
          >
            {item.text}
          </div>
        );
      case "header":
        return (
          <div
          onClick={() => setCurrentContentIndex(index)}
          style={isSelected ? { ...styles.contentHeader, ...selectedStyle } : styles.contentHeader}
            onPaste={(e) => handlePaste(e)}
            onBlur={(e) => handleBlur(e, index)}
            suppressContentEditableWarning={true}
            contentEditable={true}
          >
            {item.text}
          </div>
        );
      case "image":
        return (
          <div           style={isSelected ? { ...styles.contentImage, ...selectedStyle } : styles.contentImage}
          onClick={() => setCurrentContentIndex(index)}
          >
            
            <Photos
              imageInfo={item}
              showCaption={true}
              onCaptionUpdate={(newCaption) =>
                updateImageCaption(newCaption, index)
              }
              onImageUpload={(file) => onImageUpload1(file, index)}
            />
          </div>
        );
      case "list":
        return (
          <div key={index}           style={isSelected ? { ...styles.listContainer, ...selectedStyle } : styles.listContainer}
          onClick={() => setCurrentContentIndex(index)}>
            {item.items.map((listItem, listItemIndex) => (
              <div key={listItemIndex} style={styles.listItem}>
                <span style={styles.bulletPoint}> • </span>
                <span
                  style={styles.listItemText}
                  contentEditable={true}
                  key={listItemIndex}
                  onBlur={(e) => updateListItem(e, index, listItemIndex)}
                  onKeyDown={(e) => handleListKeyDown(e, index, listItemIndex)}
                  onPaste={(e) => handlePaste(e)}
                  suppressContentEditableWarning={true}
                  data-index={`${index}-${listItemIndex}`}
                >
                  {listItem}
                </span>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
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
    if (article.image && article.image.source && article.image.position) {
      return (
        <div
          style={
            position === "bottom"
              ? { marginTop: theme.spacing.small }
              : { marginTop: 0 }
          }
        >
          <Photos
            imageInfo={article.image}
            showCaption={true}
            onCaptionUpdate={(newCaption) =>
              updateMainImageCaption(newCaption, article.id)
            }
            onImageUpload={(file) => onPreMainImageUpload(file)}
          />
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
    updateArticleContent(
      { source: `${imageUrl}`, file: file1 },
      article.id,
      index
    );

    // Optionally, you might want to upload the file to your server here
    // For demonstration, we'll just log the imageUrl which can be used directly in <img> tags
    console.log("Image uploaded and accessible at:", imageUrl);
  };

  return (
    <div style={styles.container}>
      {article.image &&
        article.image.position === "top" &&
        renderMainImage("top")}
      <TextEditor
        text={article.title.text}
        onTextChange={(text) => updateArticleTitle(text, article.id)}
        style={{ ...titleStyle }}
      />

      <TextEditor
        text={article.author}
        onTextChange={(text) => updateArticleAuthor(text, article.id)}
        style={{ ...styles.author }}
        leadingText="By "

      />
      {article.image &&
        (article.image.position === "side" || article.image.position === "bottom") &&
        renderMainImage("bottom")}

      {article.content.map((item, index) => renderContentItem(item, index))}
      <div style={styles.addButtonContainer}>
        <button
          onClick={() => addNewContent("paragraph")}
          style={styles.addButton}
        >
          Paragraph
        </button>
        <button
          onClick={() => addNewContent("header")}
          style={styles.addButton}
        >
          Header
        </button>
        <button onClick={() => addNewContent("image")} style={styles.addButton}>
          Image
        </button>
        <button onClick={() => addNewContent("list")} style={styles.addButton}>
          List
        </button>{" "}
        {/* Assuming addNewContent can handle list type */}
        <button onClick={deleteLastContentItem} style={styles.deleteButton}>
          Delete
        </button>{" "}
        {/* Delete last item button */}
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
   
  },
  author: {
    ...theme.fonts.author,
    fontSize: theme.fonts.author.fontSize * SIZE_MULTIPLIER - 0.01,
    marginTop: theme.spacing.small,
    
  },
  listContainer: {
    marginTop: theme.spacing.medium,
  },
  deleteButton: {
    background: "#ff6347", // A red color to distinguish it as a delete button
    color: "white",
    border: "none",
    padding: "10px 15px",
    fontSize: "13px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  articleContent: {
    display: "flex",
    flexDirection: "column",
    
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start", // Align items to start to handle multiline text alignment
  },
  bulletPoint: {
    fontSize: theme.fonts.content.fontSize, // Match font size of list item text or as desired
  },
  listItemText: {
    flex: 1, // Takes full width minus bullet point, allowing for proper wrapping of text
    ...theme.fonts.content, // Inherits the content font style including 'Georgia'
    
  },
  contentParagraph: {
    ...theme.fonts.content,
    marginTop: `${theme.spacing.medium}px`,
    
  },
  contentHeader: {
    ...theme.fonts.content,
    fontSize: `${theme.fonts.content.fontSize * 1.2}px`,
    marginTop: `${theme.spacing.medium}px`,
    marginBottom: `${-theme.spacing.medium}px`,
    
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  addButtonContainer: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: `${theme.spacing.medium}px`,
  },
  addButton: {
    padding: "5px 9px",
    fontSize: "13px",
    cursor: "pointer",
  },
  inputStyle: {
    
  },
};

export default ArticlePage;
