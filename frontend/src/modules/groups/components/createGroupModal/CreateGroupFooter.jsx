import { ArrowLeftIcon, ArrowRightIcon, LoaderIcon } from "lucide-react";

const CreateGroupFooter = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onCreate,
  isStepValid,
  isSubmitting,
}) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const canProceed = isStepValid && !isSubmitting;

  return (
    <div className="sticky bottom-0 flex items-center justify-between gap-3 p-4 bg-gradient-to-t from-slate-900 to-slate-900/80 backdrop-blur-sm border-t border-slate-700/30 -mx-6 px-6">
      {/* Left - Back Button */}
      <div>
        {!isFirstStep && (
          <button
            onClick={onBack}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-slate-100 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </button>
        )}
      </div>

      {/* Right - Step Indicator & Next/Create Button */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Step Indicator */}
        <div className="text-xs text-slate-400">
          Step {currentStep + 1}/{totalSteps}
        </div>

        {/* Main Action Button */}
        {isLastStep ? (
          <button
            onClick={onCreate}
            disabled={!canProceed}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all text-sm font-medium ${
              canProceed
                ? "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white active:scale-95"
                : "bg-slate-700 text-slate-400 cursor-not-allowed opacity-50"
            }`}
          >
            {isSubmitting ? (
              <>
                <LoaderIcon className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create Group
              </>
            )}
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={!canProceed}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all text-sm font-medium ${
              canProceed
                ? "bg-indigo-500 hover:bg-indigo-600 text-white active:scale-95"
                : "bg-slate-700 text-slate-400 cursor-not-allowed opacity-50"
            }`}
          >
            Next
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateGroupFooter;
