function PageHeader({
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>

        {description && (
          <p>{description}</p>
        )}
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          className="primary-button"
          onClick={onAction}
        >
          + {actionLabel}
        </button>
      )}
    </div>
  );
}

export default PageHeader;