const Answer = require('../models/answer.model');
const Question = require('../models/question.model');
const Submit = require('../models/submit.model');
const db = require('../models/index');
var ObjectId = db.Types.ObjectId;

exports.add = (questionId, submitId, questionnaireId, type, answer) => {
    if (type === 'checkbox') {
        for (let option of answer) {
            let newAnswer = new Answer({
                questionnaireId: questionnaireId,
                questionId: questionId,
                submitId: submitId,
                type: type,
                answer: option
            });
            newAnswer.save((err, result) => {
                if (err) {
                    throw err;
                } else {
                    //console.log('add answer: ' + result);
                }
            });
        }
    } else {
        let newAnswer = new Answer({
            questionnaireId: questionnaireId,
            questionId: questionId,
            submitId: submitId,
            type: type,
            answer: answer
        });
        newAnswer.save((err, result) => {
            if (err) {
                throw err;
            } else {
                //console.log('add answer: ' + result);
            }
        });
    }
};

exports.deleteBatchOnQuestion = (questionnaireId, questionId) => {
    let whereStr = {questionnaireId: questionnaireId, questionId: questionId};
    Answer.remove(whereStr, (err, result) => {
        if (err) {
            throw err;
        } else {
            //console.log('remove answer: ' + result);
        }
    });
};

exports.deleteBatchOnQuestionnaire = (questionnaireId) => {
    let whereStr = {questionnaireId: questionnaireId};
    Answer.remove(whereStr, (err, result) => {
        if (err) {
            throw err;
        } else {
            //console.log('remove answer: ' + result);
        }
    });
};

exports.dataAnalysis = (req, res) => {
    Submit.aggregate([
        {
            $match: {
                questionnaireId: ObjectId(req.body.questionnaireId)
            }
        },
        {
            $group: {
                _id: null,
                count: {$sum: 1},
                start: {$min: '$submitTime'},
                end: {$max: '$submitTime'},
                avg: {$avg: '$useTime'}
            }
        },
        {
            $project: { _id: 0, count: 1, start: 1, end: 1, avg: 1}
        }
    ]).then((questionnaireResult)=>{
        if (questionnaireResult == null) {
            res.json({code: -1, msg: 'Failed'});
        } else {
            console.log(questionnaireResult);
            Answer.aggregate([
                {
                    $match: {
                        questionnaireId: ObjectId(req.body.questionnaireId)
                    }
                },
                {
                    $group: {
                        _id: {questionId: '$questionId', type: '$type'},
                        total: {$sum: 1},
                        sum: {$sum: '$answer'},
                        avg: {$avg: '$answer'},
                        max: {$max: '$answer'},
                        min: {$min: '$answer'},
                    }
                },
                {
                    $project: {
                        _id: 0,
                        questionId: '$_id.questionId',
                        type: '$_id.type',
                        total: 1,
                        sum: 1,
                        avg: 1,
                        max: 1,
                        min: 1
                    }
                }
            ]).then((questionResult)=>{
                if (questionResult == null) {
                    res.json({code: -1, msg: 'Failed'});
                } else {
                    Answer.aggregate([
                        {
                            $match: {
                                questionnaireId: ObjectId(req.body.questionnaireId)
                            }
                        },
                        {
                            $group: {
                                _id: {questionId: '$questionId', type: '$type', answer: '$answer'},
                                count: {$sum: 1},
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                questionId: '$_id.questionId',
                                type: '$_id.type',
                                answer: '$_id.answer',
                                count: 1
                            }
                        }
                    ]).then((answerResult)=>{
                        if (answerResult == null) {
                            res.json({code: -1, msg: 'Failed'});
                        } else {
                            let whereStr = {questionnaireId: req.body.questionnaireId};
                            Question.find(whereStr, (err, result)=>{
                                if (err) {
                                    res.json({code: -1, msg: 'Failed'});
                                } else {
                                    let detail = {};
                                    /*------------------------------------------------------------------*/

                                    for (let question of result) {
                                        detail[question._id] = {
                                            title: question.title,
                                            type: question.type,
                                            optionResult: {},
                                            textResult: [],
                                            numberResult: null
                                        };
                                        if (question.type === 'radio' || question.type === 'checkbox') {
                                            for (let option of question.options) {
                                                detail[question._id].optionResult[option._id] = {
                                                    option: option.title,
                                                    count: 0,
                                                    percent: 0
                                                };
                                            }
                                        }
                                    }
                                    for (let item of questionResult) {
                                        if (item.type === 'number' || item.type === 'rate') {
                                            detail[item.questionId].numberResult = {
                                                total: item.total == null ? 0 : (item.total).toFixed(3),
                                                sum: item.sum == null ? 0 : (item.sum).toFixed(3),
                                                avg: item.avg == null ? 0 : (item.avg).toFixed(3),
                                                max: item.max == null ? 0 : (item.max).toFixed(3),
                                                min: item.min == null ? 0 : (item.min).toFixed(3)
                                            };
                                        } else {
                                            detail[item.questionId].numberResult = {
                                                total: item.total == null ? 0 : (item.total).toFixed(3),
                                                sum: 0, avg: 0, max: 0, min: 0
                                            };
                                        }
                                    }

                                    for (let item of answerResult) {
                                        if (item.type === 'radio' || item.type === 'checkbox') {
                                            detail[item.questionId].optionResult[item.answer].count = item.count;
                                            if (detail[item.questionId].numberResult.total !== 0) {
                                                detail[item.questionId].optionResult[item.answer].percent = `${(item.count * 100 / detail[item.questionId].numberResult.total).toFixed(2)}%`;
                                            } else {
                                                detail[item.questionId].optionResult[item.answer].percent = '0.00%';
                                            }
                                        }
                                        if (item.type === 'text') {
                                            detail[item.questionId].textResult.push({
                                                context: item.answer
                                            });
                                        }
                                    }

                                    for (let question of result) {
                                        if (question.type === 'radio' || question.type === 'checkbox') {
                                            detail[question._id].optionResult = toArray(detail[question._id].optionResult);
                                        }
                                    }
                                    /*------------------------------------------------------------------*/
                                    res.json({code: 0, detail: detail, outline: questionnaireResult});
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

function toArray(dict) {
    let arr = [];
    for (let key in dict) {
        arr.push(dict[key]);
    }
    return arr;
}
