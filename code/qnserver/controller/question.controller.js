const answer = require('../controller/answer.controller');
const Answer = require('../models/answer.model');
const Question = require('../models/question.model');
const Questionnaire = require('../models/questionnaire.model');

function getDefaultValue(type) {
    if (type === 'checkbox') {
        return [];
    } else {
        return null;
    }
};

exports.add = (req, res) => {
    if (req.body.questionnaireId == null) {
        res.json({code: -3, msg: 'Void questionnaire'});
    } else if (req.body.title == null || req.body.title === '') {
        res.json({code: -3, msg: 'Void question title'});
    } else if (['radio', 'checkbox', 'text', 'number', 'rate'].indexOf(req.body.type) < 0) {
        res.json({code: -3, msg: 'Invalid type'});
    } else {
        if (req.body.questionId == null) {
            let newQuestion = new Question({
                questionnaireId: req.body.questionnaireId,
                title: req.body.title,
                type: req.body.type,
                numberType: req.body.numberType,
                row: req.body.row,
                must: req.body.must,
                options: req.body.options,
                answer: getDefaultValue(req.body.type)
            });
            newQuestion.save((err, result) => {
                if (err) {
                    res.json({code: -4, msg: 'Failed'});
                } else {
                    res.json({code: 0, msg: 'Success', _id: result._id});
                }
            });
        } else {
            let whereStr = {questionnaireId: req.body.questionnaireId, _id: req.body.questionId};
            let updateStr = {
                title: req.body.title,
                type: req.body.type,
                numberType: req.body.numberType,
                row: req.body.row,
                must: req.body.must,
                options: req.body.options,
                answer: getDefaultValue(req.body.type)
            };
            Question.update(whereStr, updateStr, (err, result) => {
                if (err) {
                    res.json({code: -4, msg: 'Failed'});
                } else {
                    res.json({code: 0, msg: 'Success', _id: result._id});
                }
            });
        }
    }
};

exports.getList = (req, res) => {
    let whereStr = {_id: req.body.questionnaireId};
    let filterStr = {username: 1};
    Questionnaire.findOne(whereStr, filterStr, (err, result) => {
        if (err) {
            res.json({code: -4, msg: 'Failed'});
        } else if (result == null) {
            res.json({code: -4, msg: 'Void question list'});
        } else if (result.username !== req.body.username){
            res.json({code: -6, msg: 'No permissions'});
        } else {
            whereStr = {questionnaireId: req.body.questionnaireId};
            Question.find(whereStr, (err, result) => {
                if (err) {
                    res.json({code: -4, msg: 'Failed'});
                } else {
                    res.json({code: 0, msg: 'Success', detail: result});
                }
            });
        }
    });
};

exports.fetch = (req, res) => {
    let whereStr = {_id: req.body.questionnaireId};
    let filterStr = {_id: 0};
    Questionnaire.findOne(whereStr, filterStr, (err, result1) => {
        if (err) {
            res.json({code: -4, msg: 'Failed'});
        } else if (result1 == null) {
            res.json({code: -4, msg: 'Void question list'});
        } else if (result1.username !== req.body.username && result1.status === 0){
            res.json({code: -6, msg: 'No permissions'});
        } else {
            whereStr = {questionnaireId: req.body.questionnaireId};
            Question.find(whereStr, (err, result2) => {
                if (err) {
                    res.json({code: -4, msg: 'Failed'});
                } else {
                    res.json({code: 0, msg: 'Success', title: result1.title, description: result1.description, detail: result2});
                }
            });
        }
    });
};

exports.delete = (req, res) => {
    let whereStr = {_id: req.body.questionnaireId};
    let filterStr = {username: 1};
    Questionnaire.findOne(whereStr, filterStr, (err, result) => {
        if (err) {
            res.json({code: -4, msg: 'Failed'});
        } else if (result == null) {
            res.json({code: -4, msg: 'Void question list'});
        } else if (result.username !== req.body.username){
            res.json({code: -6, msg: 'No permissions'});
        } else {
            try {
                //delete the answers first
                answer.deleteBatchOnQuestion(req.body.questionnaireId, req.body.questionId);
                //delete the question
                whereStr = {questionnaireId: req.body.questionnaireId, _id: req.body.questionId};
                Question.remove(whereStr, (err, result) => {
                    if (err) {
                        res.json({code: -4, msg: 'Failed'});
                    } else {
                        res.json({code: 0, msg: 'Success'});
                    }
                });
            } catch (e) {
                res.json({code: -4, msg: 'Failed' + e});
            }
        }
    });
};

exports.deleteBatch = (questionnaireId) => {
    //delete the answers first
    answer.deleteBatchOnQuestionnaire(questionnaireId);
    //delete the questions
    let whereStr = {questionnaireId: questionnaireId};
    Question.remove(whereStr, (err, result) => {
        if (err) {
            throw err;
        } else {
            console.log('delete question batch');
        }
    });
};
