const mongoose = require('mongoose');

// set endpoints for connection to DB 
mongoose.set('strictQuery', false);
mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smokey-joes',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

module.exports = mongoose.connection;