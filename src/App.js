import React, { useState } from "react";

import ArticleList from "./IssueDisplayer/ArticleList";
import ArticlePage from "./IssueDisplayer/ArticlePage"; // Make sure this import path is correct
import ArticleSettings from "./IssueDisplayer/ArticleSettings"; // Import the settings component
import AddArticle from './IssueDisplayer/AddArticle'; // Import the new component
import FetchIssueData from './IssueDisplayer/FetchIssueData';
import ArticleManagement from './IssueDisplayer/ArticleManagement'; // Adjust path as needed

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
        items: type === 'list' ? ["Enter list item here...", "Enter list item here..."] : undefined, 
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

  const deleteLastContentItem = () => {
    if (!currentArticleID) return; // Do nothing if no article is selected
  
    setArticles(prevArticles => {
      // Find the correct section and article
      const sections = Object.keys(prevArticles);
      for (const section of sections) {
        const articleIndex = prevArticles[section].findIndex(article => article.id === currentArticleID);
        if (articleIndex !== -1) {
          // Copy the article's content and remove the last item if it exists
          const newArticle = { ...prevArticles[section][articleIndex] };
          if (newArticle.content && newArticle.content.length > 0) {
            newArticle.content = newArticle.content.slice(0, -1);
          }
  
          // Construct the new articles array for the section
          const newArticlesForSection = [
            ...prevArticles[section].slice(0, articleIndex),
            newArticle,
            ...prevArticles[section].slice(articleIndex + 1)
          ];
  
          // Return the updated articles state with the modified section
          return {
            ...prevArticles,
            [section]: newArticlesForSection
          };
        }
      }
      return prevArticles; // In case no modifications are necessary
    });
  };
  

  const moveArticle = (direction) => {
    if (!currentArticleID) return;
    const sectionKeys = Object.keys(articles);
    for (const section of sectionKeys) {
      const index = articles[section].findIndex(article => article.id === currentArticleID);
      if (index === -1) continue; // Current article not found in this section
  
      // Calculate new index based on direction
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= articles[section].length) continue; // Ignore if new index is out of bounds
  
      // Swap articles in the array
      const newArticlesList = [...articles[section]];
      [newArticlesList[index], newArticlesList[newIndex]] = [newArticlesList[newIndex], newArticlesList[index]];
  
      // Update the articles state with the new array
      setArticles(prev => ({
        ...prev,
        [section]: newArticlesList
      }));
      break; // Exit after moving the article
    }
  };
  
  const deleteArticle = () => {
    if (!currentArticleID) return;
    const updatedArticles = {};
    Object.keys(articles).forEach(section => {
      updatedArticles[section] = articles[section].filter(article => article.id !== currentArticleID);
    });
    setArticles(updatedArticles);
    setCurrentArticleID(null); // Reset current article ID if it's the one being deleted
  };
  
  return (
    <div style={appContainer}>
      <div style={columnContainer}>
          <FetchIssueData setArticles={setArticles} articles={articles} />
          <AddArticle articles={articles} setArticles={setArticles} /> {/* Add the new component here */}
          </div>

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
            deleteLastContentItem={deleteLastContentItem}
          />
        ) : (
          <p>Select an article</p>
        )}

        
      </div>
      <div style={phoneContainer}>

      {currentArticle ? (
        <div>
          <ArticleSettings
            article={currentArticle}
            onUpdate={handleUpdateArticleSettings}
          />
          <ArticleManagement
          moveArticle={moveArticle}
          deleteArticle={deleteArticle}
        />
        </div>
        ) : (
          <p>Select an article</p>
        )}
      </div>

    </div>
  );
};
const phoneContainer = {
  marginTop: "50px",

  width: "375px", // Typical width of a modern smartphone
  height: "780px", // Typical height of a modern smartphone
  border: "1px solid #ddd", // Adds a subtle border to mimic a phone
  margin: "0", // Centers the container on the page
  boxShadow: "0 0 10px rgba(0,0,0,0.1)", // Adds a subtle shadow for a 3D effect
  overflowY: "scroll", // Allows vertical scrolling within the container
  overflowX: "hidden", // Prevents horizontal scrolling
  WebkitOverflowScrolling: "touch", // Optimizes scrolling on iOS devices
  scrollbarWidth: "none", // Hides scrollbar for Firefox
  msOverflowStyle: "none", // Hides scrollbar for IE 10+
};
const columnContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center", // Center children horizontally
  justifyContent: "start", // Align children to the start of the flex direction
  margin: "0 auto", // Centers the container
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
