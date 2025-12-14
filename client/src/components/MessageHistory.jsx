import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { isSameSender, isSameSenderMargin, isSameUser, isLastMessage } from '../utils';

function MessageHistory({ messages }) {
  const activeUser = useSelector((state) => state.activeUser);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new message is added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="overflow-y-auto scrollbar-hide h-full px-2 flex items-center justify-center">
        <p className="text-gray-400">No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto scrollbar-hide h-full px-2">
      {messages?.map((m, i) => {
        // Compare sender ID with active user ID - handle both string and ObjectId
        const senderId = m.sender?._id?.toString() || m.sender?._id || m.sender?.id?.toString() || m.sender?.id;
        const userId = activeUser?.id?.toString() || activeUser?.id || activeUser?._id?.toString() || activeUser?._id;
        const isMine = senderId && userId && senderId === userId;
        
        // Debug first message
        if (i === 0) {
          console.log('MessageHistory Debug:', {
            senderId,
            userId,
            isMine,
            sender: m.sender,
            activeUser: activeUser,
            messageSenderName: m.sender?.name,
            activeUserName: activeUser?.name
          });
        }
        
        const showAvatar =
          isSameSender(messages, m, i, activeUser?.id) ||
          isLastMessage(messages, i, activeUser?.id);

        return (
          <div key={m._id || i} className={`flex items-start gap-x-2 mb-2 ${isMine ? 'justify-end' : 'justify-start'}`}>
            {!isMine && showAvatar && (
              <img
                src={m.sender?.profilePic || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'}
                alt={m.sender?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                title={m.sender?.name || 'User'}
              />
            )}
            {!isMine && !showAvatar && <div className="w-8 h-8 flex-shrink-0" />}
            <div
              className={`max-w-[60%] px-4 py-2 rounded-lg text-sm font-medium break-words ${
                isMine
                  ? 'bg-green-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
              style={{
                marginLeft: isSameSenderMargin(messages, m, i, activeUser?.id),
                marginTop: isSameUser(messages, m, i) ? 3 : 10,
              }}
            >
              {m.message}
            </div>
            {isMine && <div className="w-8 h-8 flex-shrink-0" />}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageHistory;

