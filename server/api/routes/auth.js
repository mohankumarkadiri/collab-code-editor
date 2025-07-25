require('dotenv').config();
const express = require('express');
const passport = require('passport');


const router = express.Router();

router.delete('/logout', (req, res, next) => {
    try {
        req.logout((err) => {
            if (err) {
                return res.status(500).send({ message: err });
            }
        });
        return res.status(200).send('Logged Out Successfully!!!');
    } catch (err) {
        return res.status(500).send({ message: err });
    }
});

router.get('/google', passport.authenticate('google', {
    prompt: ['select_account'],
    scope: ['openid', 'email', 'profile']
}));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/auth/unauthorized',
    failureMessage: true
}), (_, res) => {
    res.redirect(`${process.env.UI_BASE_URL}/`);
});

router.get('/unauthorized', (req, res) => {
    const errorMessage = req.session.messages ? req?.session?.messages[0] : null;
    req.session.messages = [];
    return res.status(403).send(errorMessage || 'You are not authorized to access this website.');
});


module.exports = router;