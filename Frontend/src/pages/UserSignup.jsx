import React, { useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios';
function UserSignup() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      newErrors.email = "Invalid email format";
    }

    // Mobile number validation (10-digit)
    const mobilePattern = /^[0-9]{10}$/;
    if (!mobilePattern.test(mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    // Password validation (at least 6 characters)
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    // File validation (Must be an image)
    if (!avatar) {
      newErrors.avatar = "Please upload an image";
    } else if (!avatar.type.startsWith("image/")) {
      newErrors.avatar = "Only image files are allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      const formData = new FormData(); // Use FormData for file upload
      formData.append('firstname', firstname);
      formData.append('lastname', lastname);
      formData.append('email', email);
      formData.append('mobile_no', mobile);
      formData.append('password', password);
      formData.append('avatar', avatar); // File upload
  
      try {
        const res = await axios.post(import.meta.env.VITE_USER_SIGNUP, formData, {
          withCredentials: true,  // ✅ Allow sending cookies
          headers: {
            'Content-Type': 'multipart/form-data', // ✅ Required for file uploads
          },
        });
  
        console.log(res);
        if (res.status === 201) {
          alert('Signup Successful!');
          navigate('/user-login'); // Redirect after successful signup
        }
      } catch (error) {
        alert('Signup failed, please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center bg-gradient-to-b from-amber-50 to-orange-50 px-4">
      <div className="w-full max-w-md mt-8 mb-6">
        <form 
          onSubmit={handleSubmit}
          className="w-full p-8 bg-white rounded-2xl shadow-xl border border-orange-100"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Join Us</h2>
          <p className="text-gray-600 text-center mb-8">Create your account and get started</p>
          
          <div className="space-y-5">
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input 
                id="firstname"
                required
                type="text"
                value={firstname}
                placeholder="First Name"
                className="w-full bg-orange-50 p-4 border border-orange-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input 
                id="lastname"
                required
                type="text"
                placeholder="Last Name"
                value={lastname}
                className="w-full bg-orange-50 p-4 border border-orange-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input 
                id="mobile"
                required
                type="text"
                value={mobile}
                placeholder="10-digit mobile number"
                className="w-full bg-orange-50 p-4 border border-orange-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                onChange={(e) => setMobile(e.target.value)}
              />
              {errors.mobile && <p className="text-red-600 text-sm mt-1">{errors.mobile}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                id="email"
                required
                value={email}
                type="email"
                placeholder="your@email.com"
                className="w-full bg-orange-50 p-4 border border-orange-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                required
                value={password}
                type="password"
                placeholder="Minimum 6 characters"
                className="w-full bg-orange-50 p-4 border border-orange-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>
            
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
              <div className="relative">
                <input 
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="w-full bg-orange-50 p-4 border border-orange-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                  onChange={(e) => setAvatar(e.target.files[0])}
                />
              </div>
              {errors.avatar && <p className="text-red-600 text-sm mt-1">{errors.avatar}</p>}
            </div>
          </div>
          
          <button className="w-full mt-8 py-4 text-white bg-orange-600 rounded-lg font-medium hover:bg-orange-700 transform hover:scale-[1.02] transition-all duration-300 shadow-md">
            Create Account
          </button>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/user-login" className="text-orange-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>

      <Link 
        to="/captain-login" 
        className="w-full max-w-md mt-auto mb-10 py-4 text-white bg-gray-800 rounded-lg font-medium hover:bg-black transition-all duration-300 text-center shadow-md transform hover:scale-[1.02]"
      >
        Sign in as Captain
      </Link>
    </div>
  );
}

export default UserSignup;