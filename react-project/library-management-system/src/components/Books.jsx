import React, { useState, useEffect } from "react";
import api from "../services/api";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await api.get("/books");
      setBooks(response.data);
    };
    fetchBooks();
  }, []);

  const addBook = async (e) => {
    e.preventDefault();
    try {
      await api.post("/books/add", { title, author });
      setMessage(`Book "${title}" added successfully!`);
      setTitle("");
      setAuthor("");
      const response = await api.get("/books");
      setBooks(response.data);
    } catch (err) {
      setMessage("Error adding book.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Manage Books</h2>
      
      <form onSubmit={addBook} className="mb-8 space-y-4">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Author"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Book
        </button>
      </form>
      
      {message && <p className="text-green-500 text-center mb-6">{message}</p>}

      <ul className="space-y-4">
        {books.map((book) => (
          <li
            key={book.title}
            className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white flex justify-between items-center"
          >
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-gray-800">{book.title}</span>
              <span className="text-gray-600">{book.author}</span>
            </div>
            <span
              className={`px-3 py-1 rounded-full ${
                book.availability ? "bg-green-200 text-green-600" : "bg-red-200 text-red-600"
              }`}
            >
              {book.availability ? "Available" : "Borrowed"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Books;
