// "use client";
// import { useEffect } from "react";

// export default function AiChatbot() {
//   useEffect(() => {
//     const scriptId = "bdb-chatbot-script";

//     function loadChatbot() {
//       if (document.getElementById(scriptId)) return; // Avoid duplicate script
//       const script = document.createElement("script");
//       script.id = scriptId;
//       script.type = "module";
//       script.src = "https://bdb-frontend-rnjk.onrender.com/embed.min.js";
//       document.body.appendChild(script);
//     }

//     if (document.readyState === "complete") {
//       loadChatbot();
//     } else {
//       window.addEventListener("load", loadChatbot);
//       return () => window.removeEventListener("load", loadChatbot);
//     }
//   }, []);

//   return null;
// }
