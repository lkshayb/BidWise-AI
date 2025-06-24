import {useEffect, useState } from 'react'
import './App.css'


function Header({loggedIn , setShowCallModal , setShowLoginPrompt}) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#11182a] px-8 py-4 flex items-center justify-between shadow-lg">
      <a href="/">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path d="M12 3v10m0 0a4 4 0 0 0 4-4V7a4 4 0 0 0-8 0v2a4 4 0 0 0 4 4zm0 0v4m-4 0h8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold text-blue-400">Auction</span>
              <span className="text-2xl font-bold text-purple-400">Bot</span>
            </div>
            <div className="text-sm text-gray-300 -mt-1">Voice-Powered Auctions</div>
          </div>
        
        </div>
      </a>
      <div className="flex items-center gap-4">
        <button onClick={() => document.getElementById('chat-helper-button')?.click()} className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:opacity-90 transition">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path d="M12 3v10m0 0a4 4 0 0 0 4-4V7a4 4 0 0 0-8 0v2a4 4 0 0 0 4 4zm0 0v4m-4 0h8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button
          onClick={loggedIn ? () => setShowCallModal(true) : () => setShowLoginPrompt(true)}
          className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow hover:opacity-90 transition"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.08 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.7 2.34a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.74.34 1.53.57 2.34.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </header>
  )
}

function LoginPromptModal({ open, onClose, onLogin }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-2xl p-10 w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-2 right-5 hover:text-gray-400 text-3xl">&times;</button>
        <h2 className="text-xl font-bold text-gray-700 mb-7">You need to login to access this feature</h2>
        <button onClick={onLogin} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded px-4 py-2 font-semibold w-full">Login with mail</button>
      </div>
    </div>
  );
}

function EmailLoginModal({ open, onClose, setLoggedIn }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!open) {
      setEmail('');
      setOtp('');
      setError('');
      setStep(1);
    }
  }, [open]);

  if (!open) return null;

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    fetch('https://auction-agent.onrender.com/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contact: email,
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log('Response:', data);
        setStep(2);
      })
      .catch(err => {
        setError('Failed to send OTP. Please try again.');
        console.error('Error:', err);
      });
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter a valid OTP.');
      return;
    }
    setError('');
    fetch('https://auction-agent.onrender.com/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contact: email,
        otp: otp
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLoggedIn(true);
          alert('OTP verified!');
          onClose();
        } else {
          setError(data.message || 'Invalid OTP.');
        }
      })
      .catch(err => {
        setError('Failed to verify OTP. Please try again.');
        console.error('Error:', err);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Enter your email</h2>
            <input
              type="email"
              className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded px-4 py-2 font-semibold">Send Login Link</button>
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
              onChange={e => setOtp(e.target.value)}
              maxLength={6}
              required
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded px-4 py-2 font-semibold">Verify</button>
          </form>
        )}
      </div>
    </div>
  );
}

function CallAgentModal({ open, onClose }) {
  const [name,setname] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{12}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    setError('');
    // Here you would call your backend to send the call
    console.log("hello")
    fetch('https://backend.omnidim.io/api/v1/calls/dispatch', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YGuz5sr_aV9FtRzNmm8UVx6T5U8yFk4RUQA-4NXCvpM',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        agent_id: 1518,
        to_number: phone,
        call_context : {
          customer_name : name,
          account_id : "ACC-12345",
          priority: "high"
        }
      })
    })
    alert('You will receive a call soon!');
    onClose();
    setPhone('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Enter your phone number</h2>
          <input
            type="tel"
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Phone Number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            maxLength={10}
            required
          />
          <input
            type="tel"
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Name"
            value={name}
            onChange={e => setname(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded px-4 py-2 font-semibold">Send Call</button>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);


  useEffect(() => {
    const script = document.createElement('script');
    script.id = 'omnidimension-web-widget';
    script.src = 'https://backend.omnidim.io/web_widget.js?secret_key=8f73fa3f824b7bd2b3c3fc2db8d86ee3';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <Header loggedIn = {loggedIn} setShowCallModal = {setShowCallModal} setShowLoginPrompt = {setShowLoginPrompt}/>
      <LoginPromptModal open={showLoginPrompt} onClose={() => setShowLoginPrompt(false)}
        onLogin={() => {
          setShowLoginPrompt(false);
          setShowEmailModal(true);
        }}
      />
      <EmailLoginModal open={showEmailModal} onClose={() => setShowEmailModal(false)} setLoggedIn={setLoggedIn}/>
      <CallAgentModal open={showCallModal} onClose={() => setShowCallModal(false)}/>
      <main className="flex text-white flex-col items-center justify-center min-h-screen bg-[#172046] pt-20">
        <h1 className="text-4xl md:text-5xl font-bold  mb-4 text-center">Welcome to Auction Bot</h1>
        <p className="text-lg text-gray-300 text-center">Discover amazing deals and place bids with your voice. </p>
        <p className='mb-8 text-gray-400'>Powered By OmniDimension</p>
        <button
          onClick={() => document.getElementById('chat-helper-button')?.click()}
          className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-semibold hover:opacity-90 transition mb-3"
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path d="M12 3v10m0 0a4 4 0 0 0 4-4V7a4 4 0 0 0-8 0v2a4 4 0 0 0 4 4zm0 0v4m-4 0h8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Speak to AuctionBot
        </button>
        
        <button
          onClick={loggedIn ? () => setShowCallModal(true) : () => setShowLoginPrompt(true)}
          className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white text-lg font-semibold hover:opacity-90 transition "
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.08 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.7 2.34a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.74.34 1.53.57 2.34.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Get a Call from Agent
        </button>
        
      </main>   
    </div>
  )
}

export default App
