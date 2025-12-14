# Frontend Documentation

## Features

This is a real-time chat application built with React. Here's what you can do:

### User Features
- **Authentication**: Register new accounts and login with email/password
- **User Search**: Search for other users by name or email to start conversations
- **One-on-One Chats**: Send and receive messages in private conversations
- **Group Chats**: Create group chats with multiple users, rename groups, add/remove members
- **Real-Time Messaging**: Messages appear instantly using Socket.IO
- **Typing Indicators**: See when someone is typing in real-time
- **Notifications**: Get notified when you receive messages in chats you're not currently viewing
- **Profile Management**: Update your name and bio
- **Emoji Support**: Send emojis in your messages

### Technical Features
- **State Management**: Redux Toolkit for managing user state, chats, and notifications
- **Real-Time Updates**: Socket.IO client for instant message delivery
- **Responsive Design**: Works on desktop and mobile devices
- **Toast Notifications**: User-friendly success/error messages
- **Auto-scroll**: Messages automatically scroll to the latest

## Steps to Build the Application

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
   Replace with your backend URL when deploying.

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   The app will be available at `http://localhost:5173` (or the port shown in terminal)

### Building for Production

1. **Build the application:**
   ```bash
   npm run build
   ```
   This creates an optimized production build in the `dist` folder.

2. **Preview the production build:**
   ```bash
   npm run preview
   ```

## Testing

### Manual Testing Checklist

#### Authentication
- [ ] Register a new user with first name, last name, email, and password
- [ ] Login with valid credentials
- [ ] Try logging in with wrong password (should show error)
- [ ] Try registering with existing email (should show error)
- [ ] Logout functionality works

#### Chat Features
- [ ] Search for users and start a new chat
- [ ] Send messages in a one-on-one chat
- [ ] Receive messages in real-time (open in two browser windows)
- [ ] Create a group chat with multiple users
- [ ] Rename a group chat
- [ ] Add users to a group
- [ ] Remove users from a group
- [ ] Leave a group chat

#### Real-Time Features
- [ ] Typing indicator appears when someone is typing
- [ ] Messages appear instantly without page refresh
- [ ] Notification badge shows count of unread messages
- [ ] Clicking notification opens the chat
- [ ] Notifications clear when you open the chat

#### UI/UX
- [ ] Messages align correctly (your messages on right, others on left)
- [ ] Profile picture displays correctly
- [ ] Emoji picker works
- [ ] Search functionality works
- [ ] Profile update works (name and bio)
- [ ] Responsive on mobile devices

### Common Issues and Fixes

**Socket not connecting:**
- Check that backend server is running
- Verify `VITE_API_URL` in `.env` matches your backend URL
- Check browser console for connection errors

**Messages not appearing:**
- Check browser console for errors
- Verify Socket.IO connection is established (look for "Socket connected successfully" in console)
- Make sure both users are logged in

**Notifications not working:**
- Check that you're not viewing the chat where the message was sent
- Verify Socket.IO is connected
- Check Redux state in browser DevTools

## Project Structure

```
client/
├── src/
│   ├── apis/           # API calls to backend
│   ├── components/     # Reusable UI components
│   ├── pages/          # Main page components
│   ├── redux/          # Redux state management
│   ├── utils/          # Helper functions
│   └── App.jsx         # Main app component
├── package.json
└── vite.config.js
```

## Key Technologies

- **React 18**: UI library
- **Vite**: Build tool and dev server
- **Redux Toolkit**: State management
- **Socket.IO Client**: Real-time communication
- **React Router**: Navigation
- **Tailwind CSS**: Styling
- **Axios**: HTTP requests

