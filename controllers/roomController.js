const { userJoin, userLeave, getUsers, addDrawing, getDrawings,clearDrawings, addDrawings } = require("../utils/room");

async function handleUserJoined(socket, io, data) {
    const { roomId, userName,host } = data;
    const user = await userJoin(socket.id, userName, roomId,host);
    socket.join(user.room);

    const roomUsers = await getUsers(user.room);
    
    // Emit a welcome message to the newly joined user
    socket.emit("message", { message: "Welcome to ChatRoom" });
    
    // Emit previous drawings only to the newly joined user
    const previousDrawings = await getDrawings(user.room);
    socket.emit("previous-drawings", previousDrawings);
    
    // Notify other users in the room of the new user's arrival
    socket.broadcast.to(user.room).emit("message", { message: `${user.username} has joined` });
    
    // Emit the updated list of users in the room
    io.to(user.room).emit("users", roomUsers);
}

async function handleUserLeave(socket, io) {
    const user = await userLeave(socket.id);
    if (user) {
        const roomUsers = await getUsers(user.room);
        if(roomUsers.length===0) {
            clearDrawings(user.room);
        } else {   
        // Notify other users in the room that this user has left
        io.to(user.room).emit("message", { message: `${user.username} left the chat` });
        
        // Emit the updated list of users in the room
        io.to(user.room).emit("users", roomUsers);
        }
        // Leave the socket room
        socket.leave(user.room);
    }
}

function handleDraw(socket, data) {
    const userRoom = Array.from(socket.rooms)[1];
    if (userRoom) {
        // Store the drawing data for this room
        // addDrawing(userRoom, data);
        addDrawings(userRoom, data);

        // Broadcast the new drawing to other users in the room
        socket.broadcast.to(userRoom).emit("draw", data);
    }
}

module.exports = { handleUserJoined, handleUserLeave, handleDraw };
