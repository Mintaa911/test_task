const express = require('express')
const router = express.Router()

const {
    register,
    login,
    changePassword,
    forgotPassword
} = require('../controller/auth')

router.post('/register', register)
router.post('/login',login)

router.post('/forgot-password',forgotPassword)
router.post('/change-password',changePassword)

module.exports  = router
