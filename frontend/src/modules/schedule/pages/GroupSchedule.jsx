import { CalendarIcon } from "lucide-react";

const GroupSchedule = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center gap-4 text-center px-6">
        <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/20">
          <CalendarIcon className="w-10 h-10 text-cyan-400" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-100">Group Schedule</h2>
        <p className="text-slate-400 max-w-sm">
          Plan and manage your group's meetings and events here.
        </p>
      </div>
    </div>
  );
};

export default GroupSchedule;
