import React, { useState } from "react";

import ArticleList from "./IssueDisplayer/ArticleList";
import ArticlePage from "./IssueDisplayer/ArticlePage"; // Make sure this import path is correct
import ArticleSettings from "./IssueDisplayer/ArticleSettings"; // Import the settings component
import FetchIssueData from './IssueDisplayer/FetchIssueData'; // Adjust path as needed

const App = () => {
  const [articles, setArticles] = useState({});
  const [currentArticleID, setCurrentArticleID] = useState(null);

  const updateArticle = (section, id, update) => {
    const updatedArticles = articles[section].map((article) => {
      if (article.id === id) {
        return { ...article, ...update };
      }
      return article;
    });
    setArticles((prev) => ({ ...prev, [section]: updatedArticles }));
  };

  const updateArticleAuthor = (newAuthor, id) => {
    Object.keys(articles).forEach((section) => {
      const articleExists = articles[section].some(
        (article) => article.id === id
      );
      if (articleExists) {
        updateArticle(section, id, { author: newAuthor });
      }
    });
  };

  const updateArticleDate = (newDate, id) => {
    Object.keys(articles).forEach((section) => {
      const articleExists = articles[section].some(
        (article) => article.id === id
      );
      if (articleExists) {
        updateArticle(section, id, { date: newDate });
      }
    });
  };

  const updateArticleTitle = (newTitle, id) => {
    Object.keys(articles).forEach((section) => {
      const articleExists = articles[section].some(
        (article) => article.id === id
      );
      if (articleExists) {
        updateArticle(section, id, {
          title: {
            ...articles[section].find((article) => article.id === id).title,
            text: newTitle,
          },
        });
      }
    });
  };

  const updateArticleSummary = (newSummary, id) => {
    Object.keys(articles).forEach((section) => {
      const articleExists = articles[section].some(
        (article) => article.id === id
      );
      if (articleExists) {
        updateArticle(section, id, {
          summary: {
            ...articles[section].find((article) => article.id === id).summary,
            content: newSummary,
          },
        });
      }
    });
  };

  const updateArticleContent = (newContent, id, index) => {
    Object.keys(articles).forEach((section) => {
      const articleIndex = articles[section].findIndex(
        (article) => article.id === id
      );
      if (articleIndex !== -1) {
        const article = articles[section][articleIndex];
        const updatedContent = [...article.content];
        updatedContent[index] = { ...updatedContent[index], ...newContent };

        // Update the article with the new content array
        updateArticle(section, id, { content: updatedContent });
        console.log(updatedContent[index])

      }
    });
  };

  const getCurrentArticle = () => {
    let foundArticle = null;
    Object.keys(articles).forEach((section) => {
      if (foundArticle) return; // If found, no need to continue searching
      const article = articles[section].find(
        (article) => article.id === currentArticleID
      );
      if (article) foundArticle = article;
    });
    return foundArticle;
  };

  const currentArticle = getCurrentArticle();

  const updateMainImageCaption = (newCaption, id) => {
    Object.keys(articles).forEach((section) => {
      const articleIndex = articles[section].findIndex(
        (article) => article.id === id
      );
      if (articleIndex !== -1) {
        const article = articles[section][articleIndex];
        const updatedImage = {
          ...article.image,
          caption: newCaption,
        };

        // Update the article with the new image object

        updateArticle(section, id, { image: updatedImage });
      }
    });
  };
  const handleUpdateArticleSettings = (updates) => {
    setArticles((prevArticles) => {
      return Object.keys(prevArticles).reduce((newArticles, section) => {
        newArticles[section] = prevArticles[section].map((article) => {
          if (article.id === currentArticleID) {
            return { ...article, ...updates };
          }
          return article;
        });
        return newArticles;
      }, {});
    });
  };
  

  const onMainImageUpload = async (newSource, file1, id) => {
    Object.keys(articles).forEach((section) => {
      const articleIndex = articles[section].findIndex(
        (article) => article.id === id
      );
      if (articleIndex !== -1) {
        const article = articles[section][articleIndex];
        const updatedImage = {
          ...article.image,
          file: file1,
          source: newSource,
        };

        // Update the article with the new image object

        updateArticle(section, id, { image: updatedImage });
      }
    });
  };


  const addNewContent = (type) => {
      const newContentItem = {
        type: type,
        text: type === "paragraph" || type === "header" ? "New text..." : undefined, // default text for paragraphs or headers
        source: type === "image" ? "" : undefined, // default source URL for images
        caption: type === "image" ? "New caption..." : undefined, // default caption for images
      };
    
      
    
  
    setArticles((prevArticles) => {
      return Object.keys(prevArticles).reduce((newArticles, section) => {
        newArticles[section] = prevArticles[section].map((article) => {
          if (article.id === currentArticleID) {
            // Copy the existing content and add the new content item at the end
            return {
              ...article,
              content: [...article.content, newContentItem],
            };
          }
          return article;
        });
        return newArticles;
      }, {});
    });
  };
  

  return (
    <div style={appContainer}>
          <FetchIssueData setArticles={setArticles} articles={articles} />

      <div style={phoneContainer}>
        <ArticleList
          articles={articles}
          updateArticleAuthor={updateArticleAuthor}
          updateArticleDate={updateArticleDate}
          updateArticleTitle={updateArticleTitle}
          updateArticleSummary={updateArticleSummary}
          setCurrentArticleID={setCurrentArticleID}
          onMainImageUpload={onMainImageUpload}
        />
      </div>
      <div style={phoneContainer}>
        {currentArticle ? (
          <ArticlePage
            article={currentArticle}
            updateArticleContent={updateArticleContent}
            updateMainImageCaption={updateMainImageCaption}
            addNewContent={addNewContent}
          />
        ) : (
          <p>Select an article</p>
        )}

        
      </div>

      {currentArticle ? (
          <ArticleSettings
            article={currentArticle}
            onUpdate={handleUpdateArticleSettings}
          />
        ) : (
          <p>Select an article</p>
        )}
    </div>
  );
};
const phoneContainer = {
  marginTop: "50px",

  width: "375px", // Typical width of a modern smartphone
  height: "850px", // Typical height of a modern smartphone
  border: "1px solid #ddd", // Adds a subtle border to mimic a phone
  margin: "auto", // Centers the container on the page
  boxShadow: "0 0 10px rgba(0,0,0,0.1)", // Adds a subtle shadow for a 3D effect
  overflowY: "scroll", // Allows vertical scrolling within the container
  overflowX: "hidden", // Prevents horizontal scrolling
  WebkitOverflowScrolling: "touch", // Optimizes scrolling on iOS devices
  scrollbarWidth: "none", // Hides scrollbar for Firefox
  msOverflowStyle: "none", // Hides scrollbar for IE 10+
};

// Additional style for hiding the scrollbar in Webkit browsers like Chrome and Safari
const webkitScrollbarStyles = {
  "&::-webkit-scrollbar": {
    display: "none", // Hides the scrollbar in Webkit browsers
  },
};
const appContainer = {
  display: "flex", // Enables flexbox layout
  justifyContent: "center", // Centers the children horizontally
  alignItems: "start", // Aligns children to the top
  gap: "20px", // Adds space between the children
  paddingTop: "50px",
};

export default App;
