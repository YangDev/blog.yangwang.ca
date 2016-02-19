var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var config = require('../config');
var router = express.Router();

mongoose.connect(config.connection + 'users');

mongoose.connection.on('error', (err) => {
    console.log(err);
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

var signup = function (req, res, next) {

    var user = new User({ username: req.body.username, password: req.body.password });

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            user.save((err, result) => {
                if (!err) {
                    req.session.auth = true;
                    req.session.username = result.username;
                    req.session.uerid = result.id;
                    res.status(200).send({ username: result.username, userid: result.id });
                } else {
                    console.log(err.code);
                    if (err.code == 11000) {
                        res.status(403).send("username taken");
                    } else {
                        res.sendStatus(500);
                    }
                }
            });
        });
    });


}

function signin(req, res, next) {
    var user = new User({ username: req.body.username, password: req.body.password });

    console.log(user);
    if (req.session.auth === true) {
        req.session.auth = false;
        req.session.username = undefined;
        req.session.userid = undefined;
        res.status(202).send("signed out");
        return;
    }
    User.findOne({ username: user.username }, (err, result) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        if (result) {
            bcrypt.compare(user.password, result.password, (err, result) => {
                if (result) {
                    req.session.auth = true;
                    req.session.username = user.username;
                    req.session.userid = result.id;
                    res.status(200).send({ username: result.username, userid: result.id });
                } else {
                    res.status(403).send("invalid password");
                }
            });
        } else {
            res.status(403).send("user not exists");
        }
    });
}

function isSignedin(req, res, next) {
    if (req.session.auth) {
        console.log( req.session.username);
        res.status(200).send({ username: req.session.username, userid: req.session.id, auth: req.session.auth });
    } else {
        res.status(202).send({ username: "", userid: "", auth: req.session.auth });
    }
}

router.post('/', signup);

router.put('/', signin);

router.get('/', isSignedin);

module.exports = router;