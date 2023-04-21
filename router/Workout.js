const express = require('express');
const Control = require('../controller/Workout')
const Token = require('../controller/RefreshToken')

const router = express.Router()

router.get('/',Token.Refreshtoken,Control.GetWorkOut)
router.get('/user/workout/:id',Token.Refreshtoken, Control.GetUserWorkOut)
router.get('/workout/:id', Token.Refreshtoken, Control.GetEachWorkOut)
router.post('/', Token.Refreshtoken, Control.CreateWorkOut)
router.patch('/:id', Token.Refreshtoken, Control.UpdateWorkOut)
router.delete('/:id', Token.Refreshtoken, Control.DeleteWorkOut)

module.exports = router;