const mongoose = require('mongoose');

// creating a schema for the username
const userName = mongoose.Schema({
    username: {type: String, required: true}
}); 
// creating the username model
const USER = mongoose.model('USER', userName);

// creating a schema for the Add exercises form
const userInfo = mongoose.Schema({
    userId: {type: String, required: true},
    description: {type: String, required: true},
    duration: {type: Number},
    date: {type: Date, default: Date.now}
})
// creating the user info model
const INFO = mongoose.model('INFO', userInfo);

// // creating a sehema for the user logs
// const userLog = mongoose.Schema({
//     user_id: {type: String, required: true},
//     username: {type: String, required: true},
//     count: {type: Number, required: true},
//     log: {type: Array}
// })

// // creating the user log model
// const LOG = mongoose.model('LOG', userLog);



module.exports = {
    USER,
    INFO
}