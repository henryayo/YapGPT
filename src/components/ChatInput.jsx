import { useState, useRef, useEffect } from 'react';
import './ChatInput.css';

export default function ChatInput({ onSend, isLoading }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 160) + 'px';
    }
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-input">
      <div className="chat-input__wrapper">
        <textarea
          ref={textareaRef}
          className="chat-input__textarea"
          placeholder="Type your prompt here..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={1}
          id="prompt-input"
        />
        <span className="chat-input__hint">
          Press Enter to send · Shift+Enter for new line
        </span>
      </div>
      <button
        className="btn btn-primary chat-input__send"
        onClick={handleSubmit}
        disabled={isLoading || !value.trim()}
        title="Send prompt"
        id="send-button"
      >
        ➤
      </button>
    </div>
  );
}
