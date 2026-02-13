import './ChatMessage.css';

export default function ChatMessage({ role, content, timestamp }) {
  const isUser = role === 'user';
  const time = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`chat-message chat-message--${role}`}>
      <div className="chat-message__avatar">
        {isUser ? 'Y' : 'AI'}
      </div>
      <div>
        <div className="chat-message__bubble">{content}</div>
        <div className="chat-message__time">{time}</div>
      </div>
    </div>
  );
}
