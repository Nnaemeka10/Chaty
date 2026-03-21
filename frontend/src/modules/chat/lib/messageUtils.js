export const getEntityId = (value) => {
  if (!value) return null;
  return typeof value === "string" ? value : value._id || null;
};

export const normalizeDirectMessage = (message) => {
  if (!message) return message;

  return {
    ...message,
    _id: getEntityId(message._id) || message._id,
    senderId: getEntityId(message.senderId),
    receiverId: getEntityId(message.receiverId),
    clientTempId: message.clientTempId || null,
  };
};

export const normalizeGroupReactions = (reactions = []) => {
  const groupedReactions = new Map();

  reactions.forEach((reaction) => {
    if (!reaction?.emoji) return;

    const existingReaction = groupedReactions.get(reaction.emoji);
    const users = reaction.users
      ? reaction.users.map(getEntityId).filter(Boolean)
      : [getEntityId(reaction.userId)].filter(Boolean);

    if (existingReaction) {
      existingReaction.users = [...new Set([...existingReaction.users, ...users])];
      return;
    }

    groupedReactions.set(reaction.emoji, {
      emoji: reaction.emoji,
      users,
    });
  });

  return Array.from(groupedReactions.values());
};

export const normalizeReadBy = (readBy = []) =>
  readBy
    .map((entry) => {
      if (typeof entry === "string") return entry;
      return getEntityId(entry?.userId ?? entry);
    })
    .filter(Boolean);

export const normalizeGroupMessage = (message) => {
  if (!message) return message;

  const sender = message.sender || (typeof message.senderId === "object" ? message.senderId : null);

  return {
    ...message,
    _id: getEntityId(message._id) || message._id,
    sender,
    senderId: getEntityId(message.senderId) || getEntityId(sender),
    groupId: getEntityId(message.groupId) || message.groupId,
    clientTempId: message.clientTempId || null,
    readBy: normalizeReadBy(message.readBy),
    reactions: normalizeGroupReactions(message.reactions),
  };
};

export const findMessageMatchIndex = (messages = [], candidate) =>
  messages.findIndex((message) => (
    message._id === candidate._id ||
    (candidate.clientTempId && message.clientTempId === candidate.clientTempId) ||
    (candidate.clientTempId && message._id === candidate.clientTempId) ||
    (message.clientTempId && message.clientTempId === candidate._id)
  ));

export const upsertMessages = (messages = [], incomingMessage) => {
  const existingIndex = findMessageMatchIndex(messages, incomingMessage);

  if (existingIndex === -1) {
    return {
      nextMessages: [...messages, { ...incomingMessage, isOptimistic: false }],
      inserted: true,
      changed: true,
    };
  }

  const existingMessage = messages[existingIndex];
  const mergedMessage = {
    ...existingMessage,
    ...incomingMessage,
    isOptimistic: false,
  };

  const didChange = JSON.stringify(existingMessage) !== JSON.stringify(mergedMessage);
  if (!didChange) {
    return { nextMessages: messages, inserted: false, changed: false };
  }

  const nextMessages = [...messages];
  nextMessages[existingIndex] = mergedMessage;

  return {
    nextMessages,
    inserted: false,
    changed: true,
  };
};

export const dedupeMessageList = (messages = []) =>
  messages.reduce((accumulator, message) => {
    const { nextMessages } = upsertMessages(accumulator, message);
    return nextMessages;
  }, []);

export const normalizeDirectMessages = (messages = []) =>
  dedupeMessageList(messages.map(normalizeDirectMessage).filter(Boolean));

export const normalizeGroupMessages = (messages = []) =>
  dedupeMessageList(messages.map(normalizeGroupMessage).filter(Boolean));
