const mongoose = require('mongoose');

const mySchema = new mongoose.Schema ({
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    username: {
        type: String,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        trim: true,
    },
    });

module.exports = mongoose.model('Registration', mySchema);