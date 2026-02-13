import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ChatHistory from './components/ChatHistory';
import LoadingIndicator from './components/LoadingIndicator';
import ErrorBanner from './components/ErrorBanner';
import SettingsModal from './components/SettingsModal';
import { sendPrompt } from './api/openai';

// LocalStorage helpers 
const STORAGE_KEYS = {
  API_KEY: 'yap-gpt-api-key',
  CONVERSATIONS: 'yap-gpt-conversations',
};

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Generate unique ID 
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Create a new empty conversation 
function createConversation() {
  return {
    id: uid(),
    title: 'New Chat',
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

// Suggestion prompts 
const SUGGESTIONS = [
  'Write a poem about coding',
  'Explain React hooks simply',
  'Brainstorm app ideas',
  'Summarize the history of AI',
];

export default function App() {
  // State
  const [conversations, setConversations] = useState(() =>
    loadFromStorage(STORAGE_KEYS.CONVERSATIONS, [])
  );
  const [activeId, setActiveId] = useState(() => {
    const convs = loadFromStorage(STORAGE_KEYS.CONVERSATIONS, []);
    return convs.length > 0 ? convs[0].id : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);

  // Load API key from localStorage on mount, fallback to .env
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.API_KEY);
    if (stored && stored.startsWith('sk-')) {
      setApiKey(stored);
    } else {
      const envKey = import.meta.env.VITE_OPENAI_API_KEY || '';
      if (envKey) {
        setApiKey(envKey);
      } else {
        localStorage.removeItem(STORAGE_KEYS.API_KEY);
      }
    }
  }, []);

  // Active conversation
  const activeConversation = conversations.find((c) => c.id === activeId) || null;
  const messages = activeConversation?.messages || [];

  // Whether we're on the welcome screen (no active convo or empty messages)
  const showWelcome = messages.length === 0 && !isLoading;

  // Persist conversations to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CONVERSATIONS, conversations);
  }, [conversations]);

  // Persist API key (only when explicitly set by user via Settings modal)
  const saveApiKey = useCallback((key) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem(STORAGE_KEYS.API_KEY, key);
    } else {
      localStorage.removeItem(STORAGE_KEYS.API_KEY);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  //  Conversation CRUD 
  const handleNewConversation = useCallback(() => {
    const conv = createConversation();
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
    setError(null);
    setSidebarOpen(false);
  }, []);

  const handleSelectConversation = useCallback((id) => {
    setActiveId(id);
    setError(null);
    setSidebarOpen(false);
  }, []);

  const handleDeleteConversation = useCallback(
    (id) => {
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id);
        if (activeId === id) {
          setActiveId(next.length > 0 ? next[0].id : null);
        }
        return next;
      });
    },
    [activeId]
  );

  const handleClearAll = useCallback(() => {
    setConversations([]);
    setActiveId(null);
    setError(null);
  }, []);

  // Send prompt 
  const handleSend = useCallback(
    async (prompt) => {
      setError(null);

      // If no active conversation, create one
      let currentId = activeId;
      if (!currentId) {
        const conv = createConversation();
        setConversations((prev) => [conv, ...prev]);
        currentId = conv.id;
        setActiveId(conv.id);
      }

      const userMessage = {
        id: uid(),
        role: 'user',
        content: prompt,
        timestamp: Date.now(),
      };

      // Add user message & update title if first message
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== currentId) return c;
          const isFirst = c.messages.length === 0;
          return {
            ...c,
            messages: [...c.messages, userMessage],
            title: isFirst ? prompt.slice(0, 50) + (prompt.length > 50 ? '…' : '') : c.title,
            updatedAt: Date.now(),
          };
        })
      );

      setIsLoading(true);

      try {
        // Messages array for the API
        const conv = conversations.find((c) => c.id === currentId);
        const apiMessages = [
          ...(conv?.messages || []),
          userMessage,
        ];

        const reply = await sendPrompt(apiMessages, apiKey);

        const assistantMessage = {
          id: uid(),
          role: 'assistant',
          content: reply,
          timestamp: Date.now(),
        };

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== currentId) return c;
            return {
              ...c,
              messages: [...c.messages, assistantMessage],
              updatedAt: Date.now(),
            };
          })
        );
      } catch (err) {
        setError(err.message || 'Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [activeId, apiKey, conversations]
  );

  const handleSuggestionClick = (text) => {
    handleSend(text);
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <ChatHistory
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelectConversation}
        onNew={handleNewConversation}
        onDelete={handleDeleteConversation}
        onClearAll={handleClearAll}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        onOpenSettings={() => setShowSettings(true)}
        hasApiKey={!!apiKey}
      />

      {/* Main Chat Area */}
      <main className="chat-main">
        {/* Header — only on mobile or when in conversation */}
        <header className="chat-header">
          <div className="chat-header__center">
            <span className="chat-header__title">YapGPT</span>
          </div>
          <div className="chat-header__actions">
            <button
              className="btn btn-ghost chat-header__settings-btn"
              onClick={() => setShowSettings(true)}
              title="Settings"
              id="settings-button"
            >
              ⚙
            </button>
          </div>
        </header>

        {/* Error Banner */}
        <ErrorBanner message={error} onDismiss={() => setError(null)} />

        {/* Messages or Welcome */}
        {showWelcome ? (
          <div className="chat-welcome">
            <div className="chat-welcome__content">
              <h1 className="chat-welcome__title">What can I help with?</h1>
              <div className="chat-welcome__input-wrapper">
                <ChatInput onSend={handleSend} isLoading={isLoading} />
              </div>
              <div className="chat-welcome__suggestions">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    className="chat-welcome__suggestion"
                    onClick={() => handleSuggestionClick(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {!apiKey && (
                <p className="chat-welcome__hint">
                  Add your OpenAI API key in{' '}
                  <button
                    className="chat-welcome__hint-link"
                    onClick={() => setShowSettings(true)}
                  >
                    Settings
                  </button>{' '}
                  to get started.
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="chat-messages">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  timestamp={msg.timestamp}
                />
              ))}
              {isLoading && <LoadingIndicator />}
              <div ref={messagesEndRef} />
            </div>
            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </>
        )}
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          apiKey={apiKey}
          onSave={saveApiKey}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
