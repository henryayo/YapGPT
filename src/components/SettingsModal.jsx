import { useState } from 'react';
import './SettingsModal.css';

export default function SettingsModal({ apiKey, onSave, onClose }) {
  const [value, setValue] = useState(apiKey || '');

  const handleSave = () => {
    onSave(value.trim());
    onClose();
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="settings-modal__title">⚙ Settings</h2>
        <p className="settings-modal__description">
          Enter your OpenAI API key to start chatting with AI. You can get one
          from{' '}
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-end)' }}
          >
            platform.openai.com
          </a>
          .
        </p>

        <label className="settings-modal__label" htmlFor="api-key-input">
          API Key
        </label>
        <input
          id="api-key-input"
          className="settings-modal__input"
          type="password"
          placeholder="sk-..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
        />

        <div className="settings-modal__privacy">
          <span className="settings-modal__privacy-icon">🔒</span>
          <span>
            Your API key is stored only in your browser's local storage.
            It is never sent to any server other than OpenAI.
          </span>
        </div>

        <div className="settings-modal__actions">
          <button className="btn btn-ghost" onClick={onClose} id="cancel-settings">
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave} id="save-settings">
            Save Key
          </button>
        </div>
      </div>
    </div>
  );
}
