const express = require('express');
const router = express.Router();
const User = require('../controller/User')
const Token = require('../controller/RefreshToken')

router.get('/getuser', Token.Refreshtoken, User.GetUsers)
router.get('/workout/:id',Token.Refreshtoken, User.GetOneUser)
router.post('/' ,User.CreateUser)
router.post('/login', User.Login)
router.patch('/password/:id', Token.Refreshtoken,  User.updateUserPassword )
router.patch('/detail/:id', Token.Refreshtoken , User.updateUserDetail )
router.delete('/',  )

module.exports = router;   
