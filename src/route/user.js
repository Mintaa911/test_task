const express = require('express')
const router = express.Router()

const { 
    findById,
    updateUser,
    subscribePayment,
    getUsers
 } = require('../controller/user')
const { checkUserRole } = require('../middleware/protected')

router.get('/',checkUserRole,getUsers)
router.get('/:id', findById)
router.put('/:id',updateUser)

router.post('/subscribe/:id',subscribePayment)

module.exports  = router
