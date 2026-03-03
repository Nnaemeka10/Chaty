import { useNavigate } from "react-router";
import { useAuthStore } from "../../auth/useAuthStore";

const ProfilePic = ({ showLabel = false, navigateTo = "/settings" }) => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(navigateTo);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleProfileClick}
        className="relative group"
        title="Go to settings"
      >
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-indigo-500/50 hover:border-indigo-500 transition-all cursor-pointer"
          style={{
            backgroundImage: `url(${authUser?.profilePic || "/avatar.png"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <img
            src={authUser?.profilePic || "/avatar.png"}
            alt={authUser?.username || "User"}
            className="w-full h-full object-cover opacity-0"
          />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <span className="text-white text-xs font-medium">Settings</span>
        </div>
      </button>

      {showLabel && (
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-slate-200">
            {authUser?.username || "User"}
          </p>
          <p className="text-xs text-slate-400">{authUser?.email}</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePic;
