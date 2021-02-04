const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    },
    tokens : [{
        token : {
            type:String,
            required:true
        }
    }]
})
// niche ka code ko middleware kah sakte hai methods use krenge to instance ke sath work krenge yani schema ke sath

// yaha token create kiya ja rha hai using jwt
userSchema.methods.generateAuthToken = async function(){
    try {
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()} , process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token}) //token add ho jayega database par
        await this.save();
        return token;
    } catch (error) {
        res.send("the error part " + error);
        console.log("the error part " + error);
    }
}


// save method call se pahle ye function call krna hai jisme password ko hash karna hai or phir next() taki uske aage ka kaam kar sake.....
userSchema.pre("save" ,async function(next) {
    if(this.isModified("password")){
        this.password =await bcrypt.hash(this.password , 10);
        this.confirmpassword = await bcrypt.hash(this.confirmpassword , 10);
        // is code se confirmpassword add nhe hoga
    }
    next();
})


const Regform = new mongoose.model("Regform" , userSchema);
module.exports = Regform;