import React from 'react';
import NewsBlock from './NewsBlock'; // Ensure the path is correct based on your project structure
import NewsSeparator from './NewsSeparator';

const NewsSection = ({ sectionTitle, articles, updateArticleAuthor, updateArticleTitle, updateArticleSummary, setCurrentArticleID,onMainImageUpload }) => {
  return (
    <div style={styles.sectionContainer}>
      {/* Iterate over articles and render a NewsBlock for each */}
      {articles.map((article, index) => (
        <React.Fragment key={article.id}>
          <NewsBlock article={article} updateArticleAuthor={updateArticleAuthor} updateArticleTitle={updateArticleTitle} updateArticleSummary={updateArticleSummary} setCurrentArticleID={setCurrentArticleID} onMainImageUpload={onMainImageUpload} />
          {/* Conditionally render a separator between articles */}
          {index < articles.length - 1 && <NewsSeparator />}
        </React.Fragment>
      ))}
    </div>
  );
};

// Styling adapted for web using a plain object
const styles = {
  sectionContainer: {
    // Additional styling could be added here as needed
  },
  sectionTitle: {
    fontSize: '18px', // Adapt font size for web
    fontWeight: 'bold',
    marginTop: '10px',
    marginBottom: '10px',
    textAlign: 'left',
    color: '#000', // Text color
  },
};

export default NewsSection;
