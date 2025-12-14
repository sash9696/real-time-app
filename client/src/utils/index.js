export const isSameSenderMargin = (messages, m, i, userId) => {
    const currentSenderId = m.sender?._id?.toString() || m.sender?._id;
    const nextSenderId = i < messages.length - 1 ? (messages[i + 1].sender?._id?.toString() || messages[i + 1].sender?._id) : null;
    const userIdStr = userId?.toString() || userId;
    
    if (
      i < messages.length - 1 &&
      nextSenderId === currentSenderId &&
      currentSenderId !== userIdStr
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        nextSenderId !== currentSenderId &&
        currentSenderId !== userIdStr) ||
      (i === messages.length - 1 && currentSenderId !== userIdStr)
    )
      return 0;
    else return 'auto';
  };
  export function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
  
    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + ' year ago';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + ' month ago';
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + ' day ago';
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + ' hour ago';
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + ' minute ago';
    }
    return Math.floor(seconds) + ' seconda ago';
  }
  export const isSameSender = (messages, m, i, userId) => {
    const currentSenderId = m.sender?._id?.toString() || m.sender?._id;
    const nextSenderId = i < messages.length - 1 ? (messages[i + 1].sender?._id?.toString() || messages[i + 1].sender?._id) : null;
    const userIdStr = userId?.toString() || userId;
    
    return (
      i < messages.length - 1 &&
      (nextSenderId !== currentSenderId ||
        nextSenderId === undefined) &&
      currentSenderId !== userIdStr
    );
  };
  export const isLastMessage = (messages, i, userId) => {
    const lastMessage = messages[messages.length - 1];
    const lastSenderId = lastMessage?.sender?._id?.toString() || lastMessage?.sender?._id;
    const userIdStr = userId?.toString() || userId;
    
    return (
      i === messages.length - 1 &&
      lastSenderId !== userIdStr &&
      lastSenderId
    );
  };
  export const isSameUser = (messages, m, i) => {
    if (i === 0) return false;
    const currentSenderId = m.sender?._id?.toString() || m.sender?._id;
    const prevSenderId = messages[i - 1].sender?._id?.toString() || messages[i - 1].sender?._id;
    return currentSenderId === prevSenderId;
  };
  export const getSender = (activeUser, users) => {
    return activeUser.id === users[0]._id ? users[1].name : users[0].name;
  };
  export const getChatName = (activeChat, activeUser) => {
    if (!activeChat) return '';
  
    if (activeChat.isGroup) {
      return activeChat.chatName || '';
    }
  
    const users = activeChat.users;
  
    if (!Array.isArray(users) || users.length < 2 || !activeUser) {
      return 'Unknown User'; // or fallback
    }
  
    return users[0]._id === activeUser.id
      ? users[1]?.name || 'User'
      : users[0]?.name || 'User';
  };
  
  export const getChatPhoto = (activeChat, activeUser) => {
    if (!activeChat) return null;
  
    if (activeChat.isGroup) {
      return activeChat.photo || null;
    }
  
    if (!Array.isArray(activeChat.users) || activeChat.users.length < 2) {
      return null; // or fallback image URL
    }
  
    return activeChat.users[0]._id === activeUser?.id
      ? activeChat.users[1]?.profilePic
      : activeChat.users[0]?.profilePic;
  };

