import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-12">Library Management Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link
          to="/books"
          className="flex flex-col items-center justify-center p-6 bg-blue-500 text-white rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-blue-600 text-center"
        >
          <h3 className="text-2xl font-semibold mb-3">Manage Books</h3>
          <p className="text-lg">Add, update, and manage the library books.</p>
        </Link>
        <Link
          to="/members"
          className="flex flex-col items-center justify-center p-6 bg-blue-500 text-white rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-blue-600 text-center"
        >
          <h3 className="text-2xl font-semibold mb-3">Manage Members</h3>
          <p className="text-lg">Manage library members and their details.</p>
        </Link>
        <Link
          to="/borrow"
          className="flex flex-col items-center justify-center p-6 bg-blue-500 text-white rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-blue-600 text-center"
        >
          <h3 className="text-2xl font-semibold mb-3">Borrow Book</h3>
          <p className="text-lg">Allow members to borrow books from the library.</p>
        </Link>
        <Link
          to="/return"
          className="flex flex-col items-center justify-center p-6 bg-blue-500 text-white rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-blue-600 text-center"
        >
          <h3 className="text-2xl font-semibold mb-3">Return Book</h3>
          <p className="text-lg">Allow members to return borrowed books.</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
