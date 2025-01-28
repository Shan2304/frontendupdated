"use client";

import React, { useState } from "react";
import axios from "axios";

export default function Form() {
  const [participants, setParticipants] = useState([
    { role: "SELLER", name: "", email: "", order: 1 },
    { role: "BUYER", name: "", email: "", order: 2 },
  ]);
  const [templateId, setTemplateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleParticipantChange = (index, field, value) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index][field] =
      field === "order" ? parseInt(value, 10) : value;
    setParticipants(updatedParticipants);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validation for duplicate roles
    const hasDuplicates = participants
      .map((p) => p.role)
      .some((v, i, arr) => arr.indexOf(v) !== i);
    if (hasDuplicates) {
      setMessage("Duplicate roles are not allowed.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        templateId,
        participants: participants.map((participant) => ({
          role: participant.role.toUpperCase(),
          name: participant.name.trim(),
          email: participant.email.trim(),
          order: participant.order,
        })),
        test_mode: 1,
      };

      const response = await axios.post("https://backendupdated-m0j3.onrender.com/documents", payload);

      if (response.status === 200) {
        setMessage("Template sent successfully for signing!");
      } else {
        setMessage('Template sent successfully for signing!');
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex flex-col justify-between relative">
      {/* Form Layout */}
      <header className="p-4 bg-white shadow-md text-center z-10">
        <h1 className="text-2xl font-bold text-gray-800">Document Signing Portal</h1>
        <p className="text-sm text-gray-500">Send templates for signing</p>
      </header>

      <main className="flex-grow flex justify-center items-center z-10">
        <form
          className="w-full max-w-md bg-white p-6 rounded-lg shadow-2xl backdrop-blur-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">
            Send Template for Signature
          </h2>

          <input
            type="text"
            placeholder="Template ID"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4 text-gray-800"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            required
          />

          {participants.map((participant, index) => (
            <div key={index} className="flex flex-col gap-2 mb-4">
              <select
                className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                value={participant.role}
                onChange={(e) =>
                  handleParticipantChange(index, "role", e.target.value.toUpperCase())
                }
                disabled={participant.role === "SELLER" || participant.role === "BUYER"} // Optional
              >
                <option value="BUYER">BUYER</option>
                <option value="SELLER">SELLER</option>
              </select>
              <input
                type="text"
                placeholder="Name"
                className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-100 text-gray-800"
                value={participant.name}
                onChange={(e) =>
                  handleParticipantChange(index, "name", e.target.value)
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-100 text-gray-800"
                value={participant.email}
                onChange={(e) =>
                  handleParticipantChange(index, "email", e.target.value)
                }
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className={`w-full p-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105 ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>

          {message && (
            <p className="text-sm text-green-600 mt-4 text-center">{message}</p>
          )}
        </form>
      </main>
    </div>
  );
}
