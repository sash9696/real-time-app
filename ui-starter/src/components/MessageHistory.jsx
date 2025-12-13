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
        const isMine = m.sender._id === activeUser.id;
        const showAvatar =
          isSameSender(messages, m, i, activeUser.id) ||
          isLastMessage(messages, i, activeUser.id);

        return (
          <div key={m._id} className="flex items-start gap-x-2 mb-2">
            {showAvatar && (
              <img
                src={m.sender?.profilePic}
                alt={m.sender?.name}
                className="w-8 h-8 rounded-full"
                title={m.sender?.name}
              />
            )}
            <div
              className={`max-w-[60%] px-4 py-2 rounded-lg text-sm font-medium break-words ${
                isMine
                  ? 'bg-green-600 text-white ml-auto rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
              style={{
                marginLeft: isSameSenderMargin(messages, m, i, activeUser.id),
                marginTop: isSameUser(messages, m, i, activeUser.id) ? 3 : 10,
              }}
            >
              {m.message}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageHistory;

