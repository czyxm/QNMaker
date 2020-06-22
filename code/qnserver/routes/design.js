var express = require('express');
var router = express.Router();
var user = require('../controller/user.controller');
var questionnaire = require('../controller/questionnaire.controller');
var question = require('../controller/question.controller');
const answer = require('../controller/answer.controller');

router.post('/', function(req, res, next) {
  console.log(req.body);
  switch (req.body.opera_type) {
    //User
    case 'register': console.log('register'); user.create(req, res); break;
    case 'login': console.log('login'); user.login(req, res); break;
    case 'loginCheck': console.log('login check'); user.loginCheck(req, res); break;
    default:
      if (req.body.username != null) {
        switch (req.body.opera_type) {
          case 'exit': console.log('exit'); user.exit(req, res); break;
          //Questionnaire
          case 'addQuestionnaire': console.log('addQuestionnaire'); questionnaire.add(req, res); break;
          case 'getQuestionnaireList': console.log('getQuestionnaireList'); questionnaire.getList(req, res); break;
          case 'deleteQuestionnaire': console.log('deleteQuestionnaire'); questionnaire.delete(req, res); break;
          case 'publishQuestionnaire': questionnaire.publish(req, res); break;
          //Question
          case 'addQuestion': console.log('addQuestion'); question.add(req, res); break;
          case 'getQuestionList': console.log('getQuestionList'); question.getList(req, res); break;
          case 'deleteQuestion': console.log('deleteQuestion'); question.delete(req, res); break;
          //Data Analysis
          case 'dataAnalysis': console.log('dataAnalysis'); answer.dataAnalysis(req, res); break;
          default: res.json({code: -7, msg: 'Invalid Request'}); break;
        }
      } else {
        res.json({code: -3, msg: 'Need params'});
      }
      break;
  }
});

module.exports = router;
