import { GroupCard } from "./GroupCard";
import GroupsLoadingSkeleton from "./GroupsLoadingSkeleton";
import EmptyStates from "./EmptyStates";

// later see if we can make his reusable for schedule and invite 1ist too

const GroupsList = ({
  groups,
  isLoading,
  emptyStateType,
  onCardAction,
}) => {
  if (isLoading) {
    return <GroupsLoadingSkeleton />;
  }

  if (groups.length === 0) {
    return <EmptyStates type={emptyStateType} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => (

        
        <GroupCard
          key={group._id}
          group={group}
          onOpen={onCardAction?.onOpen}
          onJoin={onCardAction?.onJoin}
          onAccept={onCardAction?.onAccept}
          isMember={onCardAction?.isMember?.(group._id)}
          isInvited={onCardAction?.isInvited?.(group._id)}
          isPending={onCardAction?.isPending?.(group._id)}
        />
      ))}
    </div>
  );
};

export default GroupsList;
