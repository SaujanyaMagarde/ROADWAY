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
        })
        
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};

export const sendMessageToSocket = (socketId , message) => {
    if (io) {
        io.to(socketId).emit('message',message);
    }
    else{
        console.log('socket is not initialize')
    }
};
