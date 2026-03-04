import { useEffect, useState } from "react";
import { UploadIcon, AlertCircleIcon } from "lucide-react";
import { Controller } from "react-hook-form";

const BasicInfoStep = ({ form, onValidation }) => {
  const {
    control,
    watch,
    formState: { errors },
    trigger,
  } = form;

  const name = watch("name");
  const description = watch("description");
  const privacy = watch("privacy");
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Real-time validation
  useEffect(() => {
    const validateStep = async () => {
      const isValid = await trigger(["name", "description", "privacy"]);
      onValidation?.(isValid && name && description && privacy);
    };

    const timer = setTimeout(validateStep, 300);
    return () => clearTimeout(timer);
  }, [name, description, privacy, trigger, onValidation]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        form.setValue("avatar", file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    form.setValue("avatar", null);
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture Upload */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">
          Group Picture <span className="text-slate-400 text-xs">(Optional)</span>
        </label>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
            id="avatar-upload"
          />
          <label
            htmlFor="avatar-upload"
            className="flex items-center justify-center w-full h-40 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-slate-800/50 transition-all bg-slate-800/25"
          >
            {avatarPreview ? (
              <div className="relative w-full h-full group">
                <img
                  src={avatarPreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <UploadIcon className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-sm font-medium text-slate-300">
                  Click to upload
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  PNG, JPG up to 5MB
                </span>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Group Name */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-slate-200">
            Group Name <span className="text-red-400">*</span>
          </label>
          <span className="text-xs text-slate-400">
            {name.length}/50
          </span>
        </div>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <>
              <input
                {...field}
                type="text"
                placeholder="e.g., Computer Science Study Circle"
                className={`w-full bg-slate-800/50 border rounded-lg py-2.5 px-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:border-transparent transition-all ${
                  errors.name
                    ? "border-red-500/50 focus:ring-red-500"
                    : "border-slate-700 focus:ring-indigo-500"
                }`}
                maxLength={50}
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircleIcon className="w-3 h-3" />
                  {errors.name.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      {/* Description */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-slate-200">
            Description <span className="text-red-400">*</span>
          </label>
          <span className="text-xs text-slate-400">
            {description.length}/500
          </span>
        </div>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <>
              <textarea
                {...field}
                placeholder="What will this group focus on? e.g., Preparing for exams, discussing algorithms, project collaboration"
                className={`w-full bg-slate-800/50 border rounded-lg py-2.5 px-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:border-transparent transition-all resize-none ${
                  errors.description
                    ? "border-red-500/50 focus:ring-red-500"
                    : "border-slate-700 focus:ring-indigo-500"
                }`}
                rows={4}
                maxLength={500}
              />
              {errors.description && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircleIcon className="w-3 h-3" />
                  {errors.description.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      {/* Privacy Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">
          Group Privacy <span className="text-red-400">*</span>
        </label>
        <Controller
          name="privacy"
          control={control}
          render={({ field }) => (
            <div className="space-y-3">
              {/* Public */}
              <button
                type="button"
                onClick={() => field.onChange("public")}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  field.value === "public"
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="w-5 h-5 rounded-full border-2 border-indigo-500 flex items-center justify-center">
                      {field.value === "public" && (
                        <div className="w-3 h-3 rounded-full bg-indigo-500" />
                      )}
                    </div>
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium text-slate-100 flex items-center gap-2">
                      🌍 Public
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      Anyone logged in can discover and join this group
                    </p>
                  </div>
                </div>
              </button>

              {/* Private */}
              <button
                type="button"
                onClick={() => field.onChange("private")}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  field.value === "private"
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="w-5 h-5 rounded-full border-2 border-indigo-500 flex items-center justify-center">
                      {field.value === "private" && (
                        <div className="w-3 h-3 rounded-full bg-indigo-500" />
                      )}
                    </div>
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium text-slate-100 flex items-center gap-2">
                      🔒 Private
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      Only invited members can see and join this group
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default BasicInfoStep;
