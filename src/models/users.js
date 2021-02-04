const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
// save method call se pahle ye function call krna hai jisme password ko hash karna hai or phir next() taki uske aage ka kaam kar sake.....
userSchema.pre("save" ,async function(next) {
    if(this.isModified("password")){
        this.password =await bcrypt.hash(this.password , 10);
        this.confirmpassword = undefined;
        // is code se confirmpassword add nhe hoga
    }
    next();
})


const Regform = new mongoose.model("Regform" , userSchema);
module.exports = Regform;