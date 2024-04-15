// auth.js


import jwt from 'jsonwebtoken';



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
export default verifyUser

// app.get("/", verifyUser, (req, res) => {
//     // console.log("I am in home page")
//     const q = "SELECT product_id, product_name, price, quantity, total_amount FROM inventory";
//     db.query(q, (err, result) => {
//         if (err) {
//             return res.status(500).json({ Message: "Error inside server" });
//         }
//         return res.status(200).json({ Status: "success", name: req.name, inventory: result });
//     });
// });


