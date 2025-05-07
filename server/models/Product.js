const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    name:{type:String,required:true,unique:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    stock:{type:Number,required:true},
    category:{
        type:mongoose.Schema.ObjectId,
        ref:'Category',
        required: true

    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
      },


})
module.exports = mongoose.model('Product',productSchema)
