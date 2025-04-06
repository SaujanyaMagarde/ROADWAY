import React, { useState } from 'react';
import { User, MapPin, Calendar, Star, Clock, CreditCard, Settings, ChevronRight, Edit, Camera, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const UserProfile = () => {
    const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "/api/placeholder/128/128",
    joinDate: "March 2023",
    homeAddress: "123 Main Street, San Francisco",
    workAddress: "456 Market Street, San Francisco",
    rating: 4.92,
    ridesTaken: 247,
    favoriteDrivers: 5,
    paymentMethods: [
      { id: 1, type: "Credit Card", last4: "4242", default: true },
      { id: 2, type: "PayPal", email: "alex@example.com", default: false },
    ]
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <div className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Profile</h1>
        <i
        onClick={()=>(
            navigate('/user-home')
        )}
        class="ri-arrow-go-back-line"></i>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-xl mx-4 mt-4 shadow-md overflow-hidden">
        <div className="p-4 flex items-center">
          <div className="relative">
            <img 
              src={userData.avatar} 
              alt="Profile" 
              className="w-16 h-16 rounded-full mr-4 object-cover"
            />
            <div className="absolute bottom-0 right-2 bg-gray-100 rounded-full p-1">
              <Camera className="h-4 w-4 text-gray-600" />
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="font-bold text-lg">{userData.name}</h2>
            <p className="text-sm text-gray-500">{userData.email}</p>
            <div className="flex items-center mt-1">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm">{userData.rating}</span>
            </div>
          </div>
          
          <button className="bg-gray-100 p-2 rounded-full">
            <Edit className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-xl mx-4 mt-4 shadow-md">
        <div className="grid grid-cols-3 divide-x">
          <div className="p-4 text-center">
            <p className="text-xl font-bold">{userData.ridesTaken}</p>
            <p className="text-xs text-gray-500">Rides</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xl font-bold">{userData.favoriteDrivers}</p>
            <p className="text-xs text-gray-500">Favorites</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xl font-bold">{userData.joinDate}</p>
            <p className="text-xs text-gray-500">Member Since</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white rounded-xl mx-4 mt-4 shadow-md">
        <div className="divide-y">
          {/* Addresses */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">SAVED PLACES</h3>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-full mr-3">
                  <MapPin className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">Home</p>
                  <p className="text-sm text-gray-500">{userData.homeAddress}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-full mr-3">
                  <MapPin className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">Work</p>
                  <p className="text-sm text-gray-500">{userData.workAddress}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">PAYMENT</h3>
            
            {userData.paymentMethods.map(method => (
              <div key={method.id} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{method.type}</p>
                    <p className="text-sm text-gray-500">
                      {method.last4 ? `•••• ${method.last4}` : method.email}
                      {method.default && " (Default)"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            ))}
            
            <button className="mt-2 text-blue-600 font-medium text-sm">+ Add Payment Method</button>
          </div>
          
          {/* Account Settings */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">ACCOUNT</h3>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-full mr-3">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <p className="font-medium">Personal Information</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-full mr-3">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
                <p className="font-medium">Trip History</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-full mr-3">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <p className="font-medium">Scheduled Rides</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          {/* Logout */}
          <div className="p-4">
            <div className="flex items-center py-2 text-red-500">
              <div className="bg-red-50 p-2 rounded-full mr-3">
                <LogOut className="h-5 w-5 text-red-500" />
              </div>
              <p className="font-medium">Log Out</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* App Version */}
      <div className="mt-6 mb-8 text-center text-xs text-gray-400">
        <p>Uber Clone v1.0.4</p>
      </div>
    </div>
  );
};

export default UserProfile;