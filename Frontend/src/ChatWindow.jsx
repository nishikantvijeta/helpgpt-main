import React, { useContext, useEffect, useRef, useState } from "react";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import Login from "./Login.jsx";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const {
    prompt, setPrompt,
    reply, setReply,
    currThreadId,
    setPrevChats, setNewChat,
    user, setUser,
    token, setToken,
    showLogin, setShowLogin,
    allThreads, setAllThreads
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [guestHistory, setGuestHistory] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [recording, setRecording] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);

  const recognitionRef = useRef(null);

  // Text-to-speech
  const speak = (text, idx) => {
    if (!audioEnabled || !window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.onend = () => setSpeakingIndex(null);
    setSpeakingIndex(idx);
    window.speechSynthesis.speak(utter);
  };

  // Voice input setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const voiceText = event.results[0][0].transcript;
        setPrompt(voiceText);
      };

      recognitionRef.current.onerror = () => setRecording(false);
      recognitionRef.current.onend = () => setRecording(false);
    }
  }, []);

  const startVoiceInput = () => {
    if (recognitionRef.current && !recording) {
      recognitionRef.current.start();
      setRecording(true);
    }
  };

  // Fetch reply
  const getReply = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setNewChat(false);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ message: prompt, threadId: currThreadId })
    };

    try {
      const response = await fetch("http://localhost:8080/api/chat", options);
      const res = await response.json();
      setReply(res.reply);

      const newMessages = [
        { role: "user", content: prompt },
        { role: "assistant", content: res.reply }
      ];

      if (token) {
        setPrevChats(prev => [...prev, ...newMessages]);
      } else {
        setGuestHistory(prev => [...prev, ...newMessages]);
      }
    } catch (err) {
      console.error("Error fetching reply:", err);
    }

    setLoading(false);
  };

  // Lifecycle setup
  useEffect(() => {
    setPrompt("");
  }, [reply]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken && !token) setToken(savedToken);
  }, [token]);

  useEffect(() => {
    setPrevChats([]);
    setGuestHistory([]);
    setReply("");
  }, [token]);

  useEffect(() => {
    if (token) {
      fetch("http://localhost:8080/api/thread", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setAllThreads(data))
        .catch(() => setAllThreads([]));
    } else {
      setAllThreads([]);
    }
  }, [token]);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    setIsOpen(false);
  };

  return (
    <div className="bg-neutral-900 h-screen w-full flex flex-col justify-between items-center text-center">
      
      {/* Navbar */}
      <div className="w-full flex justify-between items-center px-4 py-3 border-b border-gray-700">
        <span className="text-white font-bold text-xl">
          HelpGPT <i className="fa-solid fa-chevron-down ml-2 text-sm"></i>
        </span>
        <div className="text-gray-400 font-semibold">
          {user ? `Hi, ${user}` : "Welcome, Guest"}
        </div>
        <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <span className="bg-blue-500 h-8 w-8 rounded-full flex items-center justify-center text-white">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-16 right-6 w-48 bg-neutral-800 p-2 rounded-md shadow-lg z-50">
          <div className="text-white px-3 py-2 hover:bg-gray-700 rounded-md cursor-pointer flex items-center gap-2">
            <i className="fa-solid fa-gear"></i> Settings
          </div>
          <div
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="text-white px-3 py-2 hover:bg-gray-700 rounded-md cursor-pointer flex items-center gap-2"
          >
            <i className="fa-solid fa-volume-high"></i> {audioEnabled ? "Disable Audio" : "Enable Audio"}
          </div>
          <div className="text-white px-3 py-2 hover:bg-gray-700 rounded-md cursor-pointer flex items-center gap-2">
            <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan
          </div>
          {user ? (
            <div
              onClick={handleLogout}
              className="text-white px-3 py-2 hover:bg-gray-700 rounded-md cursor-pointer flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i> Log Out
            </div>
          ) : (
            <div
              onClick={() => { setShowLogin(true); setIsOpen(false); }}
              className="text-white px-3 py-2 hover:bg-gray-700 rounded-md cursor-pointer flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-right-to-bracket"></i> Log In
            </div>
          )}
        </div>
      )}

      {/* Login Modal */}
      {showLogin && <Login />}

      {/* Chat Area */}
      <Chat history={token ? undefined : guestHistory} speak={speak} speakingIndex={speakingIndex} />
      <ScaleLoader color="#fff" loading={loading} />

      {/* Input Box */}
      <div className="w-full p-4">
        <div className="relative max-w-3xl mx-auto flex items-center bg-neutral-800 rounded-md px-4 py-2">
          <input
            className="flex-1 border-none outline-none bg-transparent text-white text-base"
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getReply()}
          />

          <div className="flex items-center gap-3 text-gray-400 text-lg">
            <div
              onClick={getReply}
              className="cursor-pointer hover:text-white hover:scale-110 transition w-10 h-10 flex items-center justify-center"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </div>
            <div
              onClick={startVoiceInput}
              className="cursor-pointer hover:text-white hover:scale-110 transition w-10 h-10 flex items-center justify-center"
            >
              <i className={`fa-solid fa-microphone${recording ? '-slash' : ''}`}></i>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-2 text-center">
          HelpGPT can make mistakes. Check important info. See Cookie Preferences.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
