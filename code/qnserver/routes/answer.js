var express = require('express');
var router = express.Router();

var question = require('../controller/question.controller');
var submit = require('../controller/submit.controller');

router.post('/', function(req, res, next) {
    switch (req.body.opera_type) {
        case 'fetch': console.log('fetch'); question.fetch(req, res); break;
        case 'checkPermission': console.log('checkPermission'); submit.checkPermission(req, res); break;
        case 'submit': console.log('submit'); submit.submit(req, res); break;
        default: break;
    }
});

module.exports = router;
