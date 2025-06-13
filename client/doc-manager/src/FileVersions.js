import React, { useState, useEffect } from "react";

import "./FileVersions.css";

function FileVersionsList({ file_versions, onSelect }) {
  return file_versions.map((file_version) => (
    <div
      className="file-version"
      key={file_version.id}
      onClick={() => onSelect(file_version)}
    >
      <h2>File Name: {file_version.file_name}</h2>
      <p>
        ID: {file_version.id} Version: {file_version.version_number}
      </p>
    </div>
  ));
}

function FileVersions() {
  const [data, setData] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);

  const handleViewFile = async (id) => {
      const token = localStorage.getItem("authToken");
      console.log(id);

      try {
        const response = await fetch(`http://localhost:8001/api/file_versions/${id}/download/`, {
          method: 'GET',
          headers: {
            Authorization: `Token ${token}`
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('clicked button!');
        const blob = await response.blob();
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
      } catch (error) {
        console.error('Error fetching the file:', error);
      }
    };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/file_versions/", {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Fetch failed");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        console.error("Fetch error:", err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>File Versions</h1>

      {!selectedVersion ? (
        <FileVersionsList
          file_versions={data}
          onSelect={(version) => setSelectedVersion(version)}
        />
      ) : (
        <div>
          <h2>Selected File</h2>
          <p><strong>Name:</strong> {selectedVersion.file_name}</p>
          <p><strong>Version:</strong> {selectedVersion.version_number}</p>
          <button onClick={() => handleViewFile(selectedVersion.id)}>View File</button>
          <br />
          <button onClick={() => setSelectedVersion(null)}>Back to List</button>
        </div>
      )}
    </div>
  );
}

export default FileVersions;
