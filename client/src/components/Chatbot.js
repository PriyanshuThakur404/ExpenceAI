import React, { useState, useRef, useEffect } from 'react';
import '../styles/Chatbot.css';

const initialMessages = [
  {
    id: 1,
    text: "👋 Hi! I'm your ExpenseAI Assistant. How can I help you manage your finances today?",
    sender: 'bot',
    timestamp: new Date()
  }
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    // Responses for common questions
    const responses = {
      'help': "I can help you with:\n• Tracking expenses\n• Setting budgets\n• Understanding spending patterns\n• Creating savings goals\n• Managing recurring expenses\n\nWhat would you like to know more about?",
      'budget': "To set a budget:\n1. Go to Analytics\n2. Scroll down to Budget Management\n3. Enter your category and amount\n4. Click Save\n\nI'll alert you if you overspend!",
      'expense': "To add an expense:\n1. Click 'Add Expense' on Dashboard\n2. Fill in amount, category, and date\n3. Add a description (optional)\n4. Click Submit\n\nEasy peasy! 💰",
      'category': "Available categories:\n• Food 🍕\n• Transport 🚗\n• Entertainment 🎬\n• Utilities ⚡\n• Health 🏥\n• Shopping 🛍️\n• Other 📌",
      'goal': "To create a savings goal:\n1. Go to Savings Goals\n2. Click 'Add New Goal'\n3. Enter goal name and target amount\n4. Set deadline\n5. Track your progress!\n\nYou can do it! 🎯",
      'export': "To export reports as PDF:\n1. Go to Analytics\n2. Scroll to Export Section\n3. Click 'Export as PDF'\n4. Your report downloads!\n\nShare with anyone! 📄",
      'recurring': "To set recurring expenses:\n1. Go to Recurring Expenses\n2. Click 'Add Recurring Expense'\n3. Set amount, date, and frequency\n4. Choose end date (optional)\n\nAutomatic tracking! 🔄",
      'tips': "💡 Money Management Tips:\n• Review spending weekly\n• Categorize properly\n• Set realistic budgets\n• Track recurring expenses\n• Aim for savings goals\n• Export reports monthly",
      'thank': "You're welcome! 😊 Is there anything else I can help you with?",
      'thanks': "You're welcome! 😊 Is there anything else I can help you with?",
      'hi': "Hello! 👋 How can I assist you today?",
      'hello': "Hello! 👋 How can I assist you today?",
      'default': "That's an interesting question! 🤔\n\nI can help you with:\n• Adding and tracking expenses\n• Setting budgets\n• Creating savings goals\n• Managing recurring expenses\n• Exporting reports\n• Understanding your spending patterns\n\nWhat would you like help with?"
    };

    // Find matching response
    for (const [keyword, response] of Object.entries(responses)) {
      if (message.includes(keyword)) {
        return response;
      }
    }

    return responses.default;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setLoading(false);
    }, 500);
  };

  const handleQuickReply = (text) => {
    const userMessage = {
      id: messages.length + 1,
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(text),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setLoading(false);
    }, 500);
  };

  const handleClearChat = () => {
    setMessages(initialMessages);
    setInput('');
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          className="chatbot-button"
          onClick={() => setIsOpen(true)}
          title="Open Chat Assistant"
          aria-label="Open chat assistant"
        >
          Chat
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>ExpenseAI Assistant</h3>
            <div className="chatbot-header-actions">
              <button
                className="clear-button"
                onClick={handleClearChat}
                type="button"
              >
                Clear
              </button>
              <button
                className="close-button"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message message-${msg.sender}`}>
                <div className="message-content">
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message message-bot">
                <div className="message-content typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="quick-replies">
              <button onClick={() => handleQuickReply('help')}>Help</button>
              <button onClick={() => handleQuickReply('tips')}>Tips</button>
              <button onClick={() => handleQuickReply('budget')}>Budget</button>
              <button onClick={() => handleQuickReply('goal')}>Goals</button>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSendMessage} className="chatbot-input">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
