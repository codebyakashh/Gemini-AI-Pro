import React, { useState } from "react";
import {
  MessageSquare,
  Plus,
  Bot,
  Search,
  BookOpen,
  Folder,
  Grid3X3,
  Pencil,
  Trash2,
  Check,
  X
} from "lucide-react";

const Sidebar = ({
  sessions,
  currentSessionId,
  selectSession,
  createNewChat,
  renameChat,
  deleteChat,
  setSessions,
  fetchSessions, // Destructured this safely
  isOpen,
  closeSidebar
}) => {
  const [editingId, setEditingId] = useState(null);
  const [titleInput, setTitleInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // =========================
  // SEARCH HANDLER
  // =========================
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === "") {
      fetchSessions(); // Backend se fresh list mango jab search empty ho
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/chats/search?query=${value}`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (error) {
      console.log("Search error", error);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    fetchSessions(); // Clear karte hi global original data reload hoga
  };

  // =========================
  // RENAME HANDLER
  // =========================
  const startRename = (chat) => {
    setEditingId(chat._id);
    setTitleInput(chat.title);
  };

  const saveRename = async () => {
    if (!titleInput.trim()) return;

    await renameChat(editingId, titleInput);
    setEditingId(null);
    setTitleInput("");
  };

  const cancelRename = () => {
    setEditingId(null);
    setTitleInput("");
  };

  // =========================
  // DELETE HANDLER
  // =========================
  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this conversation?");
    if (!ok) return;

    await deleteChat(id);
  };

  return (
    <div
      className={`fixed md:relative top-0 left-0 z-50 h-full w-72 bg-[#171717] text-white flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      {/* MOBILE CLOSE */}
      <button
        onClick={closeSidebar}
        className="absolute right-4 top-4 md:hidden text-slate-400 hover:text-white"
      >
        <X size={22} />
      </button>

      <div className="p-4 flex flex-col flex-1 overflow-hidden">
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600">
            <Bot className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-wide bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Gemini AI Pro
          </span>
        </div>

        {/* NEW CHAT */}
        <button
          onClick={createNewChat}
          className="flex items-center gap-3 w-full px-4 py-3 mb-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] transition-all font-medium"
        >
          <Plus size={20} />
          <span>New Chat</span>
        </button>

        {/* SEARCH */}
        <div className="relative flex items-center mb-4">
          <Search className="absolute left-4 text-slate-400" size={16} />
          <input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search chats..."
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
          />
          {searchQuery && (
            <button onClick={clearSearch} className="absolute right-4 text-slate-400 hover:text-white">
              <X size={16} />
            </button>
          )}
        </div>

        {/* MENU */}
        <div className="space-y-1 mb-4">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/60 hover:text-white transition-colors text-sm">
            <BookOpen size={16} />
            Library
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/60 hover:text-white transition-colors text-sm">
            <Folder size={16} />
            Projects
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/60 hover:text-white transition-colors text-sm">
            <Grid3X3 size={16} />
            Apps
          </button>
        </div>

        <div className="border-t border-slate-800 mb-3" />

        {/* CHAT LIST */}
        <div className="flex-1 overflow-y-auto pr-1">
          <p className="text-xs font-semibold text-slate-500 px-2 mb-2 uppercase tracking-wider">
            {searchQuery ? "Search Results" : "Recents"}
          </p>

          {sessions?.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session._id}
                className={`group mb-1 rounded-xl transition-all ${
                  currentSessionId === session._id
                    ? "bg-slate-800 border border-cyan-500/30"
                    : "hover:bg-slate-800/40"
                }`}
              >
                {editingId === session._id ? (
                  <div className="p-2 flex gap-2 items-center">
                    <input
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-cyan-500"
                      autoFocus
                    />
                    <button onClick={saveRename} className="text-green-400 hover:text-green-300">
                      <Check size={16} />
                    </button>
                    <button onClick={cancelRename} className="text-red-400 hover:text-red-300">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => selectSession(session._id)}
                      className="flex gap-3 items-center flex-1 px-4 py-3 text-left text-sm text-slate-300 group-hover:text-white truncate"
                    >
                      <MessageSquare size={16} className="shrink-0 text-slate-400 group-hover:text-cyan-400" />
                      <span className="truncate">{session.title || "New Conversation"}</span>
                    </button>

                    <div className="hidden group-hover:flex gap-2 pr-3 shrink-0">
                      <button onClick={() => startRename(session)} className="text-slate-400 hover:text-cyan-400 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(session._id)} className="text-slate-400 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-slate-600 text-sm mt-6">No chats yet</div>
          )}
        </div>
      </div>

      {/* PROFILE SECTION */}
      <div className="border-t border-slate-800 p-4 bg-[#121212]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm shrink-0">
            AK
          </div>
          <div className="truncate">
            <p className="text-sm font-medium truncate">Akash Chaudhary</p>
            <p className="text-xs text-slate-500 truncate">Pro Developer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;