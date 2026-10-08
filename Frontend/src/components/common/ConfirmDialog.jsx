function EmptyState({
  title = "No records found",
  message = "There is no data to display.",
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        ○
      </div>

      <h3>{title}</h3>

      <p>{message}</p>
    </div>
  );
}

export default EmptyState;