import React from 'react';
import NewsSection from './NewsSection';
import SectionSeparator from './SectionSeparator';
import { theme } from './theme';

const ArticleList = ({ articles, updateArticleAuthor, updateArticleTitle, updateArticleSummary, setCurrentArticleID, onMainImageUpload }) => {
  if (!articles || articles.length === 0) {
    return (
      <div style={styles.centeredView}>
        <p>Can't connect to server. Please try again later.</p>
      </div>
    );
  }

  const sections = Object.keys(articles);

  return (
    <div style={{ overflowY: 'auto' }}>
      {sections.map((item, index) => (
        <div key={item + index}>
          {index === 0 && <div style={{ height: theme.spacing.medium }} />}

          {item !== "search" && (
            <SectionSeparator
              sectionName={item}
              style={
                index === 0 ? { marginTop: 0 } : { marginTop: `${theme.spacing.large + 5}px` }
              }
            />
          )}

          <NewsSection sectionTitle={item} articles={articles[item]}  updateArticleAuthor={updateArticleAuthor} updateArticleTitle={updateArticleTitle} updateArticleSummary={updateArticleSummary} setCurrentArticleID={setCurrentArticleID} onMainImageUpload={onMainImageUpload} />
          {index === sections.length - 1 && (
            <div style={{ height: theme.spacing.medium }} />
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  centeredView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.medium,
    paddingTop: 0,
  },
};

export default ArticleList;
