const Questionnaire = require('../models/questionnaire.model');
const question = require('../controller/question.controller');

exports.add = (req, res) => {
    if (req.body.title != null && req.body.title !== '') {
        if (req.body._id == null) {
            let newQuestionnaire = new Questionnaire({
                title: req.body.title,
                description: req.body.description,
                username: req.body.username,
                onlyRegister: req.body.onlyRegister,
                eachIpUpperBound: req.body.eachIpUpperBound,
                eachDay: req.body.eachDay
            });
            newQuestionnaire.save((err, result) => {
                if (err) {
                    res.json({code: -4, msg: 'Failed'});
                } else {
                    res.json({code: 0, msg: 'Success', _id: result._id});
                }
            });
        } else {
            let whereStr = {_id: req.body._id};
            let updateStr = {
                title: req.body.title,
                description: req.body.description,
                onlyRegister: req.body.onlyRegister,
                eachIpUpperBound: req.body.eachIpUpperBound,
                eachDay: req.body.eachDay
            };
            Questionnaire.update(whereStr, updateStr, (err, result) => {
                if (err) {
                    res.json({code: -4, msg: 'Failed'});
                } else {
                    res.json({code: 0, msg: 'Success', _id: result._id});
                }
            });
        }
    } else {
        res.json({code: -3, msg: 'Void questionnaire title'});
    }
};

exports.getList = (req, res) => {
    let whereStr = {username: req.body.username};
    Questionnaire.find(whereStr, (err, result) => {
        if (err) {
            res.json({code: -4, msg: 'Failed'});
        } else {
            res.json({code: 0, msg: 'Success', detail: result});
        }
    });
};

exports.delete = (req, res) => {
    let whereStr = {_id: req.body._id};
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
                question.deleteBatch(req.body._id);
                let whereStr = {username: req.body.username, _id: req.body._id};
                Questionnaire.remove(whereStr, (err, result) => {
                    if (err) {
                        res.json({code: -4, msg: 'Failed'});
                    } else {
                        res.json({code: 0, msg: 'Success'});
                    }
                });
            } catch (e) {
                res.json({code: -4, msg: 'Failed ' + e});
            }
        }
    });
};

exports.publish = (req, res) => {
    if (req.body._id != null && req.body.username != null && req.body.status != null) {
        let whereStr = {_id: req.body._id};
        let filterStr = {username: 1};
        Questionnaire.findOne(whereStr, filterStr, (err, result) => {
            if (err) {
                res.json({code: -4, msg: 'Failed'});
            } else if (result == null) {
                res.json({code: -4, msg: 'Void questionnaire'});
            } else if (result.username !== req.body.username){
                res.json({code: -6, msg: 'No permissions'});
            } else {
                let updateStr = {status: req.body.status};
                Questionnaire.update(whereStr, updateStr, (err, result) => {
                    if (err) {
                        res.json({code: -4, msg: 'Failed'});
                    } else {
                        res.json({code: 0, msg: 'Success'});
                    }
                });
            }
        });
    } else {
        res.json({code: -3, msg: 'void questionnaire id or username or status'});
    }
};
