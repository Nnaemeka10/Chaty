import { BookOpenIcon, CalendarIcon, MessageCircleIcon, PhoneIcon, SettingsIcon } from "lucide-react";

const LobbySidebar = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: "chat",
      label: "Chat",
      icon: MessageCircleIcon,
      description: "Group conversations",
    },
    {
      id: "call",
      label: "Call",
      icon: PhoneIcon,
      description: "Video meeting",
    },

    {
      id: "resources",
      label: "Resources",
      icon: BookOpenIcon,
      description: "Shared files and links",
    },

    {
      id: "schedule",
      label: "Schedule",
      icon: CalendarIcon,
      description: "Group events and deadlines",
    },

    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
      description: "Group settings",
    },


  ];

  return (
    <div className="lobby-sidebar w-20 bg-slate-900/50 border-r border-slate-700/50 flex flex-col items-center py-4 gap-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`lobby-tab-button group relative w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
              isActive
                ? "bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
            title={tab.label}
          >
            <Icon className="sm:w-6 sm:h-6 w-4 h-4" />

            {/* Tooltip */}
            <div className="absolute left-20 transform -translate-y-1/2 top-1/2 bg-slate-950 border border-slate-700/50 rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
              <p className="text-xs font-medium text-slate-200">{tab.label}</p>
              <p className="text-xs text-slate-400">{tab.description}</p>
            </div>

            {/* Active indicator */}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default LobbySidebar;
