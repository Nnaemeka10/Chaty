import { useEffect } from "react";
import { ShieldIcon, LinkIcon, UserCheckIcon, AlertCircleIcon } from "lucide-react";
import { Controller } from "react-hook-form";

const AccessSettingsStep = ({ form, privacy, onValidation }) => {
  const {
    control,
    watch,
    trigger,
  } = form;

  const joinPolicy = watch("joinPolicy");
  const allowInviteLink = watch("allowInviteLink");
  const onlyAdminsCanAddMembers = watch("onlyAdminsCanAddMembers");

  useEffect(() => {
    const validateStep = async () => {
      const isValid = await trigger(privacy === "public" ? ["joinPolicy"] : []);
      onValidation?.(isValid);
    };

    validateStep();
  }, [joinPolicy, allowInviteLink, onlyAdminsCanAddMembers, trigger, onValidation, privacy]);

  return (
    <div className="space-y-6">
      {/* Join Policy Section */}
      {privacy === "public" && (
        <div>
          <h3 className="text-sm font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <UserCheckIcon className="w-4 h-4 text-indigo-400" />
            Join Policy
          </h3>

          <div className="space-y-3">
            <Controller
              name="joinPolicy"
              control={control}
              render={({ field }) => (
                <>
                  {/* Instant Join */}
                  <button
                    type="button"
                    onClick={() => field.onChange("instant")}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      field.value === "instant"
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded border-2 border-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {field.value === "instant" && (
                          <div className="w-2.5 h-2.5 rounded bg-indigo-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-100 mb-0.5">
                          ✅ Anyone can join instantly
                        </p>
                        <p className="text-sm text-slate-400">
                          Members are added immediately without approval
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Approval Required */}
                  <button
                    type="button"
                    onClick={() => field.onChange("approval")}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      field.value === "approval"
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded border-2 border-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {field.value === "approval" && (
                          <div className="w-2.5 h-2.5 rounded bg-indigo-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-100 mb-0.5">
                          🔔 Admins must approve join requests
                        </p>
                        <p className="text-sm text-slate-400">
                          Members must request and wait for admin approval
                        </p>
                      </div>
                    </div>
                  </button>
                </>
              )}
            />
          </div>
        </div>
      )}

      {/* Invite Options - Show for Private Groups */}
      {privacy === "private" && (
        <div>
          <h3 className="text-sm font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-indigo-400" />
            Invite Options
          </h3>

          <div className="space-y-4">
            <Controller
              name="allowInviteLink"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700 cursor-pointer hover:bg-slate-800/50 transition-all">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-700 border-slate-600 cursor-pointer accent-indigo-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-100">
                      Allow invite links
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Members can share a link to invite others
                    </p>
                  </div>
                </label>
              )}
            />

            <Controller
              name="onlyAdminsCanAddMembers"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700 cursor-pointer hover:bg-slate-800/50 transition-all">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-700 border-slate-600 cursor-pointer accent-indigo-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-100">
                      Only admins can add members
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Regular members cannot invite other users
                    </p>
                  </div>
                </label>
              )}
            />
          </div>
        </div>
      )}

      {/* Roles Info */}
      <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
        <h3 className="text-sm font-semibold text-indigo-200 mb-2 flex items-center gap-2">
          <ShieldIcon className="w-4 h-4" />
          Group Roles
        </h3>
        <ul className="space-y-2 text-sm text-indigo-100">
          <li className="flex gap-2">
            <span className="font-medium">Admin:</span>
            <span>Full control over group settings and members</span>
          </li>
          <li className="flex gap-2">
            <span className="font-medium">Anchor:</span>
            <span>Can start and lead study sessions</span>
          </li>
          <li className="flex gap-2">
            <span className="font-medium">Member:</span>
            <span>Can participate in discussions and sessions</span>
          </li>
        </ul>
        <p className="text-xs text-indigo-300/70 mt-3">
          💡 You'll be the initial admin. You can assign roles to other members later.
        </p>
      </div>
    </div>
  );
};

export default AccessSettingsStep;
