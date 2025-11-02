import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";

export default function KayanChatbot() {
  const token = localStorage.getItem("accessToken");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "✨ Welcome to KAYAN Jewelry! Are you shopping for yourself or a gift?",
    },
  ]);
  const [step, setStep] = useState(1);
  interface Answers {
    purpose?: string;
    recipient?: string;
    type?: string;
    metal?: string;
    style?: string;
  }
  const [answers, setAnswers] = useState<Answers>({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    processMessage(input.toLowerCase());
    setInput("");
  };

  const processMessage = (msg: string) => {
    setLoading(true);
    setTimeout(() => {
      if (step === 1) {
        setAnswers({ ...answers, purpose: msg });
        setStep(2);
        botReply("Lovely 💝 Who is it for — partner, friend, or family?");
      } else if (step === 2) {
        setAnswers({ ...answers, recipient: msg });
        setStep(3);
        botReply(
          "What jewelry are you interested in? (ring, necklace, bracelet, earrings)"
        );
      } else if (step === 3) {
        setAnswers({ ...answers, type: msg });
        setStep(4);
        botReply("Do you prefer gold, silver, or a mix of both? ✨");
      } else if (step === 4) {
        setAnswers({ ...answers, metal: msg });
        setStep(5);
        botReply(
          "Would you describe your style as classic, modern, or statement?"
        );
      } else if (step === 5) {
        botReply(
          "💎 I think you’ll love our curated " +
            msg +
            " collection! Visit: /shop/" +
            (answers.type || "jewelry")
        );
        setStep(6);
        botReply(
          "if you have more questions, feel free to contact our support team 😊, click restart"
        );
      } else if (msg.includes("restart")) {
        setStep(1);
        setAnswers({});
        botReply(
          "✨ Let’s start fresh! Are you shopping for yourself or a gift?"
        );
      } else {
        botReply(
          "💬 Type 'restart' to begin again or ask about care/custom designs!"
        );
      }
      setLoading(false);
    }, 800);
  };

  const botReply = (text: string) => {
    setMessages((prev) => [...prev, { sender: "bot", text }]);
  };

  return (
    <>
      <motion.div
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 flex items-center justify-center w-14 h-14 rounded-full shadow-lg cursor-pointer text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] z-[9999]"
        whileHover={{ scale: 1.1 }}
      >
        {isOpen ? <X size={26} /> : <MessageCircle size={26} />}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-5 w-80 sm:w-96 h-96 bg-[var(--color-surface)] text-[var(--color-text)] rounded-3xl shadow-2xl flex flex-col border border-[var(--color-border)] z-[9999]"
          >
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] px-3 py-2 rounded-2xl ${
                    msg.sender === "user"
                      ? "ml-auto bg-[var(--color-primary)] text-white"
                      : "mr-auto bg-[var(--color-accent)] text-[var(--color-text)]"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {loading && (
                <div className="text-center text-[var(--color-text-muted)] text-sm">
                  Typing...
                </div>
              )}
            </div>

            <div className="p-2 flex items-center gap-2 border-t border-[var(--color-border)]">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-transparent border border-[var(--color-border)] rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="p-2 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
