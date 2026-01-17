import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

export default function Chat({ closeChat }) {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [researcherIdToSelect, setResearcherIdToSelect] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, selectedChat?.messages?.length]);

  useEffect(() => {
    // Auto-select chat when researcher ID is set and chats are loaded
    if (researcherIdToSelect && chats.length > 0) {
      const chatToSelect = chats.find(
        (chat) => chat.user._id === researcherIdToSelect
      );
      if (chatToSelect) {
        setSelectedChat(chatToSelect);
        setResearcherIdToSelect(null); // Reset after selecting
      }
    }
  }, [researcherIdToSelect, chats]);

  useEffect(() => {
    // Listen for auto-select chat event (from express interest)
    const handleAutoSelectChat = (e) => {
      const researcherId = e.detail?.researcherId;
      if (researcherId) {
        setResearcherIdToSelect(researcherId);
      }
    };
    window.addEventListener("selectChatByResearcher", handleAutoSelectChat);
    return () =>
      window.removeEventListener(
        "selectChatByResearcher",
        handleAutoSelectChat
      );
  }, []);

  useEffect(() => {
    // Filter chats based on search query
    if (!searchQuery.trim()) {
      setFilteredChats(chats);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = chats.filter((chat) =>
        chat.user?.name?.toLowerCase().includes(query)
      );
      setFilteredChats(filtered);
    }
  }, [searchQuery, chats]);

  const fetchMessages = async () => {
    try {
      const res = await API.get("/messages");
      setMessages(res.data);
      groupMessagesIntoChats(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const groupMessagesIntoChats = (messages) => {
    const chatMap = {};
    messages.forEach((msg) => {
      const otherUser = msg.sender._id === user.id ? msg.receiver : msg.sender;
      // Skip if the other user is the logged-in user (don't show self-chats)
      if (otherUser._id === user.id) return;

      const chatId = otherUser._id;
      if (!chatMap[chatId]) {
        chatMap[chatId] = {
          user: otherUser,
          messages: [],
          lastMessage: msg,
          unreadCount: 0,
        };
      }
      chatMap[chatId].messages.push(msg);
      if (msg.createdAt > chatMap[chatId].lastMessage.createdAt) {
        chatMap[chatId].lastMessage = msg;
      }
      // Count unread messages
      if (msg.receiver._id === user.id && !msg.read) {
        chatMap[chatId].unreadCount++;
      }
    });
    const chatList = Object.values(chatMap).sort(
      (a, b) =>
        new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    );
    setChats(chatList);
    setFilteredChats(chatList);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    setLoading(true);
    try {
      const res = await API.post("/messages", {
        receiver: selectedChat.user._id,
        content: newMessage,
      });
      // Update the selected chat's messages locally
      const updatedMessages = [...selectedChat.messages, res.data];
      setSelectedChat({
        ...selectedChat,
        messages: updatedMessages,
        lastMessage: res.data,
      });
      // Update messages list
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const selectChat = (chat) => {
    setSelectedChat(chat);
    // Mark messages as read when chat is opened
    chat.messages.forEach((msg) => {
      if (msg.receiver._id === user.id && !msg.read) {
        API.put(`/messages/${msg._id}/read`)
          .then(() => {
            // Update the message in state to reflect read status
            setMessages((prevMessages) =>
              prevMessages.map((m) =>
                m._id === msg._id ? { ...m, read: true } : m
              )
            );
          })
          .catch((err) => console.error("Error marking as read:", err));
      }
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="whatsapp-modal">
      <div className="whatsapp-container">
        <div className="whatsapp-sidebar">
          <div className="whatsapp-header">
            <div className="whatsapp-header-content">
              <div className="whatsapp-avatar">
                {user?.name && typeof user.name === "string"
                  ? user.name.trim().charAt(0).toUpperCase()
                  : "U"}
              </div>
              <div className="whatsapp-header-info">
                <h4>
                  {user?.name && typeof user.name === "string"
                    ? user.name.trim() || "You"
                    : "You"}
                </h4>
                <span>Online</span>
              </div>
            </div>
            <div className="whatsapp-header-actions">
              <button className="whatsapp-icon-btn">⋯</button>
              <button onClick={closeChat} className="whatsapp-close-btn">
                ✕
              </button>
            </div>
          </div>
          <div className="whatsapp-search">
            <div className="whatsapp-search-input">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="whatsapp-chat-list">
            {filteredChats.length === 0 ? (
              <div className="no-chats">
                <div className="no-chats-icon">💬</div>
                <h4>No conversations yet</h4>
                <p>Start a conversation by expressing interest in projects!</p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.user._id}
                  className={`whatsapp-chat-item ${
                    selectedChat?.user._id === chat.user._id ? "active" : ""
                  }`}
                  onClick={() => selectChat(chat)}
                >
                  <div className="whatsapp-chat-avatar">
                    {chat.user?.name
                      ? chat.user.name.charAt(0).toUpperCase()
                      : "?"}
                  </div>
                  <div className="whatsapp-chat-info">
                    <div className="whatsapp-chat-name">
                      {chat.user?.name || "Unknown"}
                    </div>
                    <div className="whatsapp-chat-last-message">
                      {chat.lastMessage.sender._id === user.id && "You: "}
                      {chat.lastMessage.content.length > 35
                        ? chat.lastMessage.content.substring(0, 35) + "..."
                        : chat.lastMessage.content}
                    </div>
                  </div>
                  <div className="whatsapp-chat-meta">
                    <div className="whatsapp-chat-time">
                      {new Date(chat.lastMessage.createdAt).toLocaleDateString(
                        [],
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className="whatsapp-unread-badge">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="whatsapp-main">
          {selectedChat ? (
            <>
              <div className="whatsapp-chat-header">
                <div className="whatsapp-chat-header-content">
                  <div className="whatsapp-chat-avatar">
                    {selectedChat.user?.name
                      ? selectedChat.user.name.charAt(0).toUpperCase()
                      : "?"}
                  </div>
                  <div className="whatsapp-chat-header-info">
                    <h4>{selectedChat.user?.name || "Unknown"}</h4>
                    <span>Online</span>
                  </div>
                </div>
                <div className="whatsapp-chat-actions">
                  <button className="whatsapp-icon-btn">⋯</button>
                </div>
              </div>
              <div className="whatsapp-messages">
                <div className="whatsapp-messages-container">
                  {selectedChat.messages.map((msg, index) => {
                    const isSent = msg.sender._id === user.id;
                    const currentDate = new Date(msg.createdAt).toDateString();
                    const prevDate =
                      index > 0
                        ? new Date(
                            selectedChat.messages[index - 1].createdAt
                          ).toDateString()
                        : null;

                    const showDateSeparator =
                      index === 0 || currentDate !== prevDate;

                    return (
                      <>
                        {showDateSeparator && (
                          <div className="whatsapp-date-wrapper">
                            <span className="whatsapp-date-separator">
                              {new Date(msg.createdAt).toLocaleDateString([], {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        )}

                        <div
                          className={`whatsapp-message-wrapper ${
                            isSent ? "sent" : "received"
                          }`}
                        >
                          <div
                            className={`whatsapp-message ${
                              isSent ? "sent" : "received"
                            }`}
                          >
                            <div className="whatsapp-message-content">
                              {msg.content}
                            </div>
                            <div className="whatsapp-message-meta">
                              <span className="whatsapp-message-time">
                                {new Date(msg.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                              {isSent && (
                                <span className="whatsapp-message-status">
                                  ✓✓
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <div className="whatsapp-input-area">
                <div className="whatsapp-input-container">
                  <button className="whatsapp-attach-btn">📎</button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                    onKeyPress={handleKeyPress}
                    className="whatsapp-input"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !newMessage.trim()}
                    className="whatsapp-send-btn"
                  >
                    {loading ? "⏳" : "📤"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="whatsapp-no-chat">
              <div className="whatsapp-no-chat-content">
                <div className="whatsapp-no-chat-icon">💬</div>
                <h2>lab2market Chat</h2>
                <p>Click on a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
