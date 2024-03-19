import express from "express"
import cors from "cors"
import mysql2 from "mysql2"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import cookieParser from "cookie-parser"
import session from "express-session"
import {check , validationResult} from "express-validator"

const salt = 10
const app = express();
app.use(express.json())

app.use(cors({
    origin:["http://localhost:3000"],
    methods: ["POST","GET","PUT","DELETE"],
    credentials: true
}))
app.use(cookieParser())
app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:false,
    cookie:{
        secure:false,
        maxAge:1000*60*60*24
    }
}))


const db = mysql2.createConnection({
    host : "localhost",
    user : "root",
    password : "jemini@#123",
    database : "stock_management"
})

const verifyUser = (req,res,next) =>{
    const {token} = req.cookies
    if(!token){
        return res.json({Error:"You are not authenticated"})
    }else{
        jwt.verify(token,"jwt-secret-key",(err,decoded)=>{
            if(err){
                return res.json({Error:"Token is not ok"})
            }else{
                req.name = decoded.name
                next()
                // console.log(req.name)
            }
        })
    }
}

app.get("/", verifyUser, (req, res) => {
    // console.log("I am in home page")
    const q = "SELECT product_id, product_name, price, quantity, total_amount FROM inventory";
    db.query(q, (err, result) => {
        if (err) {
            return res.status(500).json({ Message: "Error inside server" });
        }
        return res.status(200).json({ Status: "success", name: req.name, inventory: result });
    });
});

app.post('/register',(req,res)=>{
    const q="INSERT INTO login (`name`,`email`,`password`) VALUES (?)"

// sourcery skip: avoid-using-var
    var myPlaintextPassword=req.body.password 

        const hash = bcrypt.hash(myPlaintextPassword.toString(), salt,(err,hash)=>{
            if (err) {
                return res.json({Error:"Error for hashing password"});
            }
                const values = [
                req.body.name,
                req.body.email,
                hash
            ]
            db.query(q,[values],(err,result)=>{
                if (err) {
                    return res.json({Error:"inserting error"})
                }
                return res.json({Status:"success"})
                })
        })
        
    })

    app.post("/login",[
        check("email","Email length error").isEmail().isLength({min:10,max:30}),
        check("password","Password length 8-10").isLength({min:8,max:10})
    ],(req,res)=>{
        const q = "SELECT * FROM login WHERE email = ?";
        db.query(q,[req.body.email],(err,data)=>{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.json(errors)
            }else{
            if (err) {
                return res.json({Error:"login error"});
            }
            if(data.length>0){
                bcrypt.compare(req.body.password.toString(),data[0].password,(err,response)=>{
                    if (err) {
                        return res.json({Error: "password error"})
                    }
                    if(response){
                        const {name} = data[0];
                        const token = jwt.sign({name},"jwt-secret-key",{expiresIn:"1d"})//should be env file and 32 char for security purpose
                        // console.log(token)
                        res.cookie('token',token);
                        req.session.name = data[0].name;
                        return res.json({Status:"success",name : req.session.name});
                    }else{
                        return res.json({Error:"Password not matched"});
                    }
                })
            }else{
                return res.json({Error:"No email existed"})
            }
            
    }})
    })
        
    app.get('/logout',(req,res)=>{
        res.clearCookie('token');
        return res.json({Status:"success"})
    })

// app.get("/",(req,res)=>{
//     const q = "SELECT product_id,product_name,price,quantity,total_amount FROM inventory";
//     db.query(q,(err,result)=>{
//         if(err) return res.json({Message:"Error inside server"});
//         return res.json(result);
//     })
// })

app.post("/create",(req,res)=>{
    const q = "INSERT INTO inventory (`product_name`,`category`,`price`,`quantity`,`total_amount`) VALUES (?)";
    const values = [
        req.body.product_name,
        req.body.category,
        req.body.price,
        req.body.quantity,
        req.body.total_amount,
    ]
    db.query(q,[values],(err,result)=>{
        if (err) {
            return res.json({Message:"Error inside server"});
        }
        return res.json(result);
    })
})

app.get("/read/:product_id",(req,res)=>{
    const q = "SELECT * FROM inventory WHERE product_id = ?";
    const id = req.params.product_id;

    db.query(q,[id],(err,result)=>{
        if (err) {
            return res.json({Message:"Error inside server"});
        }
        return res.json(result);
    })
})

app.put('/edit/:product_id',(req,res)=>{
    const q = "UPDATE inventory SET `product_name`=?,`category`=?,`price`=?,`quantity`=?,`total_amount`=? WHERE product_id=?";
    const {id} = req.params.product_id;
    db.query(q,[req.body.product_name,
        req.body.category,
        req.body.price,
        req.body.quantity,
        req.body.total_amount,,id],(err,result) => {
        if (err) {
            return res.json({Message:"Error inside server"});
        }
        
        return res.json(result);
        
    })
})

app.delete("/delete/:id",(req,res)=>{
    const q = "DELETE FROM inventory WHERE product_id = ?";
    const {id} = req.params;

    db.query(q,[id],(err,result) => {
        if (err) {
            return res.json({Message:"Error inside server"});
        }
        return res.json(result);
    })
})


app.listen(8082,()=>{
    console.log("listening")});