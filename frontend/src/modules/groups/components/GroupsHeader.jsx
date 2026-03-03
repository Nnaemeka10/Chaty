import { PlusIcon } from "lucide-react";
import ProfilePic from "../../users/components/ProfilePic";

const GroupsHeader = ({ onCreateClick }) => {
  return (
    <>
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="Group Study Logo"
            className="w-24 h-24 object-contain"
          />
          <div>
            <h1 className="text-3xl font-semibold text-slate-100">
              We Learn
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Collaborate, organize, and learn together
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
          >
            <PlusIcon className="w-5 h-5" />
            Create Group
          </button>
          <ProfilePic navigateTo="/settings" />
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex md:hidden items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Group Study Logo"
            className="w-16 h-16 object-contain"
          />
          <div>
            <h1 className="text-2xl font-semibold text-slate-100">WELearn</h1>
            <p className="text-slate-400 text-xs mt-0.5">
              Collaborate, organize, and learn
            </p>
          </div>
        </div>
        <ProfilePic navigateTo="/settings" />
      </div>

      {/* Mobile Floating Action Button */}
      <button
        onClick={onCreateClick}
        className="fixed bottom-6 right-6 md:hidden flex items-center justify-center w-14 h-14 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-full shadow-lg hover:shadow-indigo-500/50 transition-all active:scale-90 z-40"
        title="Create Group"
      >
        <PlusIcon className="w-6 h-6" />
      </button>
    </>
  );
};

export default GroupsHeader;
