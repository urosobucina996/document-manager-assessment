import React, { useState, useEffect } from "react";
import Login from "./Login";
import FileVersions from "./FileVersions";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        {isLoggedIn ? (
          <>
            <button onClick={handleLogout}>Logout</button>
            <FileVersions />
          </>
        ) : (
          <Login onLogin={() => setIsLoggedIn(true)} />
        )}
      </header>
    </div>
  );
}

export default App;
