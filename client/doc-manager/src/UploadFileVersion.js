import React, { useState } from "react";

function UploadFileVersion() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [versionNumber, setVersionNumber] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("authToken");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("You must be logged in.");
      return;
    }

    if (!versionNumber) {
        setMessage("Please enter a version number.");
        return;
    }

    if (!fileUrl) {
        setMessage("Please enter file destionation.");
        return;
    }

    let formData;

    if (file) {
      formData = new FormData();
      formData.append("file", file);
      formData.append("file_name", file.name);
      formData.append("version_number", versionNumber);
      formData.append("file_url", fileUrl);
    } else {
      setMessage("Please provide a file or a file URL.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8001/api/file_versions/", {
        method: "POST",
        headers: file
          ? {
              Authorization: `Token ${token}`,
            }
          : {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed.");
      }

      setMessage("File uploaded successfully!");
      setFile(null);
      setFileUrl("");
      setVersionNumber("");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Upload File Version</h2>
      <form onSubmit={handleSubmit}>
        <label>Version Number:</label>
        <input
          type="number"
          value={versionNumber}
          onChange={(e) => setVersionNumber(e.target.value)}
          required
        />
        <br />

        <label>Upload Local File:</label>
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />
        <br />

        <label>Destination of file:</label>
        <input
          type="text"
          value={fileUrl}
          placeholder="/documents/files/"
          onChange={(e) => {
            setFileUrl(e.target.value);
          }}
        />
        <br />

        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UploadFileVersion;