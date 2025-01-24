import React, { useState, useEffect } from "react";
import api from "../services/api";

const Members = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const response = await api.get("/members");
      setMembers(response.data);
    };
    fetchMembers();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Members</h2>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            {member.name} (ID: {member.id})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Members;
