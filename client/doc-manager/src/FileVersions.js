import React, { useState, useEffect } from "react";

import "./FileVersions.css";

function FileVersionsList(props) {
  const file_versions = props.file_versions;
  return file_versions.map((file_version) => (
    <div className="file-version" key={file_version.id}>
      <h2>File Name: {file_version.file_name}</h2>
      <p>
        ID: {file_version.id} Version: {file_version.version_number}
      </p>
    </div>
  ));
}
function FileVersions() {
  const [data, setData] = useState([]);
  console.log(data);

  useEffect(() => {
  const token = localStorage.getItem('authToken'); // get the token stored after login

    if (!token) {
      console.error("No auth token found");
      return;
    }

    const dataFetch = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/file_versions/", {
          method: "GET",
          headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data. Are you authenticated?");
        }

        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching file versions:", error.message);
      }
    };

    dataFetch();
  }, []);
  return (
    <div>
      <h1>Found {data.length} File Versions</h1>
      <div>
        <FileVersionsList file_versions={data} />h
      </div>
    </div>
  );
}

export default FileVersions;
