const express = require('express');
const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    author : {
        type: String,
        require : true
    } , 
    title : {
        type : String,
        require : true
    },
    price : {
        type : Number,
        minimum : 0,
    } ,
    quantity : {
        type : Number,
        require : true,
        minimum : 0,
    }   

})

module.exports = new mongoose.model("Book" , BookSchema)