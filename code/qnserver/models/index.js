const dbConfig = require('../db/config.js');
const db = require('mongoose');
const dbURL = `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.HOST}:27017/${dbConfig.DB}`;
db.connect(dbURL);

db.connection.on('connected', function () {
    console.log('Mongoose connection open to: ' + dbURL);
});

db.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});

db.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});

module.exports = db;
