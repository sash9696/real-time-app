# Chat UI Starter Project

This is a standalone UI starter project for the real-time chat application. It works with **static data** instead of API calls, making it perfect for:

- UI/UX development and testing
- Frontend-only demonstrations
- Design iterations
- Component development without backend dependencies

## Features

- ✅ Complete chat UI with all components
- ✅ Static data (no API calls needed)
- ✅ Same file and component naming as the main project
- ✅ Redux state management
- ✅ All UI features working (search, groups, messages, profile)
- ✅ No socket.io dependency (removed for static mode)

## Project Structure

The project structure matches the main client project:

```
ui-starter/
├── src/
│   ├── apis/          # Mock API functions (return static data)
│   ├── components/    # All UI components
│   ├── data/          # Static data definitions
│   ├── pages/          # Page components
│   ├── redux/          # Redux slices and store
│   └── utils/          # Utility functions
├── package.json
├── vite.config.js
└── index.html
```

## Getting Started

1. **Install dependencies:**
   ```bash
   cd ui-starter
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## Static Data

All data is defined in `src/data/staticData.js`:

- **staticActiveUser**: The current logged-in user
- **staticUsers**: List of available users for chats
- **staticChats**: Pre-defined chat conversations
- **staticMessages**: Messages for each chat

You can modify this file to customize the demo data.

## Mock APIs

All API functions in `src/apis/` return static data with simulated delays:

- `auth.js`: Login, register, user validation, search
- `chat.js`: Create chats, groups, manage members
- `message.js`: Send and fetch messages

## Key Differences from Main Project

1. **No socket.io**: Real-time features are simulated with static data
2. **No axios calls**: All API functions return mock data
3. **Static Redux state**: Initial state is populated with static data
4. **No environment variables**: No need for API URLs

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Customization

### Adding More Static Data

Edit `src/data/staticData.js` to add:
- More users
- More chats
- More messages

### Modifying Mock APIs

Edit files in `src/apis/` to change:
- Response data
- Delay timing
- Error scenarios

## Notes

- The UI is fully functional with static data
- All components maintain the same naming as the main project
- You can easily switch back to real APIs by replacing the mock functions
- Socket.io has been removed - real-time features are simulated

## License

Same as the main project.

