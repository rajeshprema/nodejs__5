import express from "express"


import bcrypt, { genSalt } from "bcrypt";
import { addUser, getUser } from "../Controller/user,js";

const router = express.Router();


router.post("/Signup", async (req, res) => {
    try {
       
        const salt = await bcrypt.genSalt(10);
        const user = await getUser(req.body, email);
        if (!user) {
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const hashedUser = await { ...req.body, password: hashedPassword };
            const result = await addUser(hashedUser);
            if (!result.acknowledged) {
                return res.status(404).json({ message:"Error uploading user information"});
            }
             res.status(201).json({data:hashedUser})
        }
    res.status(400).json({message:"email already exist"})
  
    
} catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error"});
  }
});

router.post("/Login", async(req, res) => {
  try {

  const user = await getUser(req.body.email)
    if (!user) {
       return res.status(404).json({message:"Invalid email or password"})
    }
    const validPassword = await bcrypt.compare(res.body.password, user.password); 
    if (!validPassword) {
     return res.status(400).json({message:'Invalid password'})
    }
    const token = generateToken(user_id)  
    
    res.send({ data: user, token:token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});