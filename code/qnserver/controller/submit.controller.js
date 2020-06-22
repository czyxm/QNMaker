const Submit = require('../models/submit.model');
const Questionnaire = require('../models/questionnaire.model');
const User = require('../models/user.model');
const answer = require('../controller/answer.controller');

exports.checkPermission = (req, res) => {
    if (req.body.questionnaireId) {
        let whereStr = {_id: req.body.questionnaireId};
        let filterStr = {
            _id: 1,
            status: 1,
            onlyRegister: 1,
            eachIpUpperBound: 1,
            eachDay: 1
        };
        Questionnaire.findOne(whereStr, filterStr, (err, result1) => {
            if (err || result1 == null) {
                res.json({code: -10, msg: 'No such a qn'});
            } else if (result1.status === 0) {
                res.json({code: -8, msg: 'Not published'});
            } else {
                if (result1.onlyRegister === true) {
                    User.findOne({username: req.session.username}, function (err, result2) {
                        if (err || result2 == null) {
                            res.json({code: -6, msg: 'You must login first'});
                        } else if (result2.status === 1) {
                            res.json({code: -1, msg: 'Banned user'});
                        } else {
                            console.log(req.session.username);
                            res.json({code: 0, msg: 'Effective permission'});
                        }
                    });
                } else {
                    if (result1.eachDay === true) {
                        whereStr = {questionnaireId: req.body.questionnaireId, submitIp: req.ip, submitTime: {$gt: Date.now()}};
                    } else {
                        whereStr = {questionnaireId: req.body.questionnaireId, submitIp: req.ip};
                    }
                    Submit.find(whereStr, (err, result3) => {
                        if (err) {
                            res.json({code: -2, msg: 'Failed'});
                        } else if (result3 != null) {
                            if (result3.length >= result1.eachIpUpperBound) {
                                res.json({code: -4, msg: 'You have achieved the submit upper bound'});
                            } else {
                                res.json({code: 0, msg: 'Effective permission'});
                            }
                        }
                    });
                }
            }
        });
    } else {
        res.json({code: -3, msg: 'Need params'});
    }
};

exports.submit = (req, res) => {
    if (req.body.questionnaireId) {
        let whereStr = {_id: req.body.questionnaireId};
        Questionnaire.findOne(whereStr, (err, result) => {
            if (err || result == null) {
                res.json({code: -10, msg: 'No such a qn'});
            } else {
                //Save submit
                let newSubmit = new Submit({
                    questionnaireId: result._id,
                    submitIp: req.ip,
                    useTime: req.body.useTime
                });
                newSubmit.save((err, result) => {
                    if (err) {
                        res.json({code: -4, msg: 'Failed'});
                    } else {
                        //Save answers
                        try {
                            for (let question of req.body.detail) {
                                answer.add(
                                    question._id,
                                    result._id,
                                    question.questionnaireId,
                                    question.type,
                                    question.answer);
                            }
                            res.json({code: 0, msg: 'Success'});
                        } catch (e) {
                            res.json({code: -4, msg: 'Failed: ' + e});
                        }
                    }
                });
            }
        });
    } else {
        res.json({code: -3, msg: 'Need params'});
    }
};
