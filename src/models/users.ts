const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        provider: {type: String, required: true},
        id: {type: String, required: true},
        name: {type: String, required: true},
        friends: Array,
        friend_requests: Array
    }
);

module.exports = mongoose.model('User', schema);