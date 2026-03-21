import { useParams, useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { useGroupStore } from "../useGroupStore";
import LobbyHeader from "../components/lobby/LobbyHeader";
import LobbySidebar from "../components/lobby/LobbySidebar";
import GroupChatPage from "../../chat/pages/GroupChatPage";
import VideoCallPage from "../../video/pages/VideoCallPage";
import GroupSettings from "../../settings/pages/GroupSettings";
import GroupResourcePage from "../../resources/pages/GroupResourcePage";
import GroupSchedule from "../../schedule/pages/GroupSchedule";
import InboxPage from "../../chat/pages/InboxPage";

const GroupLobby = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { selectedGroup, myGroups, setSelectedGroup } = useGroupStore();
  const [activeTab, setActiveTab] = useState("chat");
  const [searchQuery, setSearchQuery] = useState("");
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

  useEffect(() => {
    setSearchQuery("");
  }, [activeTab]);

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

  const content = useMemo(() => {
    switch (activeTab) {
      case "chat":
        return <GroupChatPage searchQuery={searchQuery} />;
      case "inbox":
        return <InboxPage searchQuery={searchQuery} />;
      case "call":
        return <VideoCallPage />;
      case "resources":
        return <GroupResourcePage searchQuery={searchQuery} />;
      case "schedule":
        return <GroupSchedule searchQuery={searchQuery} />;
      case "settings":
        return <GroupSettings />;
      default:
        return <GroupChatPage searchQuery={searchQuery} />;
    }
  }, [activeTab, searchQuery]);

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
