import React, { useMemo, useState } from 'react';

const QUICK_ACTIONS = [
  'Show fraud summary',
  'Recent high-risk transactions',
  'How to tune threshold?',
];

const BOT_RESPONSES = {
  'Show fraud summary': 'Today: 38 fraud events detected, 112 transactions flagged for review, model accuracy at 99.3%.',
  'Recent high-risk transactions': 'Top 3 high-risk IDs: TXN-9182, TXN-9178, TXN-9166. Check Transactions tab for full details.',
  'How to tune threshold?': 'Open Settings and adjust default fraud threshold. Recommended production range is 60-70 based on risk appetite.',
};

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Hi, I am UPI Guard Assistant. Ask about fraud alerts, transactions, or model health.',
    },
  ]);

  const onlineLabel = useMemo(() => 'Assistant Online', []);

  const handleAction = (action) => {
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: action },
      { role: 'bot', text: BOT_RESPONSES[action] || 'I can help with fraud metrics, alerts, and model status.' },
    ]);
  };

  return (
    <div className="db-chatbot">
      {isOpen && (
        <section className="db-chatbot__panel" aria-label="UPI Guard chatbot panel">
          <header className="db-chatbot__header">
            <div>
              <div className="db-chatbot__title">UPI Guard Assistant</div>
              <div className="db-chatbot__status">{onlineLabel}</div>
            </div>
            <button
              type="button"
              className="db-chatbot__icon-btn"
              aria-label="Close chatbot"
              onClick={() => setIsOpen(false)}
            >
              x
            </button>
          </header>

          <div className="db-chatbot__messages">
            {messages.map((message, idx) => (
              <div key={`${message.role}-${idx}`} className={`db-chatbot__msg db-chatbot__msg--${message.role}`}>
                {message.text}
              </div>
            ))}
          </div>

          <div className="db-chatbot__actions">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action}
                type="button"
                className="db-chatbot__chip"
                onClick={() => handleAction(action)}
              >
                {action}
              </button>
            ))}
          </div>
        </section>
      )}

      <button
        type="button"
        className="db-chatbot__fab"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open chatbot"
      >
        <span className="db-chatbot__fab-icon" aria-hidden="true">AI</span>
        <span className="db-chatbot__fab-text">{isOpen ? 'Close Chat' : 'AI Assistant'}</span>
      </button>
    </div>
  );
};

export default ChatbotWidget;
