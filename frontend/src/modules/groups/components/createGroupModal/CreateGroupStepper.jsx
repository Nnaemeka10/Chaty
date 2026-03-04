import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useGroupStore } from "../../useGroupStore";
import { createGroupSchema } from "../../schemas/createGroupSchema";
import BasicInfoStep from "./BasicInfoStep";
import AccessSettingsStep from "./AccessSettingsStep";
import AdvancedSettingsStep from "./AdvancedSettingsStep";
import GroupPreviewCard from "./GroupPreviewCard";
import CreateGroupFooter from "./CreateGroupFooter";
import AddMembersModal from "./AddMembersModal";
import toast from "react-hot-toast";

const CreateGroupStepper = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { createGroup } = useGroupStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [isStepValid, setIsStepValid] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [newGroupId, setNewGroupId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(createGroupSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      privacy: "public",
      avatar: null,
      joinPolicy: "instant",
      allowInviteLink: true,
      onlyAdminsCanAddMembers: false,
      messageRetention: "30days",
      maxMembers: 50,
      enableGoals: false,
      groupGoal: "",
      enableScheduling: true,
    },
  });

  const privacy = form.watch("privacy");
  const allFormData = form.watch();

  const steps = [
    { title: "Basic Info", icon: "📝" },
    { title: "Rules & Access", icon: "🔐" },
    { title: "Advanced", icon: "⚙️" },
  ];

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setIsStepValid(false);
    }
  }, [currentStep]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsStepValid(false);
    }
  }, [currentStep, steps.length]);

  const handleCreate = useCallback(async () => {
    setIsSubmitting(true);
    try {
      // Validate entire form
      const isFormValid = await form.trigger();
      if (!isFormValid) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      const formData = form.getValues();

      // Create the group
      const newGroup = await createGroup(
        {
          name: formData.name,
          description: formData.description,
          privacy: formData.privacy,
          avatar: formData.avatar,
          joinPolicy: formData.joinPolicy,
          allowInviteLink: formData.allowInviteLink,
          onlyAdminsCanAddMembers: formData.onlyAdminsCanAddMembers,
          messageRetention: formData.messageRetention,
          maxMembers: formData.maxMembers,
          enableGoals: formData.enableGoals,
          groupGoal: formData.groupGoal,
          enableScheduling: formData.enableScheduling,
        },
        navigate
      );

      setNewGroupId(newGroup._id);
      setShowAddMembers(true);
    } catch (error) {
      console.error("Group creation failed:", error);
      toast.error("Failed to create group. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [form, createGroup, navigate]);

  const handleCloseModal = useCallback(() => {
    form.reset();
    setCurrentStep(0);
    setIsStepValid(false);
    setShowAddMembers(false);
    setNewGroupId(null);
    onClose();
  }, [form, onClose]);

  const handleAddMembersClose = useCallback(() => {
    if (newGroupId) {
      navigate(`/group/${newGroupId}`);
    }
    handleCloseModal();
  }, [newGroupId, navigate, handleCloseModal]);

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={handleCloseModal} />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden flex flex-col create-group-modal-content">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700/30 bg-gradient-to-r from-slate-800 to-slate-900">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">
                Create Study Group
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {steps[currentStep].title} —{" "}
                <span className="text-slate-500">Step {currentStep + 1} of 3</span>
              </p>
            </div>
            <button
              onClick={handleCloseModal}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-slate-800 flex">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 transition-all duration-300 ${
                  index < currentStep
                    ? "bg-indigo-500"
                    : index === currentStep
                      ? "bg-indigo-400"
                      : "bg-slate-700"
                }`}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Left - Form */}
              <div className="lg:col-span-2">
                <div className="step-card">
                  {currentStep === 0 && (
                    <BasicInfoStep
                      form={form}
                      onValidation={setIsStepValid}
                    />
                  )}
                  {currentStep === 1 && (
                    <AccessSettingsStep
                      form={form}
                      privacy={privacy}
                      onValidation={setIsStepValid}
                    />
                  )}
                  {currentStep === 2 && (
                    <AdvancedSettingsStep
                      form={form}
                      onValidation={setIsStepValid}
                    />
                  )}
                </div>
              </div>

              {/* Right - Preview */}
              <div className="hidden lg:flex flex-col">
                <GroupPreviewCard formData={allFormData} />
              </div>
            </div>
          </div>

          {/* Footer */}
          <CreateGroupFooter
            currentStep={currentStep}
            totalSteps={steps.length}
            onBack={handleBack}
            onNext={handleNext}
            onCreate={handleCreate}
            isStepValid={isStepValid}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {/* Add Members Modal */}
      {showAddMembers && newGroupId && (
        <AddMembersModal
          isOpen={showAddMembers}
          onClose={handleAddMembersClose}
          groupId={newGroupId}
        />
      )}
    </>
  );
};

export default CreateGroupStepper;
