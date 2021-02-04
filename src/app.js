const express = require("express");
const path = require("path");
const hbs = require("hbs");
const app = express();

require("./db/conn");
const Regform = require("./models/users");


const port = process.env.PORT || 8000


// STARTING HBS ENGINE TEMPLATE
const static_Path = path.join(__dirname , "../public")
const templates_Path = path.join(__dirname , "../templates/views")
const partials_Path = path.join(__dirname , "../templates/partials")

app.use(express.urlencoded({extended : false}));


app.use(express.static(static_Path))
app.set("view engine" , "hbs");
app.set("views" ,templates_Path );
hbs.registerPartials(partials_Path);



app.get("/" , async(req,res)=>{
    res.render("index");
})
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
app.post("/login" , async (req,res) =>{
    try{
        const username = req.body.username;
        const password = req.body.password;
    
    const userLogin = await Regform.findOne({username});
    
    if(userLogin.password == password){
        res.status(200).render("login" , {
            name : userLogin.firstname,
        });
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



// BCRYPT PASSWORD

const bcrypt = require("bcryptjs");

const securePassword =  async (password)=>{
    const passwordHash = await bcrypt.hash(password , 10);
    console.log(passwordHash);
    const passwordCompare = await bcrypt.compare(password , passwordHash);
    console.log(passwordCompare);
}

securePassword("amrit@123");

app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`)
})

