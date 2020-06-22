const db = require('./index');
const Schema = db.Schema;

const UserSchema = new Schema({
    username: {type: String, maxLength: 20, unique: true},
    password: {type: String, maxLength: 32},
    email: {type: String, maxLength: 50, unique: true},
    status: {type: Number, enum: [0, 1], default: 0}
});

module.exports = db.model('user', UserSchema);
