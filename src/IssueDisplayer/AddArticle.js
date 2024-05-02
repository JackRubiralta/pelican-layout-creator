import React, { useState } from 'react';

const AddArticle = ({ articles, setArticles }) => {
  const [selectedSection, setSelectedSection] = useState('');

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
  };

  const handleAddArticle = () => {
    if (!selectedSection) {
      alert('Please select a section first.');
      return;
    }

    const newArticle = {
      id: `new-${Date.now()}`,
      title: { text: "New Article", size: "medium" },
      summary: { content: "Summary of the new article.", show: false },
      author: "New Author",
      date: new Date().toISOString().slice(0, 10),
      length: 0,
      content: [{ type: 'paragraph', text: "Content of the new article." }],
      image: { source: "", caption: "", show: false, position: "top" }
    };

    const updatedArticles = {
      ...articles,
      [selectedSection]: [...(articles[selectedSection] || []), newArticle]
    };

    setArticles(updatedArticles);
    alert('Article added successfully!');
  };

  return (
    <div style={{ padding: '20px', marginTop: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Add New Article</h2>
      <select value={selectedSection} onChange={handleSectionChange} style={{ padding: '10px', marginBottom: '10px', width: '100%' }}>
        <option value="">Select a Section</option>
        {Object.keys(articles).map(section => (
          <option key={section} value={section}>{section}</option>
        ))}
      </select>
      <button onClick={handleAddArticle} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Add Article
      </button>
    </div>
  );
};

export default AddArticle;
