import mongoose, { Schema } from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const captainSchema = new Schema({
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
    status :{
        type : String,
        enum : ['active','inactive'],
        default : 'inactive',
    },
    vehicle :{
        color :{
            type : String,
            required : true,
            minlength : [3,'color must be 3 char long'],
        },
        plate :{
            type : String,
            required : true,
            minlength : [3,'plate must be at least 3 char long'],
        },
        capacity :{
            type : Number,
            required : true,
            min : [1 , "capacity must be min of 1 length"],
        },
        vehicleType : {
            type : String,
            required : true,
            enum : ['car','motorcycle','auto'],
        },
        location :{
            lat :{
                type : Number,
            },
            lng : {
                type : Number,
            }
        }
    }
}, { timestamps: true });

// Hash password before saving
captainSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
// Check if password is correct
captainSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};
// Generate access token
captainSchema.methods.generateAccessToken = function () {
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
captainSchema.methods.generateRefreshToken = function () {
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
export const Captain = mongoose.model("Captain", captainSchema);
