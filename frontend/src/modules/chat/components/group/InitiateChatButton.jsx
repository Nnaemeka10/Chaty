import { MessageIcon } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useNavigate } from "react-router";

const InitiateChatButton = ({ member, groupId }) => {
  const { initiateGroupChatWithUser } = useChatStore();
  const navigate = useNavigate();

  const handleInitiateChat = (e) => {
    e.stopPropagation();
    initiateGroupChatWithUser(member._id, member);
    // Navigate to inbox tab
    navigate(`/group/${groupId}`, { state: { activeTab: "inbox" } });
  };

  return (
    <button
      onClick={handleInitiateChat}
      className="p-2 hover:bg-indigo-600/20 rounded-lg transition-colors text-indigo-400 hover:text-indigo-300"
      title="Start personal chat"
    >
      <MessageIcon className="w-4 h-4" />
    </button>
  );
};

export default InitiateChatButton;
