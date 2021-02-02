const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");


const userSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required:true
    },
    lastname : {
        type : String,
        required :true 
    },
    email : {
        type : String,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email");
            }
        }
    },
    username : {
        type : String,
        required:true,
        unique: true
    },
    phone : {
        type : Number,
        required : true 
    },
    password : {
        type : String,
        required : true
    },
    confirmpassword : {
        type : String,
        required : true
    },
    age : {
        type : Number,
        required :true
    },
    gender : {
        type : String,
        required : true
    }
})


const Regform = new mongoose.model("Regform" , userSchema);
module.exports = Regform;