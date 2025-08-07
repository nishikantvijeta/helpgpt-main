// import "./Chat.css";
// import React, { useContext, useState, useEffect } from "react";
// import { MyContext } from "./MyContext";
// import ReactMarkdown from "react-markdown";
// import rehypeHighlight from "rehype-highlight";
// import "highlight.js/styles/github-dark.css";

// function Chat({ history }) {
//     const { newChat, prevChats, reply } = useContext(MyContext);
//     const chats = history || prevChats;

//     const [latestReply, setLatestReply] = useState(null);
//     const [speakingIdx, setSpeakingIdx] = useState(null); // to track which message is speaking

//     useEffect(() => {
//         if (reply === null || typeof reply !== "string") {
//             setLatestReply(null);
//             return;
//         }
//         if (!chats?.length) return;

//         const content = reply.split(" ");
//         let idx = 0;
//         const interval = setInterval(() => {
//             setLatestReply(content.slice(0, idx + 1).join(" "));
//             idx++;
//             if (idx >= content.length) clearInterval(interval);
//         }, 40);

//         return () => clearInterval(interval);
//     }, [chats, reply]);

//     const speak = (text, idx) => {
//         const utterance = new SpeechSynthesisUtterance(text);
//         speechSynthesis.cancel(); // stop any existing speech
//         speechSynthesis.speak(utterance);
//         setSpeakingIdx(idx);

//         utterance.onend = () => setSpeakingIdx(null);
//     };

//     const stopSpeaking = () => {
//         speechSynthesis.cancel();
//         setSpeakingIdx(null);
//     };

//     return (
//         <>
//             {newChat && <h1>Start a New Chat!</h1>}
//             <div className="chats">
//                 {
//                     chats?.slice(0, -1).map((chat, idx) =>
//                         <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
//                             {
//                                 chat.role === "user" ? (
//                                     <p className="userMessage">{chat.content}</p>
//                                 ) : (
//                                     <>
//                                         <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
//                                             {chat.content}
//                                         </ReactMarkdown>
//                                         <div className="audioIcon" onClick={() => {
//                                             if (speakingIdx === idx) stopSpeaking();
//                                             else speak(chat.content, idx);
//                                         }}>
//                                             {speakingIdx === idx ? "🔇" : "🔊"}
//                                         </div>
//                                     </>
//                                 )
//                             }
//                         </div>
//                     )
//                 }

//                 {
//                     chats.length > 0 && (
//                         latestReply === null ? (
//                             <div className="gptDiv" key={"non-typing"}>
//                                 <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
//                                     {chats[chats.length - 1].content}
//                                 </ReactMarkdown>
//                                 <div className="audioIcon" onClick={() => {
//                                     if (speakingIdx === chats.length - 1) stopSpeaking();
//                                     else speak(chats[chats.length - 1].content, chats.length - 1);
//                                 }}>
//                                     {speakingIdx === chats.length - 1 ? "🔇" : "🔊"}
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="gptDiv" key={"typing"}>
//                                 <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
//                                     {latestReply}
//                                 </ReactMarkdown>
//                                 <div className="audioIcon" onClick={() => {
//                                     if (speakingIdx === chats.length - 1) stopSpeaking();
//                                     else speak(latestReply, chats.length - 1);
//                                 }}>
//                                     {speakingIdx === chats.length - 1 ? "🔇" : "🔊"}
//                                 </div>
//                             </div>
//                         )
//                     )
//                 }
//             </div>
//         </>
//     );
// }

// export default Chat;
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat({ history }) {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const chats = history || prevChats;

  const [latestReply, setLatestReply] = useState(null);
  const [speakingIdx, setSpeakingIdx] = useState(null);

  useEffect(() => {
    if (reply === null || typeof reply !== "string") {
      setLatestReply(null);
      return;
    }
    if (!chats?.length) return;

    const content = reply.split(" ");
    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));
      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [chats, reply]);

  const speak = (text, idx) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
    setSpeakingIdx(idx);

    utterance.onend = () => setSpeakingIdx(null);
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setSpeakingIdx(null);
  };

  return (
    <>
      {newChat && (
        <h1 className="text-center text-xl font-semibold my-4 text-gray-200">
          Start a New Chat!
        </h1>
      )}

      <div className="flex flex-col space-y-4 px-4 max-w-4xl mx-auto h-[calc(100vh-6rem)] overflow-y-auto">
        {chats?.slice(0, -1).map((chat, idx) => (
          <div
            key={idx}
            className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-lg p-4 break-words overflow-x-auto max-w-full ${
                chat.role === "user"
                  ? "bg-blue-600 text-white max-w-xs"
                  : "bg-gray-800 text-gray-100 max-w-3xl"
              }`}
            >
              {chat.role === "user" ? (
                <p>{chat.content}</p>
              ) : (
                <>
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {chat.content}
                  </ReactMarkdown>
                  <div
                    className="mt-2 cursor-pointer select-none text-xl"
                    onClick={() => {
                      if (speakingIdx === idx) stopSpeaking();
                      else speak(chat.content, idx);
                    }}
                  >
                    {speakingIdx === idx ? "🔇" : "🔊"}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {chats.length > 0 && (
          <>
            {latestReply === null ? (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-100 max-w-3xl rounded-lg p-4 break-words overflow-x-auto">
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {chats[chats.length - 1].content}
                  </ReactMarkdown>
                  <div
                    className="mt-2 cursor-pointer select-none text-xl"
                    onClick={() => {
                      if (speakingIdx === chats.length - 1) stopSpeaking();
                      else speak(chats[chats.length - 1].content, chats.length - 1);
                    }}
                  >
                    {speakingIdx === chats.length - 1 ? "🔇" : "🔊"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-100 max-w-3xl rounded-lg p-4 break-words overflow-x-auto">
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {latestReply}
                  </ReactMarkdown>
                  <div
                    className="mt-2 cursor-pointer select-none text-xl"
                    onClick={() => {
                      if (speakingIdx === chats.length - 1) stopSpeaking();
                      else speak(latestReply, chats.length - 1);
                    }}
                  >
                    {speakingIdx === chats.length - 1 ? "🔇" : "🔊"}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Chat; 