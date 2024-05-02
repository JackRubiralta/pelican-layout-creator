import React, { useState, useEffect } from "react";
import TextEditor from "./TextEditor";

// Adjust the import path to where you've saved theme.js
import { theme } from "./theme";

const Photos = ({
  imageInfo,
  isSquare = false,
  showCaption = false,
  onCaptionUpdate,
  onImageUpload,  // Prop to handle image file uploads
}) => {
  const [imageHeight, setImageHeight] = useState(200); // Default height
  const imageUrl = imageInfo.source;

  useEffect(() => {
    if (imageUrl && !isSquare) {
      // Fetch image dimensions if necessary
      fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const img = new Image();
          img.src = URL.createObjectURL(blob);
          img.onload = function () {
            const screenWidth = 350 - theme.spacing.medium * 2;
            const scaleFactor = this.width / screenWidth;
            setImageHeight(this.height / scaleFactor);
          };
        })
        .catch((error) => {
          console.error(`Cannot fetch image dimensions: ${error}`);
        });
    }
  }, [imageUrl, isSquare]);



  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageUpload(file, imageInfo.id);  // Assuming you pass the image ID for reference
    }
  };


  if (!imageInfo || !imageInfo.source) {
    return (
    <div>

      <div style={styles.imageUploadContainer}>
        <div style={styles.imageUploadPrompt}>
          <label htmlFor="image-upload">Upload Image</label>
          <input
            id="image-upload"
            type="file"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileInput}
          />
        </div>
      </div>
      {showCaption && (
       <TextEditor
       text={imageInfo.caption}
       onTextChange={(newText) => onCaptionUpdate(newText)}
       style={styles.caption}
     />
     
      )}
    </div>
    );
  }

  return (
    <div>
      <img
        style={{
          width: isSquare ? "100%" : "auto",
          height: isSquare ? "auto" : `${imageHeight}px`,
          aspectRatio: isSquare ? "1" : undefined,
        }}
        src={imageUrl}
        alt={imageInfo.caption || "Image"}
      />

      {showCaption && (
        <TextEditor
        text={imageInfo.caption}
        onTextChange={(newText) => onCaptionUpdate(newText)}
        style={styles.caption}
      />
      )}
    </div>
  );
};

const styles = {
  caption: {
    ...theme.fonts.author,
    marginTop: theme.spacing.small - 5,
    fontSize: "10.5px",
    color: "#474747",
    border: 'none',
    outline: 'none',
  },
  imageUploadContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '200px',  // Default square height
    backgroundColor: '#f0f0f0',
    border: '2px dashed #ccc',
    borderRadius: '10px',
    marginTop: theme.spacing.medium,
  },
  imageUploadPrompt: {
    textAlign: 'center',
  }
};

export default Photos;
