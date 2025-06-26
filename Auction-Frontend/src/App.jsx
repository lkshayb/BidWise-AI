import {useEffect, useRef, useState } from 'react'
import './App.css'
import {motion} from 'framer-motion'
import {ProgressBar} from 'react-loader-spinner'

//Header
function Header({loggedIn , setShowCallModal , setShowLoginPrompt}) {
  return (
    <header className="fixed top-0 left-0 w-full z-50  px-8 py-4 flex items-center justify-between shadow-lg bg-white/20 backdrop-blur-xl">
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
            <div className="text-sm text-gray-300 -mt-1">Powered by OmniDimension</div>
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

// Login Prompt Component
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

// Email Form Component
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

// Phone number & name form component
function CallAgentModal({ open, onClose }) {
  const [name,setname] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone)) {
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
        to_number: "+91" + phone,
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
  const [getproduct,setgetproducts] = useState(false);
  const [Products,setProducts] = useState([]);
  const productref = useRef();
  const [bid,setbid] = useState(false);
  const [bidid,setbidid] = useState(0);
  const nameref = useRef();
  const bidref = useRef()
  // get omnidim widget
  useEffect(() => {
    const script = document.createElement('script');
    script.id = 'omnidimension-web-widget';
    script.src = 'https://backend.omnidim.io/web_widget.js?secret_key=8f73fa3f824b7bd2b3c3fc2db8d86ee3';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  setTimeout(() => {
  const iframe = document.querySelector('iframe[src*="omnidimension"]');
  if (iframe) {
    iframe.setAttribute("allow", "microphone; camera");
  }
}, 3000);


  // get product details
  useEffect(() => {
    console.log("request success")
    fetch('https://auction-agent.onrender.com/auctions', {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setgetproducts(true)
        setProducts(data)
          
      })
      .catch(err => console.error('Error:', err));
  },[])

function HandleBid(){
  const [isloading,setisloading] = useState(false)
  function Placebid(){
    
    const username = nameref.current?.value;
    const id = bidid
    const bid_amount = bidref.current?.value
    if(username.length > 0 && bid_amount > 0){
      setisloading(true)
      fetch('https://auction-agent.onrender.com/auctions/bid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        id : id,
      
        bid_amount : bid_amount
      })
    })
      .then(async res => {
        const contentType = res.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          console.log("Response JSON:", data);
        } else {
          const text = await res.text();
          console.log("Response Text:", text);
        }
        setbid(false);
        alert("Bid Place Successfully")
      })
      .catch(err => {
        console.error('Error:', err);
      });
    }else{
      alert("Please enter a valid name or bid amount")
    }
    
  }
  return(
    <div className = {`${bid ? 'flex' : 'hidden'} fixed inset-0 z-50 items-center justify-center bg-black bg-opacity-70`}>
      <div className='py-10 pt-3 pr-3 pl-3 px-7 rounded-lg bg-white flex flex-col gap-3'>
        <div className='flex justify-end'>
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className='h-8 cursor-pointer' onClick={() => setbid(false)} viewBox="0 0 48 48">
            <path fill="black" d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"/>
            <path fill="black" d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"/>
          </svg>
        </div>
        <input ref={nameref} type="text" placeholder='Enter Your Name' className='p-2 rounded-xl border-2'/>
        <input ref={bidref} type="text" placeholder='Enter Bid Amount' className='p-2 rounded-xl border-2'/>
        <button onClick={Placebid} className='bg-black hover:opacity-80 border duration-300 text-white rounded-xl p-2 '>
          {isloading ?" Loading..." : "Place Bid"}
        </button>
      </div>
    </div>
  )
}


function ExpiredproductList({Products}){
  return (
    <div className='flex'>
      {Products.length == 0 ? 
      <ProgressBar
        visible={true}
        height="80"
        width="80"
        barColor="white"
        borderColor='white'
        ariaLabel="progress-bar-loading"
        wrapperStyle={{}}
        wrapperClass=""
        />: null}
      {Products.map((product, index) => (
        <div key={index} className={`${product.time_remaining.seconds >= 0 ? "hidden" : "block"} bg-white/50 backdrop-blur-sm w-[400px] py-7 hover:shadow-2xl px-5 rounded-xl m-2 rounded-xl shadow-md duration-300 text-black`}>
          <div className='mb-3 flex jutify-between gap-3'>
            <div className='flex gap-3'>
              <div className='bg-green-400 min-w-[50px] max-w-[60px] rounded-full flex items-center h-7'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="w-8 h-8 text-gray-700" aria-hidden="true">
                  <circle cx="16" cy="11.368" r="3.368" />
                  <path d="M20.673 24h-9.346c-.83 0-1.502-.672-1.502-1.502v-.987a5.404 5.404 0 0 1 5.403-5.403h1.544a5.404 5.404 0 0 1 5.403 5.403v.987c0 .83-.672 1.502-1.502 1.502z" />
                </svg>
                {product.no_of_bids}
              </div>
            </div>
          </div>
          
          <span className='font-semibold text-xl'>Name</span> 
          <div className='text-gray-800  mb-2'>{product.product_name}</div>
          <span className='font-semibold text-xl'>Description</span> 
          <div className='text-gray-800 mb-2'>{product.description}</div>
          <span className='font-semibold text-xl'>Sold For</span>
          <div className='text-gray-800 mb-2'>₹{product.current_highest_bid}</div>
          
        </div>
      ))} 
    </div>
  )
}

  // Product Card
function ProductList({Products}){
  return (
    <div className='flex flex-wrap justify-center'>
      {Products.length == 0 ? 
      <ProgressBar
        visible={true}
        height="80"
        width="80"
        barColor="white"
        borderColor='white'
        ariaLabel="progress-bar-loading"
        wrapperStyle={{}}
        wrapperClass=""
        />: null}
      {Products.map((product, index) => (
        <div key={index} className={`${product.time_remaining.seconds < 0 ? "hidden" : "block"} hover:shadow-2xl bg-white/50 backdrop-blur-sm w-[400px] py-7  px-5 rounded-xl m-2 rounded-xl shadow-md duration-300 text-black`}>
          <div className='mb-3 flex jutify-between gap-3'>
            <div className='flex gap-3'>
              <div className='bg-green-400 min-w-[50px] max-w-[60px] rounded-full flex items-center h-7'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="w-8 h-8 text-gray-700" aria-hidden="true">
                  <circle cx="16" cy="11.368" r="3.368" />
                  <path d="M20.673 24h-9.346c-.83 0-1.502-.672-1.502-1.502v-.987a5.404 5.404 0 0 1 5.403-5.403h1.544a5.404 5.404 0 0 1 5.403 5.403v.987c0 .83-.672 1.502-1.502 1.502z" />
                </svg>
                {product.no_of_bids}
              </div>
              <div className='bg-blue-400 min-w-[50px]   rounded-full flex items-center h-7 px-2'>
                <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5' viewBox="0 0 32 32">
                  <g data-name="9-Clock">
                    <path d="M18 4.16V2h1a2 2 0 0 0 2-2l-8 .06A.22.22 0 0 1 13 0h-2a2 2 0 0 0 2 2h1v2.16a14 14 0 1 0 4 0zM16 30a12 12 0 1 1 12-12 12 12 0 0 1-12 12z"/>
                    <path d="M17 11h-2v7a1 1 0 0 0 .29.71l4 4 1.41-1.41-3.7-3.71z"/>
                  </g>
                </svg>
                <div className='ml-2'>{product.time_remaining.days} {product.time_remaining.days ? <span>days :</span> : null} {product.time_remaining.hours} {product.time_remaining.hours ? <span>hrs :</span> : null} {product.time_remaining.minutes} min</div>
              </div>
            </div>
            
            <div>
              <div onClick={() => {
                setbid(true);
                setbidid(product.id)
                }} className='bg-gradient-to-br from-purple-500 to-red-500 px-5 text-gray-200  cursor-pointer hover:opacity-80 duration-300 ease-in rounded-full flex items-center h-7 '>
                <span>Bid</span>
              </div>
            </div>
          </div>
          
          <span className='font-semibold text-xl'>Name</span> 
          <div className='text-gray-800  mb-2'>{product.product_name}</div>
          <span className='font-semibold text-xl'>Description</span> 
          <div className='text-gray-800 mb-2'>{product.description}</div>
          <span className='font-semibold text-xl'>Current Highest Bid</span>
          <div className='text-gray-800 mb-2'>₹{product.current_highest_bid}</div>
          
        </div>
      ))} 
    </div>
  )
}
  return (
   
      <div>

      <Header loggedIn = {loggedIn} setShowCallModal = {setShowCallModal} setShowLoginPrompt = {setShowLoginPrompt}/>
      <HandleBid/>
      <LoginPromptModal open={showLoginPrompt} onClose={() => setShowLoginPrompt(false)}
        onLogin={() => {
          setShowLoginPrompt(false);
          setShowEmailModal(true);
        }}
      />
      <EmailLoginModal open={showEmailModal} onClose={() => setShowEmailModal(false)} setLoggedIn={setLoggedIn}/>
      <CallAgentModal open={showCallModal} onClose={() => setShowCallModal(false)}/>

      <div className="flex text-white flex-col items-center justify-center min-h-screen bg-gradient-to-t from-blue-700  to-green-800 pt-20">
        <div className='items-center text-center'>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold  mb-4 text-center">Welcome to Auction Bot</h1>
          </div>
          <div>
            <p className="text-lg text-gray-300 text-center">Discover amazing deals and place bids with your voice. </p>
          </div>
          <div>
            <p className='mb-8 text-gray-400'>Powered By OmniDimension</p>
          </div>
          
        </div>
        
        <div className='align-center flex flex-col justify-center'>
          <button
            onClick={() => document.getElementById('chat-helper-button')?.click()}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-semibold hover:opacity-90 transition mb-4"
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
        </div>
        
        
        <span onClick={() => productref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })} className='mt-32 flex gap-2 hover:opacity-70 duration-300 cursor-pointer animate-bounce'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" stroke='white' width={25} fill='white'>
            <g data-name="18-Arrow Down">
              <path d="M17 23.59V5h-2v18.59l-5.29-5.3-1.42 1.42 7 7a1 1 0 0 0 1.41 0l7-7-1.41-1.41z"/>
            </g>
          </svg>
          <span className='text-xl'>Explore Auctions</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" stroke='white' width={25} fill='white'>
            <g data-name="18-Arrow Down">
              <path d="M17 23.59V5h-2v18.59l-5.29-5.3-1.42 1.42 7 7a1 1 0 0 0 1.41 0l7-7-1.41-1.41z"/>
            </g>
          </svg>
        </span>
      </div>   
      <div ref={productref} className='bg-slate-900 min-h-screen flex text-white flex-col items-center bg-gradient-to-b from-blue-700 to-white-500 pt-[120px]'>
        <h1 className='text-4xl font-bold  mb-24 text-center'>Currently Listed Products</h1>
        <div>
          <ProductList Products={Products}/>
        </div>
        <h1 className='text-4xl font-bold  mb-24 text-center mt-[160px]'>Expired Auctions</h1>
        <div className='mb-[100px]'>
          <ExpiredproductList Products={Products}/>
        </div>
      </div>
      <div className="flex text-white flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-black 
">
        <div className='items-center text-center flex flex-col justify-center'>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold  mb-4 text-center">Future Improvements</h1>
          </div>
          <div className='flex flex-wrap gap-3 justify-center mt-[70px]'>
            <div className='hover:scale-105 w-[400px] py-3 text-xl bg-white/10 backdrop-blur-lg rounded-lg text-center shadow-xl hover:shadow-2xl duration-300'>
              Implement User Authentication   
            </div>
            <div className='hover:scale-105 w-[400px] py-3 text-xl bg-white/10 backdrop-blur-lg rounded-lg text-center shadow-xl hover:shadow-2xl duration-300'>
              Use WebSocket to auto-refresh timers 
            </div>
            <div className='hover:scale-105 w-[400px] py-3 text-xl bg-white/10 backdrop-blur-lg rounded-lg text-center shadow-xl hover:shadow-2xl duration-300'>
              Outbid Alerts through mail/SMS
            </div>
            <div className='hover:scale-105 w-[400px] py-3 text-xl bg-white/10 backdrop-blur-lg rounded-lg text-center shadow-xl hover:shadow-2xl duration-300'>
              Show Bid History with Real-Time Updates
            </div>
          </div>
          

            
        </div>
      </div>   
      

    </div>
   
    
  )
}

export default App
