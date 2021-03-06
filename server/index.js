import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
// import { dirname } from 'path'
// import { fileURLToPath } from 'url'

dotenv.config({ path: './config/config.env' })
const app = express()
const httpServer = createServer(app)
// const __dirname = dirname(fileURLToPath(import.meta.url))

const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.REACT_APP_FRONTEND_LOCAL_URL ||
      'https://vexuz-chatapp.netlify.app',
    methods: ['GET', 'POST'],
  },
})

const PORT = process.env.PORT || 3001

app.use(cors())

io.on('connection', (socket) => {
  console.log(`User with ID ${socket.id} is connected.`)

  socket.on('join_room', (roomName) => {
    socket.join(roomName)
    console.log(`User with ID ${socket.id} joined room ${roomName}.`)
  })

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

app.get('/', (req, res) => {
  res.send(`Server listening on port ${PORT}`)
})

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
