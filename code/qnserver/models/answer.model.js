const db = require('./index');
const Schema = db.Schema;

const AnswerSchema = new Schema({
    questionnaireId: {type: Schema.Types.ObjectId},
    questionId: {type: Schema.Types.ObjectId},
    submitId: {type: Schema.Types.ObjectId},
    type: {type: String, maxLength: 20},
    answer: {type: Schema.Types.Mixed}
});

module.exports = db.model('answer', AnswerSchema);
