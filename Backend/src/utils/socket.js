import { Server } from 'socket.io';
import {User} from '../models/user.model.js'
import {Captain} from '../models/captain.model.js'

let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('join',async(data)=>{
            const {userId,userType} = data;

            try {
                if(userType === 'user'){
                    await User.findByIdAndUpdate(userId,{
                        socketId : socket.id
                    });
                }
                else if(userType === 'captain'){
                    await Captain.findByIdAndUpdate(userId,{
                        socketId : socket.id,
                    });
                }
            } catch (error) {
                console.log(error);
            }
        })
        
        socket.on('disconnect',async () => {
            console.log('User disconnected:', socket.id);

            try {
                // Clear socketId on disconnect (optional cleanup)
                await User.updateOne({ socketId: socket.id }, { $unset: { socketId: 1 } });
                await Captain.updateOne({ socketId: socket.id }, { $unset: { socketId: 1 } });
            } catch (err) {
                console.error("❌ Error cleaning up socket ID:", err.message);
            }
        });
    });

    return io;
};

export const sendMessageToSocket = (socketId , message) => {
    console.log(message);
    if (io) {
        io.to(socketId).emit('message',message);
        console.log(`📤 Message sent to socket ${socketId}`, message);
    }
    else{
        console.log('socket is not initialize')
    }
};

export const getIO = () => {
    if (!io) throw new Error("Socket.IO not initialized");
    return io;
};
