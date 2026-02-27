export function GroupCard() {
  return (
    <div className="card p-4 hover:shadow-cardHover transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-text-primary">Anatomy 2026</h3>
          <p className="text-sm text-text-secondary line-clamp-2">
            Weekly review + past questions + diagrams.
          </p>
        </div>
        <span className="badge-public">Public</span>
      </div>

      <div className="mt-3 flex gap-3 text-xs text-text-muted">
        <span>👥 84</span>
        <span>📂 12 topics</span>
        <span>🔥 Active</span>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="btn-primary">Open</button>
        <button className="btn-secondary">Details</button>
      </div>
    </div>
  );
}