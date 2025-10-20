const socketIo = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-chatroom', (chatroomId) => {
      socket.join(chatroomId);
      console.log(`User ${socket.id} joined chatroom ${chatroomId}`);
    });

    socket.on('send-message', async (messageData) => {
      try {
        // Save message to database
        const message = await chatroomService.sendMessage(messageData);
        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'username');

        // Broadcast to all users in the chatroom
        io.to(messageData.chatroom).emit('new-message', populatedMessage);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = {
  initializeSocket,
  getIO
};