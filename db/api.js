const sqlite = require('sqlite');
const { compare, hash } = require('bcrypt-as-promised'); 
const SALT = 10;


const addUser = async ({name, password}) => {
    console.log(['api.addUser'], {name, password});
    try {
        const passwordHash = await hash(password, SALT);

        const db = await sqlite.open('chat.db');
        await db.run(`INSERT into users(name, passwordHash) VALUES ('${name}', '${passwordHash}')`);

        return true;

    } catch(error) {
        console.log(['api.addUser.error'], error);
    }
};

const getUser = async ({ name, password }) => {
  //console.log(['api.getUser'], name, password);
  try {
    const db = await sqlite.open('chat.db');    
    const user = await db.get(`SELECT * FROM users WHERE name='${name}'`) || {};
    const verified = await compare(password, user.passwordHash);

    return user;
  }

  catch(error) {
    console.log(['api.addUser.error'], error);
  }
};

const logUserMessage = async ({ name, room, message }) => {
    console.log(['api.loguserMessage'], { name, message, room });
    const db = await sqlite.open('chat.db');
    const time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

    await db.run(`INSERT into messages(user, message, room, timestamp) VALUES ('${name}', '${message}', '${room}','${time}')`);
    const messages = await db.all('SELECT * FROM messages');
};



module.exports = {
    addUser,
    getUser,
    logUserMessage,
};