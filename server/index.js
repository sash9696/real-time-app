import express from 'express';
import dotenv from 'dotenv/config';
import mongoDBConnect from './mongoDB/connection.js';
import userRoutes from './routes/user.js'
import chatRoutes from './routes/chat.js'
import messageRoutes from './routes/messsage.js'
import cors from "cors"
import { Server } from 'socket.io';
import http from 'http';

const app = express();

const corsConfig = {
    origin: process.env.BASE_URL || 'http://localhost:5173',
    credentials:true
}

const PORT= process.env.PORT || 8000;
app.use(express.json());
app.use(cors(corsConfig));

app.use('/', userRoutes)

app.use('/api/message', messageRoutes)


app.use('/api/chat', chatRoutes)


app.get('/test', (req, res) => {
    res.json({message:'Server is running', timestamp: new Date().toISOString()})
})

mongoDBConnect();

const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.BASE_URL || 'http://localhost:5173',
    credentials: true
  }
});

// Make io accessible to routes
app.set('io', io);

io.on('connection', (socket) => {
  console.log('New socket connection:', socket.id);
  
  socket.on('setup', (userData) => {
    console.log('userData', userData);
    socket.join(userData.id);
    socket.emit('connected');
  });

  socket.on('join room', (room) => {
    console.log('room', room);
    socket.join(room);
  });

  socket.on('typing', (room) => {
    console.log('typing', room);
    socket.in(room).emit('typing');
  });

  socket.on('stop typing', (room) => {
    socket.in(room).emit('stop typing');
  });

  socket.on('new message', (newMessageRecieve) => {
    let newM = newMessageRecieve; // Already an object
    let chat = newM.chatId;
  
    console.log('newMessageRecieve', { chat, newM });
    console.log('Chat ID:', chat?._id);
    console.log('Chat users:', chat?.users);
    
    if (!chat?.users) {
      console.log('chat.users is not defined');
      return;
    }
  
    // Get sender ID to exclude from broadcast
    const senderId = newM.sender?._id?.toString() || newM.sender?._id || newM.sender?.id?.toString() || newM.sender?.id;
    
    // Emit to the chat room (this works if users have joined the chat room)
    console.log('Emitting message received to room:', chat._id);
    socket.in(chat._id).emit('message received', newMessageRecieve);
    
    // Also emit to individual user rooms as fallback (in case they're not in the chat room)
    // Users join their own user ID room on setup, so we can emit directly to them
    chat.users.forEach((user) => {
      const userId = user._id?.toString() || user._id || user?.toString();
      // Don't send to the sender
      if (userId && userId !== senderId) {
        console.log('Emitting to user room:', userId);
        io.to(userId).emit('message received', newMessageRecieve);
      }
    });
    
    // Also log the rooms this socket is in
    console.log('Socket rooms:', Array.from(socket.rooms));
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
    console.log(`Server listening on PORT - ${PORT}`)
})