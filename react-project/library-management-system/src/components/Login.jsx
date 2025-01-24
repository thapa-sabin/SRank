import React, { useState } from "react";
import api, { setAuthToken } from "../services/api";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/login",
        new URLSearchParams({
          username,
          password,
        })
      );
      const { access_token } = response.data;
      setAuthToken(access_token); 
      setToken(access_token);
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-4xl font-bold mb-6 text-gray-800">Library Login</h2>
      <form onSubmit={handleLogin} className="w-1/3 bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            className="p-3 w-full border rounded-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            className="p-3 w-full border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Login
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
