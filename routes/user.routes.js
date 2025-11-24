const express = require("express")
const { signUp, login, getUser, verify } = require("../controllers/user.controller")


const router = express.Router()


router.post('/signUp', signUp)

router.post('/login',login )

router.get('/get-user/:id',verify ,getUser)



module.exports= router