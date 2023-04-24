const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true
    })
    .then(() => {
        console.log('Database connected');
    })
    .catch(err => console.log(err));
};

module.exports = connectDatabase;