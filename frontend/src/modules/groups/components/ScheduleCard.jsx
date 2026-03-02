

import { Clock, Users, Calendar } from "lucide-react";

const ScheduleCard = ({ schedule }) => {
  if (!schedule) return null;

  const formatDate = (date) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return new Date(date).toLocaleString("en-US", {
      timeZone: timezone,
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:shadow-lg hover:shadow-indigo-500/10 transition-all">
      <div className="flex items-start gap-4">
        {/* Event Avatar */}
        <div className="w-16 h-16 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden border border-indigo-500/30">
          {schedule.avatar ? (
            <img
              src={schedule.avatar}
              alt={schedule.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-indigo-400 font-semibold text-xl">
              {schedule.name[0].toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex-1">
          {/* Title & Description */}
          <div className="mb-2">
            <h3 className="text-base font-semibold text-slate-100 mb-1">
              {schedule.name}
            </h3>
            <p className="text-slate-400 text-sm line-clamp-2">
              {schedule.description}
            </p>
          </div>

          {/* Schedule Details */}
          <div className="flex flex-wrap gap-4 text-xs text-slate-400 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(schedule.scheduledTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{schedule.duration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{schedule.attendeesCount} attending</span>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;