// import React from "react";
// import './App.css';
// import Sidebar from "./Sidebar.jsx";
// import ChatWindow from "./ChatWindow.jsx";
// import {MyContext} from "./MyContext.jsx";
// import { useState } from 'react';
// import {v1 as uuidv1} from "uuid";
// import Register from "./Register.jsx";

// function App() {
//   const [prompt, setPrompt] = useState("");
//   const [reply, setReply] = useState(null);
//   const [currThreadId, setCurrThreadId] = useState(uuidv1());
//   const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads
//   const [newChat, setNewChat] = useState(true);
//   const [allThreads, setAllThreads] = useState([]);
//   // --- Auth state ---
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem("token") || null);
//   const [showLogin, setShowLogin] = useState(false);
//   const [showRegister, setShowRegister] = useState(false);

//   const providerValues = {
//     prompt, setPrompt,
//     reply, setReply,
//     currThreadId, setCurrThreadId,
//     newChat, setNewChat,
//     prevChats, setPrevChats,
//     allThreads, setAllThreads,
//     // Auth
//     user, setUser,
//     token, setToken,
//     showLogin, setShowLogin,
//     showRegister, setShowRegister
//   }; 

//   return (
//     <div className='app'>
//       <MyContext.Provider value={providerValues}>
//           <Sidebar></Sidebar>
//           <ChatWindow></ChatWindow>
//           {showRegister && <Register />}
//         </MyContext.Provider>
//     </div>
//   )
// }

// export default App
import React from "react";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from 'react';
import { v1 as uuidv1 } from "uuid";
import Register from "./Register.jsx";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  // --- Auth state ---
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    user, setUser,
    token, setToken,
    showLogin, setShowLogin,
    showRegister, setShowRegister
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <MyContext.Provider value={providerValues}>
        <Sidebar />
        <ChatWindow />
        {showRegister && <Register />}
      </MyContext.Provider>
    </div>
  );
}

export default App;