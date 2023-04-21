const express = require('express');
const router =express.Router();
const Token = require('../controller/RefreshToken');

router.post('/refresh', Token.Refreshtoken)

module.exports = router;