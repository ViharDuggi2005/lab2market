import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

export default function Chat({ closeChat }) {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiver, setReceiver] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
    fetchUsers();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await API.get("/messages");
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      // Assuming there's an endpoint to get users, or we can derive from projects
      // For now, we'll use a placeholder
      setUsers([]); // Populate with actual users
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !receiver) return;
    setLoading(true);
    try {
      const res = await API.post("/messages", {
        receiver,
        content: newMessage,
      });
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/messages/${id}/read`);
      setMessages(
        messages.map((msg) => (msg._id === id ? { ...msg, read: true } : msg))
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  return (
    <div className="chat-modal">
      <div className="chat-header">
        <h3>Messages</h3>
        <button onClick={closeChat} className="close-btn">
          ×
        </button>
      </div>
      <div className="chat-body">
        <div className="messages-list">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`message ${
                msg.sender._id === user.id ? "sent" : "received"
              }`}
            >
              <strong>{msg.sender.name}:</strong> {msg.content}
              {!msg.read && msg.receiver._id === user.id && (
                <button onClick={() => markAsRead(msg._id)}>
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="send-message">
          <select
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          >
            <option value="">Select Receiver</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage} disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
