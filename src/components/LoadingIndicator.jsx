import './LoadingIndicator.css';

export default function LoadingIndicator() {
  return (
    <div className="loading-indicator">
      <div className="loading-indicator__avatar">AI</div>
      <div className="loading-indicator__dots">
        <span className="loading-indicator__dot" />
        <span className="loading-indicator__dot" />
        <span className="loading-indicator__dot" />
      </div>
    </div>
  );
}
