import React, { useState } from "react";
import api from "../services/api";

const Borrow = () => {
  const [bookTitle, setBookTitle] = useState("");
  const [memberId, setMemberId] = useState("");
  const [message, setMessage] = useState("");

  const handleBorrow = async (e) => {
    e.preventDefault();
    try {
      await api.post("/books/borrow", { book_title: bookTitle, member_id: memberId });
      setMessage("Book borrowed successfully!");
    } catch (err) {
      setMessage("Error borrowing book.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Borrow a Book</h2>
      <form onSubmit={handleBorrow} className="mb-4">
        <input
          type="text"
          placeholder="Book Title"
          className="p-2 border rounded mr-2"
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Member ID"
          className="p-2 border rounded mr-2"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Borrow Book
        </button>
      </form>
      {message && <p className="text-green-500 mb-4">{message}</p>}
    </div>
  );
};

export default Borrow;
