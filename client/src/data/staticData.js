// Static data for UI starter project

export const staticActiveUser = {
  id: "user1",
  _id: "user1",
  email: "sahil@example.com",
  profilePic: "https://i.pravatar.cc/150?img=12",
  bio: "Full stack developer passionate about building amazing apps",
  name: "Sahil Chopra"
};

export const staticUsers = [
  {
    _id: "user2",
    name: "Alice Johnson",
    email: "alice@example.com",
    profilePic: "https://i.pravatar.cc/150?img=1",
    bio: "UI/UX Designer"
  },
  {
    _id: "user3",
    name: "Bob Smith",
    email: "bob@example.com",
    profilePic: "https://i.pravatar.cc/150?img=2",
    bio: "Backend Developer"
  },
  {
    _id: "user4",
    name: "Charlie Brown",
    email: "charlie@example.com",
    profilePic: "https://i.pravatar.cc/150?img=3",
    bio: "DevOps Engineer"
  },
  {
    _id: "user5",
    name: "Diana Prince",
    email: "diana@example.com",
    profilePic: "https://i.pravatar.cc/150?img=4",
    bio: "Product Manager"
  },
  {
    _id: "user6",
    name: "Eve Wilson",
    email: "eve@example.com",
    profilePic: "https://i.pravatar.cc/150?img=5",
    bio: "Frontend Developer"
  }
];

export const staticChats = [
  {
    _id: "chat1",
    isGroup: false,
    chatName: "Alice Johnson",
    users: [staticActiveUser, staticUsers[0]],
    latestMessage: {
      message: "Hey, how are you doing today?",
      sender: staticUsers[0],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "chat2",
    isGroup: false,
    chatName: "Bob Smith",
    users: [staticActiveUser, staticUsers[1]],
    latestMessage: {
      message: "Let's catch up tomorrow!",
      sender: staticUsers[1],
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "chat3",
    isGroup: true,
    chatName: "Frontend Squad",
    users: [staticActiveUser, staticUsers[0], staticUsers[4]],
    photo: "https://i.pravatar.cc/150?img=10",
    latestMessage: {
      message: "New update in the group!",
      sender: staticUsers[0],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "chat4",
    isGroup: false,
    chatName: "Charlie Brown",
    users: [staticActiveUser, staticUsers[2]],
    latestMessage: {
      message: "Thanks for the help!",
      sender: staticActiveUser,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const staticMessages = {
  chat1: [
    {
      _id: "msg1",
      sender: staticUsers[0],
      message: "Hey, how are you doing today?",
      chatId: "chat1",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: "msg2",
      sender: staticActiveUser,
      message: "I'm doing great! Thanks for asking. How about you?",
      chatId: "chat1",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString()
    },
    {
      _id: "msg3",
      sender: staticUsers[0],
      message: "I'm good too! Working on some exciting projects.",
      chatId: "chat1",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString()
    }
  ],
  chat2: [
    {
      _id: "msg4",
      sender: staticUsers[1],
      message: "Let's catch up tomorrow!",
      chatId: "chat2",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: "msg5",
      sender: staticActiveUser,
      message: "Sounds good! What time works for you?",
      chatId: "chat2",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000 + 3 * 60 * 1000).toISOString()
    }
  ],
  chat3: [
    {
      _id: "msg6",
      sender: staticUsers[0],
      message: "New update in the group!",
      chatId: "chat3",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: "msg7",
      sender: staticUsers[4],
      message: "Great! Looking forward to it.",
      chatId: "chat3",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString()
    }
  ],
  chat4: [
    {
      _id: "msg8",
      sender: staticActiveUser,
      message: "Thanks for the help!",
      chatId: "chat4",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
};

export const staticNotifications = [
  {
    chatId: staticChats[0],
    message: "Hey, how are you doing today?"
  }
];

