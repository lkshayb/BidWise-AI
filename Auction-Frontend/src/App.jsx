import { useState , useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#11182a] px-8 py-4 flex items-center justify-between shadow-lg">
      {/* Left: Logo and Title */}
      <div className="flex items-center gap-4">
        {/* Logo Icon */}
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
      {/* Right: Buttons */}
      <div className="flex items-center gap-4">
        {/* Talk to AuctionBot Button */}
        <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:opacity-90 transition">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path d="M12 3v10m0 0a4 4 0 0 0 4-4V7a4 4 0 0 0-8 0v2a4 4 0 0 0 4 4zm0 0v4m-4 0h8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Talk to AuctionBot
        </button>
        {/* Theme Toggle Icon */}
        <button className="p-2 rounded-full hover:bg-[#232b45] transition">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.95 7.07l-.71-.71M4.05 4.93l-.71-.71" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2"/></svg>
        </button>
        {/* Login Button */}
        <button className="flex items-center gap-2 px-5 py-2 rounded-full border border-blue-400 text-blue-400 font-semibold bg-transparent hover:bg-[#232b45] transition">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-8 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Login
        </button>
      </div>
    </header>
  )
}

function App() {
  useEffect(() => {
    const script = document.createElement('script');
    script.id = 'omnidimension-web-widget';
    script.src = 'https://backend.omnidim.io/web_widget.js?secret_key=8f73fa3f824b7bd2b3c3fc2db8d86ee3';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.getElementById('omnidimension-web-widget')?.remove();
    };
  }, []);
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen bg-[#172046] pt-20">
        <h1 className="text-4xl md:text-5xl font-bold text-white mt-12 mb-4 text-center">Active Auctions</h1>
        <p className="text-lg text-gray-300 mb-8 text-center">Discover amazing deals and place bids with your voice</p>
        <button className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-semibold shadow hover:opacity-90 transition mb-2">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path d="M12 3v10m0 0a4 4 0 0 0 4-4V7a4 4 0 0 0-8 0v2a4 4 0 0 0 4 4zm0 0v4m-4 0h8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Speak to AuctionBot
        </button>
        <div className="text-base text-blue-200 mt-1">Click to start voice interaction</div>
      </main>
    </>
  )
}

export default App
