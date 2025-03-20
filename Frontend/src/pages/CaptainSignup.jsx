import React, { useState, useEffect } from "react"; 
import { Link } from 'react-router-dom';

const CaptainSignup = () => {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        mobile_no: "",
        password: "",
        vehicleColor: "",
        vehiclePlate: "",
        vehicleCapacity: "",
        vehicleType: "car",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };
    
    const validatePassword = (password) => {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return regex.test(password);
    };
    
    const validateMobile = (mobile) => {
        // Basic mobile validation (10 digits)
        const regex = /^\d{10}$/;
        return regex.test(mobile);
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Clear error when user starts typing in a field with an error
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };
    
    const validateForm = () => {
        const newErrors = {};
        
        // Check required fields
        if (!formData.firstname.trim()) newErrors.firstname = "First name is required";
        if (!formData.lastname.trim()) newErrors.lastname = "Last name is required";
        
        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }
        
        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (!validatePassword(formData.password)) {
            newErrors.password = "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number";
        }
        
        // Mobile validation
        if (!formData.mobile_no) {
            newErrors.mobile_no = "Mobile number is required";
        } else if (!validateMobile(formData.mobile_no)) {
            newErrors.mobile_no = "Please enter a valid 10-digit mobile number";
        }
        
        // Vehicle details validation
        if (!formData.vehicleColor.trim()) newErrors.vehicleColor = "Vehicle color is required";
        if (!formData.vehiclePlate.trim()) newErrors.vehiclePlate = "Vehicle plate is required";
        if (!formData.vehicleCapacity) newErrors.vehicleCapacity = "Vehicle capacity is required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const isValid = validateForm();
        
        if (isValid) {
            console.log("Form data is valid:", formData);
            // Submit form data to API here
            // For example: submitToAPI(formData);
            
            // Reset form after successful submission if needed
            // setFormData({ firstname: "", lastname: "", ... });
        } else {
            console.log("Form has errors:", errors);
        }
        
        setIsSubmitting(false);
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <div className="w-full max-w-md">
                <form 
                    className="bg-gray-800 p-8 rounded-lg shadow-lg w-full" 
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <h2 className="text-3xl font-bold text-center mb-8 text-white">Captain Signup</h2>
                    
                    <div className="space-y-6">
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstname" className="block text-sm font-medium mb-1">First Name</label>
                                <input 
                                    type="text" 
                                    id="firstname"
                                    name="firstname" 
                                    placeholder="First Name" 
                                    value={formData.firstname} 
                                    onChange={handleChange} 
                                    className={`w-full px-4 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.firstname ? "border-red-500" : "border-gray-600"
                                    }`}
                                />
                                {errors.firstname && (
                                    <p className="mt-1 text-sm text-red-500">{errors.firstname}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="lastname" className="block text-sm font-medium mb-1">Last Name</label>
                                <input 
                                    type="text" 
                                    id="lastname"
                                    name="lastname" 
                                    placeholder="Last Name" 
                                    value={formData.lastname} 
                                    onChange={handleChange} 
                                    className={`w-full px-4 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.lastname ? "border-red-500" : "border-gray-600"
                                    }`}
                                />
                                {errors.lastname && (
                                    <p className="mt-1 text-sm text-red-500">{errors.lastname}</p>
                                )}
                            </div>
                        </div>
                        
                        {/* Contact Information */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                            <input 
                                type="email" 
                                id="email"
                                name="email" 
                                placeholder="Email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                className={`w-full px-4 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.email ? "border-red-500" : "border-gray-600"
                                }`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="mobile_no" className="block text-sm font-medium mb-1">Mobile Number</label>
                            <input 
                                type="text" 
                                id="mobile_no"
                                name="mobile_no" 
                                placeholder="Mobile Number (10 digits)" 
                                value={formData.mobile_no} 
                                onChange={handleChange} 
                                className={`w-full px-4 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.mobile_no ? "border-red-500" : "border-gray-600"
                                }`}
                            />
                            {errors.mobile_no && (
                                <p className="mt-1 text-sm text-red-500">{errors.mobile_no}</p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                            <input 
                                type="password" 
                                id="password"
                                name="password" 
                                placeholder="Password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                className={`w-full px-4 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.password ? "border-red-500" : "border-gray-600"
                                }`}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-400">
                                Must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number
                            </p>
                        </div>
                        
                        {/* Vehicle Details Section */}
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-700">Vehicle Details</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="vehicleColor" className="block text-sm font-medium mb-1">Vehicle Color</label>
                                    <input 
                                        type="text" 
                                        id="vehicleColor"
                                        name="vehicleColor" 
                                        placeholder="Vehicle Color" 
                                        value={formData.vehicleColor} 
                                        onChange={handleChange} 
                                        className={`w-full px-4 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.vehicleColor ? "border-red-500" : "border-gray-600"
                                        }`}
                                    />
                                    {errors.vehicleColor && (
                                        <p className="mt-1 text-sm text-red-500">{errors.vehicleColor}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <label htmlFor="vehiclePlate" className="block text-sm font-medium mb-1">Vehicle Plate</label>
                                    <input 
                                        type="text" 
                                        id="vehiclePlate"
                                        name="vehiclePlate" 
                                        placeholder="Vehicle Plate" 
                                        value={formData.vehiclePlate} 
                                        onChange={handleChange} 
                                        className={`w-full px-4 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.vehiclePlate ? "border-red-500" : "border-gray-600"
                                        }`}
                                    />
                                    {errors.vehiclePlate && (
                                        <p className="mt-1 text-sm text-red-500">{errors.vehiclePlate}</p>
                                    )}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="vehicleCapacity" className="block text-sm font-medium mb-1">Capacity</label>
                                        <input 
                                            type="number" 
                                            id="vehicleCapacity"
                                            name="vehicleCapacity" 
                                            placeholder="Capacity" 
                                            value={formData.vehicleCapacity} 
                                            onChange={handleChange} 
                                            min="1" 
                                            className={`w-full px-4 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.vehicleCapacity ? "border-red-500" : "border-gray-600"
                                            }`}
                                        />
                                        {errors.vehicleCapacity && (
                                            <p className="mt-1 text-sm text-red-500">{errors.vehicleCapacity}</p>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="vehicleType" className="block text-sm font-medium mb-1">Vehicle Type</label>
                                        <select 
                                            id="vehicleType"
                                            name="vehicleType" 
                                            value={formData.vehicleType} 
                                            onChange={handleChange} 
                                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="car">Car</option>
                                            <option value="motorcycle">Motorcycle</option>
                                            <option value="auto">Auto</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg mt-8 font-bold hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Processing..." : "Sign Up"}
                    </button>
                    
                    {/* Continue as User */}
                    <div className="mt-6 text-center">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-3 bg-gray-800 text-sm text-gray-400">or</span>
                            </div>
                        </div>
                        
                        <Link to="/user-signup" className="block w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg mt-4 font-medium text-white transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                            Continue as User
                        </Link>
                    </div>
                    
                    {/* Login Link */}
                    <div className="text-center mt-4">
                        <p className="text-gray-400">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-400 hover:underline">
                                Login here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CaptainSignup;