import mongoose, { Schema } from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    fullname: { 
        firstname :{
            type : String,
            required : true,
            minlength : [3,'first name must be at least 3 char long'],
        },
        lastname :{
            type : String,
            minlength : [3,'last name must be at least 3 char long'],
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    avatar: {
        type: String, // Cloudinary URL
        default:"",
    },
    mobile_no:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^[0-9]{10}$/, "Mobile number must be 10 digits"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        
    },
    socketId :{
        type : String,
    },
    refreshToken: {
        type: String,
    },
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


// Check if password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};


// Generate access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: this.fullname,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);
