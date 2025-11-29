import mongoose from "mongoose";
import bcrypt from "bcryptjs";


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
        bio:{
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

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password  = await bcrypt.hash(this.password, 12)
    }
})

userSchema.methods.generateAuthToken = () => {

}

const userModel = mongoose.model("User", userSchema);
export default userModel