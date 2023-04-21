const express = require('express');
const router = express.Router();
const Session = require('../controller/Session')
const Token = require('../controller/RefreshToken')

router.get('/',  Token.Refreshtoken,  Session.session) 
router.get('/delete', Token.Refreshtoken, Session.destroySession)

module.exports = router;