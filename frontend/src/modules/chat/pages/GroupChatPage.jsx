import { useParams } from "react-router";
import GroupChatContainer from "../components/group/GroupChatContainer";

const GroupChatPage = () => {
  const { groupId } = useParams();

  return (
    <div className="w-full h-full flex flex-col">
      <GroupChatContainer groupId={groupId} />
    </div>
  );
};

export default GroupChatPage;
