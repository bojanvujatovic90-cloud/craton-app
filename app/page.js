"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome to Craton.ai Autonomous Superagent Engine v4.0. How can I assist you today? (Supported languages: EN, DE, FR, ZH, ES, JA, HI, HE)",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [usedModel, setUsedModel] = useState(null);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userQuery = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userQuery }]);
    setLoading(true);

    try {
      const response = await fetch("/api/craton/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userQuery,
          sessionId: "craton-session-v4",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.result },
        ]);
        if (data.usedModel) {
          setUsedModel(data.usedModel);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Engine Error: ${data.error || "Failed to process request."}`,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Network Connection Error: ${err.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.badge}>v4.0 Ultra Multilingual</div>
        <h1 style={styles.title}>Craton.AI Superagent</h1>
        <p style={styles.subtitle}>
          Autonomous Gemini Engine (EN | DE | FR | ZH | ES | JA | HI | HE)
        </p>
      </header>

      <main style={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.messageWrapper,
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                ...styles.messageBubble,
                backgroundColor: msg.role === "user" ? "#2563eb" : "#1e293b",
                color: "#ffffff",
              }}
            >
              <div style={styles.roleLabel}>
                {msg.role === "user" ? "You" : "Craton Superagent"}
              </div>
              <div style={styles.messageContent}>{msg.content}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.messageWrapper, justifyContent: "flex-start" }}>
            <div style={{ ...styles.messageBubble, backgroundColor: "#1e293b" }}>
              <div style={styles.roleLabel}>Craton Engine</div>
              <div style={styles.loadingText}>Processing request...</div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      <footer style={styles.footer}>
        {usedModel && (
          <div style={styles.modelStatus}>
            Active Model: <strong>{usedModel}</strong>
          </div>
        )}
        <form onSubmit={handleSend} style={styles.form}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your goal in English, Deutsch, Français, Español, 中文, 日本語, हिन्दी, עברית..."
            style={styles.input}
            disabled={loading}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Thinking..." : "Send"}
          </button>
        </form>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#0f172a",
    color: "#f8fafc",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  header: {
    padding: "20px",
    borderBottom: "1px solid #334155",
    textAlign: "center",
    backgroundColor: "#1e293b",
  },
  badge: {
    display: "inline-block",
    padding: "4px 12px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  title: {
    margin: "0",
    fontSize: "24px",
    fontWeight: "700",
  },
  subtitle: {
    margin: "4px 0 0 0",
    fontSize: "14px",
    color: "#94a3b8",
  },
  chatWindow: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  messageWrapper: {
    display: "flex",
    width: "100%",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: "14px 18px",
    borderRadius: "12px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  roleLabel: {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#94a3b8",
    marginBottom: "4px",
  },
  messageContent: {
    fontSize: "15px",
    lineHeight: "1.5",
    whiteSpace: "pre-wrap",
  },
  loadingText: {
    fontSize: "14px",
    color: "#38bdf8",
    fontStyle: "italic",
  },
  footer: {
    padding: "16px 20px",
    borderTop: "1px solid #334155",
    backgroundColor: "#1e293b",
  },
  modelStatus: {
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "8px",
    textAlign: "right",
  },
  form: {
    display: "flex",
    gap: "12px",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #475569",
    backgroundColor: "#0f172a",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
  },
  button: {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
};
