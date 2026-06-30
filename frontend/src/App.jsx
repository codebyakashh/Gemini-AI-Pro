import React, { useState, useEffect } from "react";
import axios from "axios";

import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

const API_BASE_URL = "http://localhost:5000/api";

function App() {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  // MOBILE SIDEBAR STATE
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // =========================
  // FETCH CHATS
  // =========================
  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/chats`);
      setSessions(res.data);

      if (res.data.length > 0 && !currentSessionId) {
        setCurrentSessionId(res.data._id);
      }
    } catch (error) {
      console.error("Fetch Error:", error.message);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // =========================
  // CREATE CHAT
  // =========================
  const createNewChat = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/chats/new`);

      setSessions((prev) => [res.data, ...prev]);
      setCurrentSessionId(res.data._id);
      setIsSidebarOpen(false);

      return res.data._id;
    } catch (error) {
      console.error("Create Error:", error.message);
      return null;
    }
  };

  // =========================
  // RENAME
  // =========================
  const renameChat = async (chatId, newTitle) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/chats/${chatId}/rename`, {
        title: newTitle,
      });

      setSessions((prev) =>
        prev.map((chat) => (chat._id === chatId ? res.data : chat))
      );
    } catch (error) {
      console.log("Rename Error:", error);
    }
  };

  // =========================
  // DELETE
  // =========================
  const deleteChat = async (chatId) => {
    try {
      await axios.delete(`${API_BASE_URL}/chats/${chatId}`);
      const updated = sessions.filter((chat) => chat._id !== chatId);
      setSessions(updated);

      if (currentSessionId === chatId) {
        setCurrentSessionId(updated.length ? updated._id : null);
      }
    } catch (error) {
      console.log("Delete Error:", error);
    }
  };

  // =========================
  // SEND MESSAGE
  // =========================
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    setLoading(true);
    let activeSessionId = currentSessionId;

    try {
      if (!activeSessionId) {
        activeSessionId = await createNewChat();
        if (!activeSessionId) return;
      }

      // ❌ Fixed: Removed the accidental "cj" syntax error before await
      const res = await axios.post(
        `${API_BASE_URL}/chats/${activeSessionId}/message`,
        { message: text }
      );

      setSessions((prev) => {
        const exists = prev.some((chat) => chat._id === activeSessionId);

        if (!exists) {
          return [res.data, ...prev];
        }

        return prev.map((chat) =>
          chat._id === activeSessionId ? res.data : chat
        );
      });

      setCurrentSessionId(activeSessionId);
    } catch (error) {
      console.log("Message Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentSession = sessions.find((s) => s._id === currentSessionId);

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans bg-slate-950 text-white">
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <Sidebar
        sessions={sessions}
        setSessions={setSessions}
        fetchSessions={fetchSessions}
        currentSessionId={currentSessionId}
        selectSession={(id) => {
          setCurrentSessionId(id);
          setIsSidebarOpen(false);
        }}
        createNewChat={createNewChat}
        renameChat={renameChat}
        deleteChat={deleteChat}
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      {/* CHAT WINDOW */}
      <div className="flex-1 overflow-hidden w-full">
        <ChatWindow
          currentSession={currentSession}
          onSendMessage={handleSendMessage}
          loading={loading}
          openSidebar={() => setIsSidebarOpen(true)}
        />
      </div>
    </div>
  );
}

export default App;