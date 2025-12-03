const express = require('express')
const { verify } = require('../controllers/user.controller')
const { addProduct } = require('../controllers/product.controller')

const router = express.Router()

router.post('/addProduct', verify, addProduct)


module.exports= router;
