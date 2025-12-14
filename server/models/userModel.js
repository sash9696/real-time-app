import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


//name, email, password, bio, profilePic, contacts, timestamps

const userSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true
        },
        bio:{
            type: String,
            default: 'Available'
        },
        profilePic:{
            type: String,
            default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
        contacts:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        timestamps:true
    }
)

userSchema.pre("save", async function(){
    if(this.isModified("password")){
        this.password  = await bcrypt.hash(this.password, 12)
    }
    // No need to call next() in async pre hooks - Mongoose handles it automatically
})

userSchema.methods.generateAuthToken = async function(){
    try {
        let token = jwt.sign(
            {id: this._id, email:this.email},
            process.env.SECRET,
            {expiresIn: "24h"}
        );
        return token;
        
    } catch (error) {
        console.log(`Error creating token`)
    }

}

const userModel = mongoose.model("User", userSchema);
export default userModel