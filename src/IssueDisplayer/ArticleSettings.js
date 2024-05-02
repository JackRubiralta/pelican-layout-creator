import React, { useEffect, useState } from 'react';

const ArticleSettings = ({ article, onUpdate }) => {
  const [settings, setSettings] = useState({
    showImage: false,
    imagePosition: 'top',
    titleSize: 'medium',
    showSummary: false
  });

  useEffect(() => {
    if (article) {
      setSettings({
        showImage: article.image?.show || false,
        imagePosition: article.image?.position || 'top',
        titleSize: article.title?.size || 'medium',
        showSummary: article.summary?.show || false
      });
    }
  }, [article]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newSettings = {
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    };
    setSettings(newSettings);
    if (onUpdate && article) {
      onUpdate({
        ...article,
        image: { ...article.image, show: newSettings.showImage, position: newSettings.imagePosition },
        title: { ...article.title, size: newSettings.titleSize },
        summary: { ...article.summary, show: newSettings.showSummary }
      });
    }
  };

  if (!article) {
    return <p>Loading settings...</p>;
  }

  return (
    <div style={styles.formContainer}>
      <div style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Show Image:</label>
          <input
            name="showImage"
            type="checkbox"
            checked={settings.showImage}
            onChange={handleInputChange}
            style={styles.checkbox}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Image Position:</label>
          <select
            name="imagePosition"
            value={settings.imagePosition}
            onChange={handleInputChange}
            style={styles.select}
          >
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="side">Side</option>
          </select>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Title Size:</label>
          <select
            name="titleSize"
            value={settings.titleSize}
            onChange={handleInputChange}
            style={styles.select}
          >
            <option value="big">Big</option>
            <option value="medium">Medium</option>
            <option value="small">Small</option>
          </select>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Show Summary:</label>
          <input
            name="showSummary"
            type="checkbox"
            checked={settings.showSummary}
            onChange={handleInputChange}
            style={styles.checkbox}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    background: '#f8f9fa',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  inputGroup: {
    marginBottom: '10px',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block'
  },
  select: {
    width: '100%',
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  checkbox: {
    marginLeft: '10px'
  },
};

export default ArticleSettings;
