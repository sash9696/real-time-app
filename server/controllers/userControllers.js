import user from '../models/userModel.js'
import bcrypt from 'bcryptjs'

export const register = async (req, res) => {

    console.log("reqbody", req.body)

    const {firstname, lastname, email, password} = req.body

    try {
        //check if the email alredy exists in the mongo db
        const existingUser = await user.findOne({email:email});

        if(existingUser){
            return res.status(400).json({error: 'User already exists'})
        }

        const fullName = `${firstname} ${lastname}`
        const newUser = new user({email,password, name:fullName})
        await newUser.save();
        res.json({message:'success'})
        
    } catch (error) {
        console.log(`Error in registering user: `, error)
    }
}


export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const validUser = await user.findOne({email:email})
        //if user exists
        if(!validUser){
            return res.status(404).json({error:"User does not exist"})
        }
       //if its a valid password
        const validPassword = await bcrypt.compare(password, validUser.password);
        if(!validPassword){
            return res.status(401).json({error:"Invalid credentials"})
        }
        res.status(200).json({status:200})
    } catch (error) {
        res.status(500).json({error})
    }
}