const db = require('./index');
const Schema = db.Schema;

const SubmitSchema = new Schema({
    questionnaireId: {type: Schema.Types.ObjectId},
    submitTime: {type: Date, default: Date.now},
    submitIp: {type: String, maxLength: 46},
    useTime: {type: Number}
});

module.exports = db.model('submit', SubmitSchema);
