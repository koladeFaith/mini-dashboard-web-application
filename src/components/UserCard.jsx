import React from "react";

const UserCard = ({ user, isDark, onEdit, onDelete }) => {
  return (
    <div
      className={`p-4 shadow rounded ${
        isDark ? "text-white bg-gray-700" : "bg-white"
      } hover:transform hover:-translate-y-1 hover:shadow-lg`}>
      <h3 className="font-bold text-lg">{user.name}</h3>
      <p className="text-gray-400">{user.email}</p>
      <div className="flex gap-3 mt-3 justify-between">
        <button
          className="bg-blue-500 rounded-lg px-4 py-1 text-white"
          onClick={() => onEdit(user)}>
          Edit
        </button>
        <button
          className="bg-red-600 rounded-lg px-4 py-1 text-white"
          onClick={() => onDelete(user.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserCard;
