const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
//we dont manually add username and password in schema but this pligin does it and it provides multiple features
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
