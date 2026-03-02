const GroupsLoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 animate-pulse"
        >
          {/* Avatar + Name */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-12 h-12 rounded-lg bg-slate-700/50" />
              <div className="flex-1">
                <div className="h-4 bg-slate-700/50 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-700/30 rounded w-1/2" />
              </div>
            </div>
            <div className="w-4 h-4 bg-slate-700/50 rounded" />
          </div>

          {/* Description */}
          <div className="space-y-2 mb-3">
            <div className="h-3 bg-slate-700/50 rounded w-full" />
            <div className="h-3 bg-slate-700/50 rounded w-4/5" />
          </div>

          {/* Metadata */}
          <div className="flex gap-4 mb-4">
            <div className="h-3 bg-slate-700/30 rounded w-12" />
            <div className="h-3 bg-slate-700/30 rounded w-16" />
            <div className="h-3 bg-slate-700/30 rounded w-12" />
          </div>

          {/* Button */}
          <div className="h-8 bg-slate-700/50 rounded w-full" />
        </div>
      ))}
    </div>
  );
};

export default GroupsLoadingSkeleton;
