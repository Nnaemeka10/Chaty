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
import InboxPage from "../../chat/pages/InboxPage";
import { useGetMyGroups } from "../hooks/useGroups";

const GroupLobby = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const selectedGroup = useGroupStore((state) => state.selectedGroup);
  const setSelectedGroup = useGroupStore((state) => state.setSelectedGroup);
  const [activeTab, setActiveTab] = useState("chat");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: myGroups = [], isLoading } = useGetMyGroups();
  const group = selectedGroup?._id === groupId
    ? selectedGroup
    : myGroups.find((item) => item._id === groupId) || null;

  // Get group data
  useEffect(() => {
    if (group && selectedGroup?._id !== group._id) {
      setSelectedGroup(group);
    }
  }, [group, selectedGroup?._id, setSelectedGroup]);

  // Redirect if group not found
  useEffect(() => {
    if (!isLoading && !group) {
      navigate("/");
    }
  }, [isLoading, group, navigate]);

  useEffect(() => {
    setSearchQuery("");
  }, [activeTab]);

  let content;

switch (activeTab) {
  case "chat":
    content = <GroupChatPage searchQuery={searchQuery} />;
    break;
  case "inbox":
    content = <InboxPage searchQuery={searchQuery} />;
    break;
  case "call":
    content = <VideoCallPage />;
    break;
  case "resources":
    content = <GroupResourcePage searchQuery={searchQuery} />;
    break;
  case "schedule":
    content = <GroupSchedule searchQuery={searchQuery} />;
    break;
  case "settings":
    content = <GroupSettings />;
    break;
  default:
    content = <GroupChatPage searchQuery={searchQuery} />;
}

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

  
  return (
    <div className="lobby-container w-full h-screen bg-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <LobbyHeader
        group={group}
        activeTab={activeTab}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <LobbySidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-auto">
          {content}
        </div>
      </div>
    </div>
  );
};

export default GroupLobby;
