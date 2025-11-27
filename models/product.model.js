const mongoose = require('mongoose')


const ProductSchema=mongoose.Schema({
    productName:{type:String, required:true},
    productPrice:{type:Number, required:true},
    productImage:{type:String}
})


const ProductModel= mongoose.model('product', ProductSchema)


module.exports = ProductModel