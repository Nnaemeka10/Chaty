import { useParams } from "react-router";
import GroupChatContainer from "../components/group/GroupChatContainer";

const GroupChatPage = ({ searchQuery = "" }) => {
  const { groupId } = useParams();

  return (
    <div className="w-full h-full flex flex-col">
      <GroupChatContainer groupId={groupId} searchQuery={searchQuery} />
    </div>
  );
};

export default GroupChatPage;
