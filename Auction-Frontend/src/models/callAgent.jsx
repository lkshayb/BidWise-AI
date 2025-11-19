import { useEffect, useState } from "react";

export default function CallAgentModal({ open, onClose }) {
  const [name, setname] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setError("");
    console.log("hello");
    fetch("https://backend.omnidim.io/api/v1/calls/dispatch", {
      method: "POST",
      headers: {
        Authorization: "Bearer YGuz5sr_aV9FtRzNmm8UVx6T5U8yFk4RUQA-4NXCvpM",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_id: 1518,
        to_number: "+91" + phone,
        call_context: {
          customer_name: name,
          account_id: "ACC-12345",
          priority: "high",
        },
      }),
    });
    alert("You will receive a call soon!");
    onClose();
    setPhone("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Enter your phone number
          </h2>
          <input
            type="tel"
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={10}
            required
          />
          <input
            type="tel"
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Name"
            value={name}
            onChange={(e) => setname(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded px-4 py-2 font-semibold"
          >
            Send Call
          </button>
        </form>
      </div>
    </div>
  );
}