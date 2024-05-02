import React, { useState } from "react";

import ArticleList from "./IssueDisplayer/ArticleList";
import ArticlePage from "./IssueDisplayer/ArticlePage"; // Make sure this import path is correct
import ArticleSettings from "./IssueDisplayer/ArticleSettings"; // Import the settings component
import AddArticle from './IssueDisplayer/AddArticle'; // Import the new component
import FetchIssueData from './IssueDisplayer/FetchIssueData';
import ArticleManagement from './IssueDisplayer/ArticleManagement'; // Adjust path as needed
import ContentManagement from "./IssueDisplayer/ContentManagement"
const App = () => {
  const [articles, setArticles] = useState({});
  const [currentArticleID, setCurrentArticleID] = useState(null);
  const [currentContentIndex, setCurrentContentIndex]= useState(null);
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
  const moveContent = (direction) => {
    if (!currentArticleID || currentContentIndex == null) return;

    setArticles(prevArticles => {
        return Object.keys(prevArticles).reduce((newArticles, section) => {
            return {
                ...newArticles,
                [section]: prevArticles[section].map((article) => {
                    if (article.id === currentArticleID) {
                        const contentItems = [...article.content];
                        if (direction === 'up' && currentContentIndex > 0) {
                            const temp = contentItems[currentContentIndex - 1];
                            contentItems[currentContentIndex - 1] = contentItems[currentContentIndex];
                            contentItems[currentContentIndex] = temp;
                            setCurrentContentIndex(currentContentIndex - 1);
                        } else if (direction === 'down' && currentContentIndex < contentItems.length - 1) {
                            const temp = contentItems[currentContentIndex + 1];
                            contentItems[currentContentIndex + 1] = contentItems[currentContentIndex];
                            contentItems[currentContentIndex] = temp;
                            setCurrentContentIndex(currentContentIndex + 1);
                        }
                        return { ...article, content: contentItems };
                    }
                    return article;
                })
            };
        }, {});
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
    let found = false;

    for (let i = 0; i < sectionKeys.length; i++) {
        const section = sectionKeys[i];
        const index = articles[section].findIndex(article => article.id === currentArticleID);
        if (index === -1) continue; // Current article not found in this section

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < articles[section].length) {
            // Swap within the same section
            const newArticlesList = [...articles[section]];
            [newArticlesList[index], newArticlesList[newIndex]] = [newArticlesList[newIndex], newArticlesList[index]];
            setArticles(prev => ({
                ...prev,
                [section]: newArticlesList
            }));
            found = true;
        } else {
            // Moving between sections
            let targetSectionIndex = direction === 'up' ? i - 1 : i + 1;
            if (targetSectionIndex < 0 || targetSectionIndex >= sectionKeys.length) continue; // Check if target section is out of bounds
            const targetSection = sectionKeys[targetSectionIndex];
            const articleToMove = articles[section].splice(index, 1)[0]; // Remove article from current section
            if (direction === 'down') {
                articles[targetSection].unshift(articleToMove); // Add to the beginning of the target section
            } else {
                articles[targetSection].push(articleToMove); // Add to the end of the target section
            }
            setArticles(prev => ({
                ...prev,
                [section]: articles[section],
                [targetSection]: articles[targetSection]
            }));
            found = true;
        }
        if (found) break; // Break the loop once the article has been moved
    }
};
const deleteContent = () => {
  if (!currentArticleID || currentContentIndex === null) return; // Do nothing if no article or content is selected

  setArticles(prevArticles => {
      // Find the correct section and article
      const sections = Object.keys(prevArticles);
      for (const section of sections) {
          const articleIndex = prevArticles[section].findIndex(article => article.id === currentArticleID);
          if (articleIndex !== -1) {
              // Copy the article's content and remove the specified item
              const newArticle = { ...prevArticles[section][articleIndex] };
              if (newArticle.content && newArticle.content.length > 0 && currentContentIndex < newArticle.content.length) {
                  newArticle.content = [
                      ...newArticle.content.slice(0, currentContentIndex),
                      ...newArticle.content.slice(currentContentIndex + 1)
                  ];
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
            updateArticleAuthor={updateArticleAuthor}
            updateArticleTitle={updateArticleTitle}
            setCurrentContentIndex={setCurrentContentIndex}
            currentContentIndex={currentContentIndex}
          />
        ) : (
          <div style={centerContentStyle}>
          <p>Select an article</p>
      </div>
        )}

        
      </div>
      <div style={settingsContainer}>

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
         <ContentManagement
          moveContentUp={() => moveContent('up')}
          moveContentDown={() =>moveContent('down')}
          deleteContent={deleteContent}
        />
        </div>
        ) : (
          <div style={centerContentStyle}>
          <p>Select an article</p>
      </div>
        )}
      </div>

    </div>
  );
};
const phoneContainer = {
  marginTop: "50px",

  width: "350px", // Typical width of a modern smartphone
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
const centerContentStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%', // This ensures it takes full height of its parent
};
const settingsContainer = {
  marginTop: "50px",

  width: "275px", // Typical width of a modern smartphone
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
  marginTop: "50px",

  width: "420px", // Typical width of a modern smartphone
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
  gap: "5px", // Adds space between the children
  paddingTop: "50px",
};

export default App;
