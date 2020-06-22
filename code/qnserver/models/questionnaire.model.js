const db = require('./index');
const Schema = db.Schema;

const QuestionnaireSchema = new Schema({
    title: {type: String, maxLength: 50, unique: true},
    description: {type: String},
    username: {type: String, maxLength: 20},
    status: {type: Number, enum: [0, 1], default: 0},
    onlyRegister: {type: Boolean, default: false},
    eachIpUpperBound: {type: Number, default: 1},
    eachDay: {type: Boolean, default: false}
});
module.exports = db.model('questionnaire', QuestionnaireSchema);
