function EmptyState({
  title = "No records found",
  message = "There is no data to display.",
  description,
  actionLabel,
  onAction
}) {
  const displayMessage = description || message;
  
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        ○
      </div>

      <h3>{title}</h3>

      <p>{displayMessage}</p>
      
      {actionLabel && onAction && (
        <div style={{ marginTop: '16px' }}>
          <button type="button" className="secondary-button" onClick={onAction}>
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}

export default EmptyState;