const jsonwebtoken = require('jsonwebtoken');
const { addUser, getUser } = require('./db/api');
const { SEKRET } = require('constants');

const sign = (claims, key, options) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken.sign(claims, key, options, (error, token) => {
            if (error) {
                reject(error);
            } else {
                resolve(token);
            }
        })
    })
};

const verify = (token, key, options) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken.verify(token, key, options, (error, verified) => {
            if (error) {
                reject(error);
            } else {
                resolve(verified);
            }
        })
    })
};

const register = async ({name, password}) => {
    console.log(['auth.register'], {name, password});
    try {
        const success = await addUser({name, password});
        if(success) {
            return await sign({name, password}, SEKRET);;
        } else {
            return null;
        }

    } catch(e) {
         console.log(['auth.e'], e);
    }
};

const login = async ({name, password}) => {
    console.log(['auth.register'], {name, password});
    try {
        const success = await getUser({name, password});
        if(success) {
            return await sign({name}, SEKRET);
        } else {
            return null;
        }

    } catch(e) {
         console.log(['auth.e'], e);
    }
};

const verifyToken = (next, onFail) => async (...args) => {
  const [data] = args;
  const isVerified = await data.token && verify(data.token);
  if (isVerified) {
    return next(...args);
  }

  onFail();
  return false;
};

module.exports = {
    login,
    register,
    verifyToken,
};