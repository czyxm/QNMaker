const db = require('./index');
const Schema = db.Schema;

const QuestionSchema = new Schema({
    title: {type: String, maxLength: 100},
    type: {type: String, maxLength: 20},
    numberType: {type: String, enum: ['integer', 'real'], default: 'integer'},
    questionnaireId: {type: Schema.Types.ObjectId},
    row: {type: Number},
    must: {type: Boolean, default: false},
    options: [{
        title: {type: String, maxLength: 100},
        _id: Number
    }],
    answer: {type: Schema.Types.Mixed}
});

module.exports = db.model('question', QuestionSchema);
