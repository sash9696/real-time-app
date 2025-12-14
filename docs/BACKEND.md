# Backend Documentation

## Features

The backend is a Node.js/Express server with MongoDB and Socket.IO. Here's what it does:

### Core Features
- **User Authentication**: JWT-based authentication with secure password hashing
- **User Management**: Register, login, search users, update profile
- **Chat Management**: Create one-on-one chats, group chats, manage group members
- **Message Handling**: Send messages, fetch chat history
- **Real-Time Communication**: Socket.IO for instant message delivery
- **Database**: MongoDB with Mongoose for data persistence

## Simple API Guide

All API endpoints require authentication except registration and login. Include the JWT token in the Authorization header.

### Authentication Endpoints

#### Register User
```
POST /auth/register
Body: {
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
Response: { "message": "success", "token": "jwt_token_here" }
```

#### Login
```
POST /auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
Response: { "token": "jwt_token_here", "status": 200 }
```

#### Validate User (Check if logged in)
```
GET /auth/valid
Headers: { "Authorization": "jwt_token_here" }
Response: { "user": { user object }, "token": "jwt_token_here" }
```

#### Logout
```
GET /auth/logout
Headers: { "Authorization": "jwt_token_here" }
Response: { "message": "logged out successfully" }
```

### User Endpoints

#### Search Users
```
GET /api/user?search=john
Headers: { "Authorization": "jwt_token_here" }
Response: { "users": [array of user objects] }
```

#### Get User by ID
```
GET /api/users/:id
Headers: { "Authorization": "jwt_token_here" }
Response: { user object }
```

#### Update User Info
```
PATCH /api/users/update/:id
Headers: { "Authorization": "jwt_token_here" }
Body: {
  "name": "John Doe",
  "bio": "Software Developer"
}
Response: { "message": "User info updated successfully", "user": { updated user } }
```

### Chat Endpoints

#### Create or Access Chat
```
POST /api/chat
Headers: { "Authorization": "jwt_token_here" }
Body: {
  "userId": "user_id_to_chat_with"
}
Response: { chat object }
```

#### Get All Chats
```
GET /api/chat
Headers: { "Authorization": "jwt_token_here" }
Response: [array of chat objects]
```

#### Create Group Chat
```
POST /api/chat/group
Headers: { "Authorization": "jwt_token_here" }
Body: {
  "chatName": "My Group",
  "users": "[user_id_1, user_id_2]"
}
Response: { created group chat object }
```

#### Rename Group
```
PATCH /api/chat/group/rename
Headers: { "Authorization": "jwt_token_here" }
Body: {
  "chatId": "chat_id",
  "chatName": "New Group Name"
}
Response: { updated chat object }
```

#### Add User to Group
```
PATCH /api/chat/groupAdd
Headers: { "Authorization": "jwt_token_here" }
Body: {
  "chatId": "chat_id",
  "userId": "user_id_to_add"
}
Response: { updated chat object }
```

#### Remove User from Group
```
PATCH /api/chat/groupRemove
Headers: { "Authorization": "jwt_token_here" }
Body: {
  "chatId": "chat_id",
  "userId": "user_id_to_remove"
}
Response: { updated chat object }
```

### Message Endpoints

#### Send Message
```
POST /api/message
Headers: { "Authorization": "jwt_token_here" }
Body: {
  "chatId": "chat_id",
  "message": "Hello, how are you?"
}
Response: { message object with sender and chat populated }
```

#### Get Messages
```
GET /api/message/:chatId
Headers: { "Authorization": "jwt_token_here" }
Response: [array of message objects]
```

## Socket.IO Events

### Client to Server

#### Setup Connection
```javascript
socket.emit('setup', { id: user_id, name: user_name, email: user_email })
```

#### Join Chat Room
```javascript
socket.emit('join room', chat_id)
```

#### Send New Message
```javascript
socket.emit('new message', message_object)
```

#### Typing Indicator
```javascript
socket.emit('typing', chat_id)
socket.emit('stop typing', chat_id)
```

### Server to Client

#### Connection Confirmed
```javascript
socket.on('connected', () => {
  // Socket connected successfully
})
```

#### Message Received
```javascript
socket.on('message received', (message) => {
  // Handle new message
})
```

#### Typing Indicators
```javascript
socket.on('typing', () => {
  // Show typing indicator
})

socket.on('stop typing', () => {
  // Hide typing indicator
})
```

## Testing

### Using Postman or Similar Tool

1. **Test Registration:**
   - POST to `http://localhost:8000/auth/register`
   - Send firstname, lastname, email, password
   - Save the token from response

2. **Test Login:**
   - POST to `http://localhost:8000/auth/login`
   - Send email and password
   - Save the token

3. **Test Protected Endpoints:**
   - Add header: `Authorization: your_token_here`
   - Try GET `/api/chat` to get all chats
   - Try GET `/api/user?search=test` to search users

4. **Test Message Sending:**
   - POST to `/api/message` with chatId and message
   - Check that message is saved and Socket.IO event is emitted

### Using cURL

```bash
# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstname":"John","lastname":"Doe","email":"john@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"test123"}'

# Get Chats (replace TOKEN with actual token)
curl -X GET http://localhost:8000/api/chat \
  -H "Authorization: TOKEN"
```

### Testing Socket.IO

1. **Install Socket.IO client tester** or use browser console:
   ```javascript
   const socket = io('http://localhost:8000');
   socket.emit('setup', { id: 'user_id', name: 'Test', email: 'test@test.com' });
   socket.on('connected', () => console.log('Connected!'));
   ```

2. **Test message receiving:**
   - Open two browser windows
   - Login as different users
   - Send a message from one
   - Check if the other receives it via Socket.IO

### Common Issues

**401 Unauthorized:**
- Token is missing or invalid
- Check that token is in Authorization header
- Try logging in again to get a fresh token

**500 Server Error:**
- Check server console for error details
- Verify MongoDB connection
- Check that all required fields are provided

**Socket not connecting:**
- Verify server is running
- Check CORS settings
- Verify Socket.IO server is initialized correctly

## Environment Variables

Create a `.env` file in the server directory:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
SECRET=your_jwt_secret_key
BASE_URL=http://localhost:5173
NODE_ENV=development
```

## Project Structure

```
server/
├── controllers/    # Business logic
├── models/         # MongoDB schemas
├── routes/         # API routes
├── middlewares/    # Auth middleware
├── mongoDB/        # Database connection
└── index.js        # Main server file
```

## Key Technologies

- **Node.js**: Runtime environment
- **Express**: Web framework
- **MongoDB**: Database
- **Mongoose**: MongoDB object modeling
- **Socket.IO**: Real-time communication
- **JWT**: Authentication
- **bcryptjs**: Password hashing

