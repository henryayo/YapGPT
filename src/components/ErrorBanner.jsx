import './ErrorBanner.css';

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="error-banner" role="alert" id="error-banner">
      <span className="error-banner__icon">⚠️</span>
      <span className="error-banner__message">{message}</span>
      <button
        className="error-banner__dismiss"
        onClick={onDismiss}
        title="Dismiss error"
        id="dismiss-error"
      >
        ✕
      </button>
    </div>
  );
}
