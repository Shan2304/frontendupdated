"use client";

import React, { useState } from "react";
import axios from "axios";



// Main Form Component
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
        setMessage("Template sent successfully for signing!");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Header Component
const Header = () => (
  <header className="w-screen h-24 bg-gradient-to-r from-blue-800 to-blue-900 text-white flex justify-between items-center px-16 shadow-lg">
    <div className="flex items-center space-x-4">
      <img
        src="https://imgs.search.brave.com/AVWtO9DxuutQe_AQKUxAcMNzF7rcZnJyGD8GvBdCsNQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kNW51/bnlhZ2NpY2d5LmNs/b3VkZnJvbnQubmV0/L3AvYXNzZXRzL2lt/YWdlcy9ncmFwaGlj/LXR1dG9yaWFsLWJh/c2ljc0AyeF8wOTVh/OWNjYTVjYzBlMzA2/NTJhZjJhNDI3Y2Rm/YzNkOS5wbmc" 
        alt="Company Logo"
        className="w-16 h-16"
      />
      <div>
        <h1 className="text-2xl font-bold">Sky Trade</h1>
        <p className="text-sm">Monetize
        and Trade Air Rights</p>
      </div>
    </div>
    <div className="text-right">
      <h2 className="text-lg font-semibold">Welcome to Our Platform</h2>
      <p className="text-sm">
        Streamline your document signing process with ease and efficiency.
      </p>
    </div>
  </header>
);

// Footer Component
const Footer = () => (
  <footer className="w-screen h-20 bg-gradient-to-r from-blue-800 to-blue-900 text-white flex justify-between items-center px-16 shadow-lg mt-12">
    <div>
      <h1 className="text-lg font-bold">Sky Trade</h1>
      <p className="text-sm">Monetize
      and Trade Air Rights</p>
    </div>
    <div className="text-right">
      <h2 className="text-md font-semibold">Contact Us</h2>
      <p className="text-sm">
        Email: support@company.com <br />
        Phone: +1 (123) 456-7890
      </p>
    </div>
  </footer>
);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow flex justify-center items-center w-full bg-gray-50 py-16">
        <form
          className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl border border-gray-100"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
            Send Template for Signature
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template ID
            </label>
            <input
              type="text"
              placeholder="Enter Template ID"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              required
            />
          </div>

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
            className={`w-full p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Template"}
          </button>

          {message && (
            <p className="text-sm text-center mt-4 text-green-600">{message}</p>
          )}
        </form>
      </main>
      <Footer />
    </div>
  );
}
