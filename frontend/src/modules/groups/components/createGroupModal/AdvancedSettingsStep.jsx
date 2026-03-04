import { useEffect, useState } from "react";
import { ChevronDownIcon, AlertCircleIcon } from "lucide-react";
import { Controller } from "react-hook-form";

const AdvancedSettingsStep = ({ form, onValidation }) => {
  const {
    control,
    watch,
    formState: { errors },
    trigger,
  } = form;

  const [isExpanded, setIsExpanded] = useState(false);
  const maxMembers = watch("maxMembers");
  const enableGoals = watch("enableGoals");
  const enableScheduling = watch("enableScheduling");

  useEffect(() => {
    const validateStep = async () => {
      const isValid = await trigger(["maxMembers"]);
      onValidation?.(isValid);
    };

    validateStep();
  }, [maxMembers, trigger, onValidation]);

  return (
    <div className="space-y-4">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 bg-slate-800/30 border border-slate-700 rounded-lg hover:bg-slate-800/50 transition-all flex items-center justify-between"
      >
        <span className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          ⚙️ Advanced Settings <span className="text-xs text-slate-400 font-normal">(Optional)</span>
        </span>
        <ChevronDownIcon
          className={`w-5 h-5 text-slate-400 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="toggle-expand space-y-5 pt-4 pb-2 border-t border-slate-700">
          {/* Message Retention */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-3">
              📨 Message Retention
            </h3>
            <Controller
              name="messageRetention"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700 cursor-pointer hover:bg-slate-800/50 transition-all">
                    <input
                      type="radio"
                      name="messageRetention"
                      value="30days"
                      checked={field.value === "30days"}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-4 h-4 cursor-pointer accent-indigo-500"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-100">
                        Delete messages after 30 days
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Recommended for privacy and storage
                      </p>
                    </div>
                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                      Recommended
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700 cursor-pointer hover:bg-slate-800/50 transition-all">
                    <input
                      type="radio"
                      name="messageRetention"
                      value="forever"
                      checked={field.value === "forever"}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-4 h-4 cursor-pointer accent-indigo-500"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-100">
                        Keep messages forever
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Full message history preserved
                      </p>
                    </div>
                  </label>

                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <AlertCircleIcon className="w-3 h-3" />
                    This can be changed later in group settings
                  </p>
                </div>
              )}
            />
          </div>

          {/* Maximum Members */}
          <div>
            <label className="block text-sm font-semibold text-slate-100 mb-3">
              👥 Maximum Members
            </label>
            <Controller
              name="maxMembers"
              control={control}
              render={({ field }) => (
                <>
                  <div className="flex items-center gap-2">
                    <input
                      {...field}
                      type="number"
                      min={2}
                      max={10000}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 2)}
                      className={`flex-1 bg-slate-800/50 border rounded-lg py-2.5 px-4 text-slate-200 focus:ring-2 focus:border-transparent transition-all ${
                        errors.maxMembers
                          ? "border-red-500/50 focus:ring-red-500"
                          : "border-slate-700 focus:ring-indigo-500"
                      }`}
                    />
                    <span className="text-sm text-slate-400">members</span>
                  </div>
                  {errors.maxMembers && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircleIcon className="w-3 h-3" />
                      {errors.maxMembers.message}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-2">
                    Default is 50. Cannot be reduced below current members later.
                  </p>
                </>
              )}
            />
          </div>

          {/* Study Goals */}
          <div>
            <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700 cursor-pointer hover:bg-slate-800/50 transition-all mb-3">
              <Controller
                name="enableGoals"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-700 border-slate-600 cursor-pointer accent-indigo-500"
                  />
                )}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-100">
                  🎯 Enable group goals & streaks
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Help members stay motivated with shared goals
                </p>
              </div>
            </label>

            {enableGoals && (
              <Controller
                name="groupGoal"
                control={control}
                render={({ field }) => (
                  <div className="toggle-expand">
                    <input
                      {...field}
                      type="text"
                      placeholder="e.g., Complete 3 past questions daily"
                      maxLength={200}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 px-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      {field.value.length}/200
                    </p>
                  </div>
                )}
              />
            )}
          </div>

          {/* Scheduling */}
          <div>
            <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700 cursor-pointer hover:bg-slate-800/50 transition-all">
              <Controller
                name="enableScheduling"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-700 border-slate-600 cursor-pointer accent-indigo-500"
                  />
                )}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-100">
                  📅 Enable study session scheduling
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Members can schedule and join study sessions
                </p>
              </div>
              <span className="text-xs text-indigo-300">
                {enableScheduling ? "Enabled" : "Disabled"}
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-xs text-blue-100">
          ℹ️ <span className="font-medium">Default settings recommended</span> for most study groups. Fine-tune them as your group grows.
        </p>
      </div>
    </div>
  );
};

export default AdvancedSettingsStep;
