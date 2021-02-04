require("dotenv").config()  //always at the top and then create route directory 
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const auth = require("./middleware/auth");

require("./db/conn");
const Regform = require("./models/users");


const port = process.env.PORT || 8000


// STARTING HBS ENGINE TEMPLATE
const static_Path = path.join(__dirname , "../public")
const templates_Path = path.join(__dirname , "../templates/views")
const partials_Path = path.join(__dirname , "../templates/partials")

app.use(express.urlencoded({extended : false}));
app.use(cookieParser());

app.use(express.static(static_Path))
app.set("view engine" , "hbs");
app.set("views" ,templates_Path );
hbs.registerPartials(partials_Path);

// console.log(process.env.SECRET);

// get homepage
app.get("/" , async(req,res)=>{
    res.render("index");
})
app.get("/secret" , auth ,(req,res) => {
    console.log(`this is cookies awesome : ${req.cookies.jwt}`);
    res.render("secret");
})
app.get("/logout" , auth , async(req,res) =>{
    try {
        // console.log(req.user);

        // by this code we delete token from database (most recent token)
        // req.user.tokens = req.user.tokens.filter((currentElement) =>{
        //     return currentElement.token != req.token
        // })

        // logout from all devices
        req.user.tokens = [];

        // simple logout
        res.clearCookie("jwt");
        console.log("Logout........");

        await req.user.save();
        res.render("login");
    } catch (error) {
        res.status(500).send(error);
    }
})

// registering data
app.post("/register" , async(req,res)=>{
    try {
        
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if(password == cpassword){

            const registerEmployee = new Regform({
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                email : req.body.email,
                username : req.body.username,
                phone : req.body.phone,
                password : req.body.password,
                confirmpassword : req.body.confirmpassword,
                age : req.body.age,
                gender : req.body.gender
            })
            const token = await registerEmployee.generateAuthToken();
            console.log("the token part " + token);

       //res.cookies() function is used to set the cokies name to value.
       //the value parameter may be a string or object converted to json
       
       res.cookie("jwt" , token , {
           expires : new Date(Date.now() + 30000),
           httpOnly : true
       })
       const insertData = await registerEmployee.save();
       res.status(200).render("register" , {
         succes : "Succesfully Registerd",
        });
        }else{
            res.render("register" ,{
                danger : "Password is Not Matching",
            });
        }

    } catch (error) {
         res.status(404).send(error);
    }
})
app.get("/register" , async(req,res)=>{
    res.render("register");
})
// login match details
app.post("/login" , async (req,res) =>{
    try{
        const username = req.body.username;
        const password = req.body.password;
        const userLogin = await Regform.findOne({username});
    
    // password comparsion  by bcrypt
    const hashPass = await bcrypt.compare(password , userLogin.password);
    console.log(hashPass);

    // JWT CREATE TOKEN USING LOGIN
    const token = await userLogin.generateAuthToken();
    console.log("the token part " + token);

    // SEND COOKIES 
    res.cookie("jwt" , token , {
        expires : new Date(Date.now() + 100000),
        httpOnly : true,
        // secure :true use when https use
    })
    
    if(hashPass){
        res.status(200).render("secret");
    }else{
        res.send("Invalid User-Details");
    }
}catch(error){
    res.status(400).send("invalid User")
}


})



app.get("/login" , async(req,res)=>{
    res.render("login");
})




app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`)
})
























// BCRYPT PASSWORD - General Usage



// const securePassword =  async (password)=>{
//     const passwordHash = await bcrypt.hash(password , 10);
//     console.log(passwordHash);
//     const passwordCompare = await bcrypt.compare(password , passwordHash);
//     console.log(passwordCompare);
// }
// securePassword("amrit@123");






// // JWT USER AUTHENTICALTION

// const jwt = require("jsonwebtoken");

// const createToken = async()=>{
//     // creating token
//     const token = await jwt.sign({_id :" 601bb19c9e613941c810602d"} , "mynameisamritrajmyyoutubechannelisinfoskillx" , {
//         expiresIn : "2 seconds"
//     });
//     console.log(token);
// // verifing user
//     const userVr = await jwt.verify(token , "mynameisamritrajmyyoutubechannelisinfoskillx");
//     console.log(userVr);
// }

// createToken();

