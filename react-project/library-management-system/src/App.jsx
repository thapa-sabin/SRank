import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Books from "./components/Books";
// Add the missing components for Manage Members, Borrow, and Return
import Members from "./components/Members";
import Borrow from "./components/Borrow";
import Return from "./components/Return";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <Router>
      <Routes>
        {!token ? (
          <Route path="/" element={<Login setToken={setToken} />} />
        ) : (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/members" element={<Members />} />
            <Route path="/borrow" element={<Borrow />} />
            <Route path="/return" element={<Return />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
