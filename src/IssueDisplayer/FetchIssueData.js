import React, { useState, useEffect } from "react";
import axios from "axios";
import _ from 'lodash';

const API_BASE_URL = "https://pelican-e5764ce520e2.herokuapp.com/api";
const REPO_NAME = "JackRubiralta/pelican-api";
const BRANCH = "master";
const FetchIssueData = ({ setArticles, articles }) => {
  const [githubToken, setGithubToken] = useState("");
  const [issueNumber, setIssueNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchedData, setFetchedData] = useState(null); // Store fetched data for further processing
  const FILE_PATH = `data/issue${issueNumber}/articles.json`;
  const apiUrl = `https://api.github.com/repos/${REPO_NAME}/contents/${FILE_PATH}`;
  const IMAGE_DIR = 'data/images';
  useEffect(() => {
    // On component mount, try to fetch the token from local storage
    const token = localStorage.getItem("githubToken");
    if (token) {
      setGithubToken(token);
    }
  }, []);
  const handleFetchData = async (e) => {
    e.preventDefault();
    if (!githubToken || !issueNumber) {
      setError("GitHub token and issue number are required");
      return;
    }
    setError("");
    setLoading(true);
    localStorage.setItem("githubToken", githubToken);

    try {
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `token ${githubToken}` },
      });
      const data = response.data;
      if (data.content) {
        let decodedContent = JSON.parse(atob(data.content));

        // Process each section that contains articles
        Object.keys(decodedContent).forEach((section) => {
          decodedContent[section].forEach((article) => {
            // Update the main image source
            if (article.image && article.image.source) {
              article.image.source = `${API_BASE_URL}/images/${article.image.source}`;
            }
            // Update images within article content
            article.content.forEach((item) => {
              if (item.type === "image" && item.source) {
                item.source = `${API_BASE_URL}/images/${item.source}`;
              }
            });
          });
        });

        setArticles(decodedContent);
      }
    } catch (error) {
      setError("Failed to fetch data: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const uploadImageToGitHub = async (file) => {
    try {
      const reader = new FileReader();

      const readFile = (file) => {
        return new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
      };

      const base64Content = await readFile(file);
      const contentWithoutPrefix = base64Content.split(",")[1];
      const randomFilename = `${Date.now()}-${file.name}`;
      const url = `https://api.github.com/repos/${REPO_NAME}/contents/${IMAGE_DIR}/${randomFilename}`;

      const response = await axios.put(
        url,
        {
          message: `Upload image ${randomFilename}`,
          content: contentWithoutPrefix,
          branch: BRANCH,
        },
        {
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (response.status === 201) {
        console.log(
          "Image uploaded successfully:",
          response.data.content.download_url
        );
        return response.data.content.download_url; // Ensure correct URL is returned
      } else {
        throw new Error(`GitHub upload failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
      throw error; // Ensure the error is rethrown for higher-level handling
    }
  };

  const uploadIssueToGitHub = async () => {
    setLoading(true);
    setError("");
    // Helper function to upload images to GitHub and return the URL

    let articlesForUpload =_.cloneDeep(articles);
   
    // Process each article to upload new images and update URLs
    for (let sectionKey in articlesForUpload) {
      for (let article of articlesForUpload[sectionKey]) {
        let imagesToUpload = article.content.filter(
          (item) => item.type === "image" && item.file
        );
        if (article.image && article.image.file) {
          imagesToUpload.push(article.image);
        }
       
        console.log(imagesToUpload)
        for (const item of imagesToUpload) {
       

          const imageUrl = await uploadImageToGitHub(item.file);
          if (item === article.image) {
            article.image.source = imageUrl;
            delete article.image.file; // Clear the file object
          } else {
            const contentItem = article.content.find(
              (content) => content.file === item.file
            );
            contentItem.source = imageUrl;
            delete contentItem.file; // Clear the file object
          }
        }
      }
    }
    Object.keys(articlesForUpload).forEach((section) => {
      articlesForUpload[section].forEach((article) => {
        // Revert the main image source to the original filename
        if (article.image && article.image.source) {
          const imagePathSegments = article.image.source.split("/");
          const originalFilename =
            imagePathSegments[imagePathSegments.length - 1];
          article.image.source = originalFilename;
        }
        // Revert images within article content to their original filenames
        article.content.forEach((item) => {
          if (item.type === "image" && item.source) {
            const imagePathSegments = item.source.split("/");
            const originalFilename =
              imagePathSegments[imagePathSegments.length - 1];
            item.source = originalFilename;
          }
        });
      });
    });

    // Update the issue on GitHub
    const issueUrl = apiUrl;
    try {
      const response = await axios.get(issueUrl, {
        headers: { Authorization: `token ${githubToken}` },
      });
      const sha = response.data.sha;
      function escapeSpecialChars(jsonString) {
        return jsonString.replace(/[\u007F-\uFFFF]/g, function(chr) {
            return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
        });
    }
      // Encode the updated issue data as Base64
      var jsonString = JSON.stringify(articlesForUpload);
      var escapedString = escapeSpecialChars(jsonString);
      var contentBase64 = btoa(unescape(encodeURIComponent(escapedString)));
      // Push updated issue data
      const newResponse = await axios.put(
        apiUrl,
        {
          message: `Update issue ${issueNumber} with new images and article content`,
          content: contentBase64,
          branch: BRANCH,
          sha: sha, // Use the latest sha
        },
        {
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      console.log("Issue updated successfully!");
    } catch (error) {
      setError(`Failed to update issue: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.formContainer}>
      <form onSubmit={handleFetchData} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            GitHub Token:
            <input
              type="text"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder="Enter GitHub token"
              style={styles.select}
            />
          </label>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Issue Number:
            <input
              type="text"
              value={issueNumber}
              onChange={(e) => setIssueNumber(e.target.value)}
              placeholder="Enter issue number"
              style={styles.select}
            />
          </label>
        </div>
        <button type="submit" disabled={loading} style={styles.button}>
          Fetch Data
        </button>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <button onClick={uploadIssueToGitHub} style={styles.button}>
        Upload Data
      </button>
    </div>
  );
};

const styles = {
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    background: "#f8f9fa",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    width: "auto", // Set a specific width
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  inputGroup: {
    marginBottom: "10px",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "5px",
    display: "block",
  },
  select: {
    width: "100%",
    padding: "8px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    background: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 15px",
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default FetchIssueData;
