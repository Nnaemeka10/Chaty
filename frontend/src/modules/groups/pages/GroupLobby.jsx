import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useGroupStore } from "../useGroupStore";
import LobbyHeader from "../components/lobby/LobbyHeader";
import LobbySidebar from "../components/lobby/LobbySidebar";
import GroupChatPage from "../../chat/pages/GroupChatPage";
import VideoCallPage from "../../video/pages/VideoCallPage";
import GroupSettings from "../../settings/pages/GroupSettings";
import GroupResourcePage from "../../resources/pages/GroupResourcePage";
import GroupSchedule from "../../schedule/pages/GroupSchedule";

const GroupLobby = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { selectedGroup, myGroups, setSelectedGroup } = useGroupStore();
  const [activeTab, setActiveTab] = useState("chat");
  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get group data
  useEffect(() => {
    const foundGroup = selectedGroup || myGroups.find((g) => g._id === groupId);
    
    if (foundGroup) {
      setGroup(foundGroup);
      setSelectedGroup(foundGroup);
      setIsLoading(false);
    } else {
      // TODO: Fetch group from backend if not in store
      setIsLoading(false);
    }
  }, [groupId, selectedGroup, myGroups, setSelectedGroup]);

  // Redirect if group not found
  useEffect(() => {
    if (!isLoading && !group) {
      navigate("/");
    }
  }, [isLoading, group, navigate]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-900">
        <div className="text-slate-400">Loading group...</div>
      </div>
    );
  }

  if (!group) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "chat":
        return <GroupChatPage />;
      case "call":
        return <VideoCallPage />;
      case "resources":
        return <GroupResourcePage />;
      case "schedule":
        return <GroupSchedule />;
      case "settings":
        return <GroupSettings />;
      default:
        return <GroupChatPage />;
    }
  };

  return (
    <div className="lobby-container w-full h-screen bg-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <LobbyHeader group={group} />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <LobbySidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default GroupLobby;
