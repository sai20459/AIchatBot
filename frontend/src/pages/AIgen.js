import Image from "next/image";
import { useRef, useState } from "react";
import bot from "../assets/bot.svg";
import user from "../assets/user.svg";
import send from "../assets/send.svg";

const uniqueId = () =>
  `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export default function AIgen() {
  const [messages, setMessages] = useState([]); // {id, role: "user"|"assistant", content}
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);
  const loaderRef = useRef(null);

  const scrollToBottom = () => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  };

  const startLoader = (el) => {
    el.textContent = "";
    let dots = "";
    loaderRef.current = setInterval(() => {
      dots = dots.length >= 3 ? "" : dots + ".";
      el.textContent = dots;
    }, 300);
  };

  const stopLoader = () => {
    if (loaderRef.current) {
      clearInterval(loaderRef.current);
      loaderRef.current = null;
    }
  };

  const typeText = (el, text, onDone) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        el.innerHTML += text.charAt(i);
        i++;
        scrollToBottom();
      } else {
        clearInterval(interval);
        onDone && onDone();
      }
    }, 20);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt) return;

    setIsTyping(true);

    const userMsg = { id: uniqueId(), role: "user", content: prompt };
    const botMsg = { id: uniqueId(), role: "assistant", content: "" };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
    setTimeout(scrollToBottom, 0);

    // start loader on bot bubble
    setTimeout(() => {
      const botEl = document.getElementById(botMsg.id);
      if (botEl) startLoader(botEl);
    }, 0);
    setIsTyping(true);
    //       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}`, {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "text/plain",
    //           // "Content-Type": "application/json",
    //         },
    //         body: code,
    //       });
    //       const data = await res.json();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      stopLoader();
      const botEl = document.getElementById(botMsg.id);

      if (!res.ok) {
        const msg = "Something went wrong!";
        if (botEl) botEl.textContent = msg;
        else {
          setMessages((prev) =>
            prev.map((m) => (m.id === botMsg.id ? { ...m, content: msg } : m))
          );
        }
        setIsTyping(false);
        return;
      }

      const data = await res.json(); // { bot: "..." }
      const text = (data?.bot ?? "").toString();

      if (botEl) {
        botEl.textContent = "";
        typeText(botEl, text, () => setIsTyping(false));
      } else {
        setMessages((prev) =>
          prev.map((m) => (m.id === botMsg.id ? { ...m, content: text } : m))
        );
        setIsTyping(false);
      }
    } catch (err) {
      stopLoader();
      const botEl = document.getElementById(botMsg.id);
      const msg = "Network error!";
      if (botEl) botEl.textContent = msg;
      else {
        setMessages((prev) =>
          prev.map((m) => (m.id === botMsg.id ? { ...m, content: msg } : m))
        );
      }
      setIsTyping(false);
    }
  };

  return (
    <div
    // className="flex flex-col items-center min-h-screen"
    >
      <div
        // id="chat_container"
        ref={chatRef}
        className="w-full h-[70vh] overflow-y-auto rounded p-3 space-y-3"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`wrapper ${m.role === "assistant" ? "ai" : ""}`}
          >
            <div className="chat flex gap-3 items-start">
              <div className="profile shrink-0 w-8 h-8 rounded-full overflow-hidden border">
                <Image
                  src={m.role === "assistant" ? bot : user}
                  alt={m.role === "assistant" ? "bot" : "user"}
                  width={32}
                  height={32}
                />
              </div>
              <div
                id={m.id}
                className="message whitespace-pre-wrap leading-relaxed"
              >
                {m.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl mt-4 flex gap-2"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded p-2 min-h-[60px]"
          placeholder="Ask something…"
        />
        <button
          type="submit"
          disabled={isTyping}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
        >
          <Image src={send} alt={"send"} width={32} height={32} />
          {isTyping ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}
