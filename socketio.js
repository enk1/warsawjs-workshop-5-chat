const socketio = require('socket.io');

module.exports = server => {   
    const io = socketio(server);
    let connections = 0;
    const connected = {};
    const users = {};
    const rooms = ['Poczekalnia'];

    io.on('connection', socket => {
         console.log(socket.id);
         connections++;
         const user = {
             name: `Bezimienny_${connections}`, //bug z connections
             room: 'Poczekalnia',
             id: socket.id,
         }

         users[user.name] = user;
         connected[socket.id] = users[user.name];

         io.local.emit('message', `Użytkownik ${user.name} wszedł do pokoju.`);
         socket.emit('rooms', rooms);

         socket.join(user.room, () => {
             console.log([`Użytkownik dołączył do pokoju ${user.name}`]);
             socket.broadcast.emit('message', `Użytkownik dołączył do pokoju ${user.name}`);
         });

         socket.on('message', ({message}) => {
             console.log(['socket.ons.message'], message);
             io.local.emit('message', `${user.name}: ${message}`);
         });

         socket.on('disconnect', () => {
             socket.broadcast.emit('message', `${user.name} rozłączył się`);
             delete connected[socket.id];
             delete users[user.name];
             console.log(['disconnect'], user);
             
         });
    });
};