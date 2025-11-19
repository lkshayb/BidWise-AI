import { useEffect, useState } from "react";

export default function EmailLoginModal({ open, onClose, setLoggedIn }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setOtp("");
      setError("");
      setStep(1);
    }
  }, [open]);

  if (!open) return null;

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    fetch("https://auction-agent.onrender.com/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contact: email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response:", data);
        setStep(2);
      })
      .catch((err) => {
        setError("Failed to send OTP. Please try again.");
        console.error("Error:", err);
      });
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid OTP.");
      return;
    }
    setError("");
    fetch("https://auction-agent.onrender.com/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contact: email,
        otp: otp,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLoggedIn(true);
          alert("OTP verified!");
          onClose();
        } else {
          setError(data.message || "Invalid OTP.");
        }
      })
      .catch((err) => {
        setError("Failed to verify OTP. Please try again.");
        console.error("Error:", err);
      });
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
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Enter your email
            </h2>
            <input
              type="email"
              className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded px-4 py-2 font-semibold"
            >
              Send Login Link
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Enter OTP</h2>
            <input
              type="text"
              className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded px-4 py-2 font-semibold"
            >
              Verify
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
