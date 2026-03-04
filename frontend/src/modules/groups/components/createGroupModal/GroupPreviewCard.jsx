import { UsersIcon, LockIcon, GlobeIcon } from "lucide-react";
import { useState, useEffect } from "react";

const GroupPreviewCard = ({ formData }) => {
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    // Watch for avatar changes
    if (formData.avatar && formData.avatar instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(formData.avatar);
    } else if (!formData.avatar) {
      setAvatarPreview(null);
    }
  }, [formData.avatar]);

  const isComplete = formData.name && formData.privacy;

  return (
    <div className="hidden lg:flex flex-col gap-4">
      {/* Preview Title */}
      <div className="px-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Preview
        </p>
      </div>

      {/* Main Preview Card */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden">
        {/* Avatar Section */}
        <div className="relative h-32 bg-gradient-to-br from-indigo-500/20 to-slate-800/50 flex items-center justify-center border-b border-slate-700/30">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Group preview"
              className="w-20 h-20 rounded-lg object-cover border-2 border-indigo-500/50"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-indigo-500/20 border-2 border-indigo-500/30 flex items-center justify-center">
              {formData.name ? (
                <span className="text-2xl font-bold text-indigo-400">
                  {formData.name[0].toUpperCase()}
                </span>
              ) : (
                <UsersIcon className="w-8 h-8 text-slate-500" />
              )}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-4 space-y-4">
          {/* Name */}
          <div>
            <p className="text-xs text-slate-400 mb-1">Group Name</p>
            <p className="text-sm font-semibold text-slate-100 line-clamp-2 min-h-6">
              {formData.name || (
                <span className="text-slate-500 italic">Enter group name</span>
              )}
            </p>
          </div>

          {/* Privacy Badge */}
          {formData.privacy && (
            <div>
              <p className="text-xs text-slate-400 mb-1">Privacy</p>
              <div className="flex items-center gap-2">
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    formData.privacy === "public"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-slate-700/50 text-slate-300"
                  }`}
                >
                  {formData.privacy === "public" ? (
                    <>
                      <GlobeIcon className="w-3 h-3" />
                      Public
                    </>
                  ) : (
                    <>
                      <LockIcon className="w-3 h-3" />
                      Private
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <p className="text-xs text-slate-400 mb-1">Description</p>
            <p className="text-xs text-slate-300 line-clamp-3 min-h-12">
              {formData.description || (
                <span className="text-slate-500 italic">
                  Add a description for your group
                </span>
              )}
            </p>
          </div>

          {/* Settings Summary */}
          <div className="pt-3 border-t border-slate-700/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Max Members</span>
              <span className="text-slate-200 font-medium">
                {formData.maxMembers || 50}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Message Retention</span>
              <span className="text-slate-200 font-medium">
                {formData.messageRetention === "30days"
                  ? "30 days"
                  : "Forever"}
              </span>
            </div>

            {formData.privacy === "public" && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Join Policy</span>
                <span className="text-slate-200 font-medium">
                  {formData.joinPolicy === "instant"
                    ? "Instant"
                    : "Approval required"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="px-1">
        {isComplete ? (
          <div className="flex items-center gap-2 text-xs text-green-300">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Ready to create
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-2 h-2 rounded-full bg-slate-600" />
            Fill in basic info to preview
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupPreviewCard;
