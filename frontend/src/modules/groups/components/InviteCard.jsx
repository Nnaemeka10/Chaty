import { CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";

const InviteCard = ({ invite, onAccept, onReject }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      await onAccept?.(invite._id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await onReject?.(invite._id);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
      <div className="flex items-start gap-4">
        {/* Group Avatar */}
        <div className="w-16 h-16 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden border border-indigo-500/30">
          {invite.avatar ? (
            <img
              src={invite.avatar}
              alt={invite.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-indigo-400 font-semibold text-xl">
              {invite.name[0].toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex-1">
          {/* Group Info */}
          <div className="mb-2">
            <h3 className="text-base font-semibold text-slate-100 mb-1">
              {invite.name}
            </h3>
            <p className="text-slate-400 text-sm line-clamp-2">
              {invite.description}
            </p>
          </div>

          {/* Inviter Info */}
          <div className="flex items-center gap-1 mb-3">
          
            <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
            {invite.invitedByAvatar ? (
              <img
                src={invite.invitedByAvatar}
                alt={invite.invitedBy}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-indigo-400 font-semibold text-sm">
                {invite.invitedBy[0].toUpperCase()}
              </span>
            )}
            </div>
            <span className="text-xs text-slate-400">
              Invited by <span className="text-slate-300 font-medium">{invite.invitedBy}</span>
            </span>
          </div>

          

          {/* Stats */}
          <div className="text-xs text-slate-500 mb-3">
            {invite.memberCount} members
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <CheckIcon className="w-4 h-4" />
              Accept
            </button>
            <button
              onClick={handleReject}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700 text-slate-300 hover:text-slate-200 rounded-lg text-sm font-medium transition-colors"
            >
              <XIcon className="w-4 h-4" />
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteCard;
