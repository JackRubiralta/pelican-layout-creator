import React, { useState, useEffect, useRef } from "react";

const TextEditor = ({ text, onTextChange, style, leadingText = "" }) => {
  const editorRef = useRef(null);
  const [isComposing, setIsComposing] = useState(false);

  // Handles direct text input and composition events (like IME)
  const handleInput = (event) => {
    if (!isComposing) {
      const newText = event.target.innerText;
      if (onTextChange) {
        onTextChange(newText);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault(); // Stop data from being inserted
    const text = e.clipboardData.getData("text/plain"); // Get text representation of clipboard
    document.execCommand("insertHTML", false, text); // Insert text manually where the cursor is
  };

  // Handle composition start
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  // Handle composition end
  const handleCompositionEnd = (event) => {
    setIsComposing(false);
    // Call onTextChange at the end of composition
    if (onTextChange) {
      onTextChange(event.target.innerText);
    }
  };

  // Effect to update the content if the text prop changes from outside
  useEffect(() => {
    if (editorRef.current && text !== editorRef.current.innerText) {
      editorRef.current.innerText = text;
    }
  }, [text]);
  const combinedStyles = {
    ...style,
    outlineOffset: '2px',
    backgroundColor: 'transparent',
  };
  return (
    <div>
      {(leadingText !== '') && <span style={{ ...style }}>{leadingText}</span>}
      <span
        ref={editorRef}
        contentEditable={true}
        onInput={handleInput}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        style={combinedStyles}        onPaste={handlePaste}
      />
    </div>
  );
};

export default TextEditor;
