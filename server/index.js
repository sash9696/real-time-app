import express from 'express';
import dotenv from 'dotenv/config';
import mongoDBConnect from './mongoDB/connection.js';
import userRoutes from './routes/user.js'
import chatRoutes from './routes/chat.js'
import messageRoutes from './routes/messsage.js'

const app = express();

const PORT= process.env.PORT || 8000;
app.use(express.json());

app.use('/', userRoutes)

app.use('/api/message', messageRoutes)


app.use('/api/chat', chatRoutes)


app.get('/test', (req, res) => {
    res.json({message:'Server is running', timestamp: new Date().toISOString()})
})

mongoDBConnect();


const server = app.listen(PORT, () => {
    console.log(`Server  listening on PORT - ${PORT}`)
})