// here we save all session config objects

const expressSession = require('express-session');

// database config
const mongoDbStore = require('connect-mongodb-session');

function createSessionStore() {

    const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.0pxc1mu.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`

    //-----------------------------------------------------------------//
    const MongoDBStore = mongoDbStore(expressSession);

    const store = new MongoDBStore({
        uri: uri,
        databaseName: process.env.DBNAME,
        collection: 'sessions'
    });

    return store;
}

function createSessionConfig() {
    return {
        // secret key
        secret: 'los-magnificos',
        resave: false,
        saveUninitialized: false,
        store: createSessionStore(),
        // time in which the cookie will be valid (the time of the session)
        cookie: {
            // two days
            maxAge: 2 * 24 * 60 * 60 * 1000
        }
    }
}

module.exports = createSessionConfig;