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
    let text = e.clipboardData.getData("text/plain");
    text = text.replace(/[\r\n]+/g, ''); // Strip all newlines from pasted text
    document.execCommand("insertHTML", false, text); // Insert text manually where the cursor is
  };

  // Handle composition start
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  // Handle composition end
  const handleCompositionEnd = (event) => {
    setIsComposing(false);
    if (onTextChange) {
      onTextChange(event.target.innerText);
    }
  };

  // Prevent Enter from creating a new line
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Stop the Enter key from creating a newline
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
    <div style={combinedStyles}>
      {(leadingText !== '') && <span >{leadingText}</span>}
      <span
        ref={editorRef}
        contentEditable={true}
        onInput={handleInput}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
      />
    </div>
  );
};

export default TextEditor;
