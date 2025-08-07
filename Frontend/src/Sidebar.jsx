// import React from "react";
// import "./Sidebar.css";
// import { useContext, useEffect } from "react";
// import { MyContext } from "./MyContext.jsx";
// import { v1 as uuidv1 } from "uuid";

// function Sidebar() {
//     const {
//         allThreads, setAllThreads, currThreadId, setNewChat, setPrompt,
//         setReply, setCurrThreadId, setPrevChats, token
//     } = useContext(MyContext);

//     const getAllThreads = async () => {
//         try {
//             const response = await fetch("http://localhost:8080/api/thread", {
//                 headers: {
//                     "Content-Type": "application/json",
//                     ...(token ? { "Authorization": `Bearer ${token}` } : {})
//                 }
//             });
//             const res = await response.json();
//             // Support both array and object response
//             const threads = Array.isArray(res) ? res : res.threads || [];
//             const filteredData = threads.map(thread => ({
//                 threadId: thread.threadId,
//                 title: thread.title
//             }));
//             setAllThreads(filteredData);
//         } catch (err) {
//             console.log(err);
//         }
//     };

//     useEffect(() => {
//         getAllThreads();
//     }, [currThreadId]);

//     const createNewChat = () => {
//         setNewChat(true);
//         setPrompt("");
//         setReply(null);
//         setCurrThreadId(uuidv1());
//         setPrevChats([]);
//     };

//     const changeThread = async (newThreadId) => {
//         setCurrThreadId(newThreadId);
//         try {
//             const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     ...(token ? { "Authorization": `Bearer ${token}` } : {})
//                 }
//             });
//             const res = await response.json();
//             setPrevChats(res);
//             setNewChat(false);
//             setReply(null);
//         } catch (err) {
//             console.log(err);
//         }
//     };

//     const deleteThread = async (threadId) => {
//         try {
//             const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {
//                 method: "DELETE",
//                 headers: {
//                     "Content-Type": "application/json",
//                     ...(token ? { "Authorization": `Bearer ${token}` } : {})
//                 }
//             });
//             await response.json();
//             setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
//             if (threadId === currThreadId) {
//                 createNewChat();
//             }
//         } catch (err) {
//             console.log(err);
//         }
//     };

//     return (
//         <section className="sidebar">
//             <button onClick={createNewChat}>
//                 <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo" />
//                 <span><i className="fa-solid fa-pen-to-square"></i></span>
//             </button>
//             <ul className="history">
//                 {allThreads?.map((thread, idx) => (
//                     <li
//                         key={idx}
//                         onClick={() => changeThread(thread.threadId)}
//                         className={thread.threadId === currThreadId ? "highlighted" : ""}
//                     >
//                         {thread.title}
//                         <i
//                             className="fa-solid fa-trash"
//                             onClick={e => {
//                                 e.stopPropagation();
//                                 deleteThread(thread.threadId);
//                             }}
//                         ></i>
//                     </li>
//                 ))}
//             </ul>
//             <div className="sign">
//                 <p>Made by Nishikant &hearts;</p>
//             </div>
//         </section>
//     )
// }

// export default Sidebar;
import React from "react";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
    const {
        allThreads, setAllThreads, currThreadId, setNewChat, setPrompt,
        setReply, setCurrThreadId, setPrevChats, token
    } = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread", {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                }
            });
            const res = await response.json();
            const threads = Array.isArray(res) ? res : res.threads || [];
            const filteredData = threads.map(thread => ({
                threadId: thread.threadId,
                title: thread.title
            }));
            setAllThreads(filteredData);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`, {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                }
            });
            const res = await response.json();
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                }
            });
            await response.json();
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            if (threadId === currThreadId) {
                createNewChat();
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <section className="w-80 bg-gray-800 text-white flex flex-col h-screen border-r border-gray-700">
            <button
                onClick={createNewChat}
                className="flex items-center gap-2 px-4 py-3 bg-gray-900 hover:bg-gray-700 rounded-md m-4 transition"
            >
                <img src="src/assets/blacklogo.png" alt="gpt logo" className="w-8 h-8" />
                <span>
                    <i className="fa-solid fa-pen-to-square"></i>
                </span>
                <span className="font-semibold">New Chat</span>
            </button>
            <ul className="flex-1 overflow-y-auto px-2">
                {allThreads?.map((thread, idx) => (
                    <li
                        key={idx}
                        onClick={() => changeThread(thread.threadId)}
                        className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer mb-2 transition ${
                            thread.threadId === currThreadId
                                ? "bg-blue-600 text-white"
                                : "bg-gray-700 hover:bg-gray-600"
                        }`}
                    >
                        <span className="truncate">{thread.title}</span>
                        <i
                            className="fa-solid fa-trash ml-2 text-red-400 hover:text-red-600"
                            onClick={e => {
                                e.stopPropagation();
                                deleteThread(thread.threadId);
                            }}
                        ></i>
                    </li>
                ))}
            </ul>
            <div className="p-4 text-center text-xs text-gray-400">
                <p>Made by Nishikant &hearts;</p>
            </div>
        </section>
    );
}

export default Sidebar;