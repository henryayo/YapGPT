import './ChatHistory.css';

export default function ChatHistory({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onClearAll,
  isOpen,
  onToggle,
  onOpenSettings,
  hasApiKey,
}) {
  return (
    <>
      <button
        className="chat-history__toggle"
        onClick={onToggle}
        id="toggle-sidebar"
        title="Toggle sidebar"
      >
        ☰
      </button>

      <aside className={`chat-history ${isOpen ? 'chat-history--open' : ''}`}>
        {/* Top actions */}
        <div className="chat-history__top">
          <button
            className="chat-history__nav-btn"
            onClick={onNew}
            id="new-chat-button"
          >
            <span className="chat-history__nav-icon">✏️</span>
            <span>New chat</span>
          </button>
        </div>

        {/* Conversation list */}
        <div className="chat-history__list">
          {conversations.length === 0 ? (
            <div className="chat-history__empty">
              No conversations yet.
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`chat-history__item ${conv.id === activeId ? 'chat-history__item--active' : ''}`}
                onClick={() => onSelect(conv.id)}
              >
                <span className="chat-history__item-title">{conv.title}</span>
                <button
                  className="chat-history__item-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conv.id);
                  }}
                  title="Delete conversation"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="chat-history__footer">
          {conversations.length > 0 && (
            <button
              className="chat-history__nav-btn chat-history__nav-btn--danger"
              onClick={onClearAll}
              id="clear-all-button"
            >
              <span className="chat-history__nav-icon">🗑</span>
              <span>Clear all</span>
            </button>
          )}
          <button
            className="chat-history__nav-btn"
            onClick={onOpenSettings}
          >
            <span className="chat-history__nav-icon">⚙️</span>
            <span>Settings</span>
            {hasApiKey ? (
              <span className="chat-history__status chat-history__status--on" />
            ) : (
              <span className="chat-history__status chat-history__status--off" />
            )}
          </button>
          <div className="chat-history__user">
            <div className="chat-history__user-avatar">H</div>
            <span className="chat-history__user-name">Henry</span>
          </div>
        </div>
      </aside>
    </>
  );
}
