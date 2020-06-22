const User = require('../models/user.model');

exports.create = (req, res) => {
    let user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    });
    user.save(function (err, result) {
        if (err) {
            res.json({code: 1});
        } else {
            res.json({code: 0});
            console.log('Create User: ' + result);
        }
    });
};

exports.login = (req, res) => {
    User.findOne({username: req.body.username}, {password: 1, status: 1, _id: 0}, function (err, result) {
        if (result == null) {
            res.json({code: -5, msg: 'Not exists'});
        } else if (req.body.password !== result.password) {
            res.json({code: -3, msg: 'Invalid password'});
        } else if (result.status == 1) {
            res.json({code: -1, msg: 'Banned user'});
        } else {
            req.session.username = req.body.username;
            res.json({code: 0, msg: 'Success'});
        }
    });
};

exports.loginCheck = (req, res) => {
    try {
        let username = req.session.username;
        if (username == null) {
            res.json({code: 404, msg: 'No login'});
        } else {
            res.json({code: 0, msg: 'Success', username: username});
        }
    } catch (e) {
        res.json({code: -4, msg: 'Failed'});
    }
};

exports.exit = (req, res) => {
    try {
        delete req.session.username;
        res.json({code: 0, msg: 'Success'});
    } catch (e) {
        res.json({code: -4, msg: 'Failed'});
    }
};
