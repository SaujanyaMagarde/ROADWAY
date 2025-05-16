import React, { useState } from 'react';
import { Star, MessageCircle, Phone, Shield, Clock, MapPin, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const CaptainProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  
  // Sample captain data
  const captain = {
    name: "Michael Johnson",
    rating: 4.8,
    reviews: 342,
    trips: 1583,
    experience: "3 years",
    car: "Toyota Camry",
    plate: "XYZ 123",
    languages: ["English", "Spanish"],
    about: "Professional driver with excellent knowledge of city routes. Always aim to provide a comfortable and safe ride for all passengers.",
    photo: "/api/placeholder/150/150"
  };

  const submitlogout = ()=>{
    console.log("hi")
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="px-4 py-3 bg-white shadow">
        <div className="flex items-center">
          <button className="mr-4 text-gray-700">
            <svg
              onClick={()=>(navigate('/captain-home'))}
            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">Captain Profile</h1>
        </div>
      </div>

      {/* Captain Info */}
      <div className="flex items-center p-4 bg-white">
        <div className="relative">
          <img 
            src={captain.photo} 
            alt={captain.name} 
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
          />
          <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-semibold">{captain.name}</h2>
          <div className="flex items-center mt-1">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="ml-1 text-gray-700">{captain.rating}</span>
            <span className="mx-1 text-gray-400">•</span>
            <span className="text-gray-500">{captain.reviews} reviews</span>
          </div>
          <div className="mt-1 text-gray-500">
            {captain.car} • {captain.plate}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b bg-white">
        <button 
          className={`flex-1 py-3 text-center ${activeTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('info')}
        >
          Information
        </button>
        <button 
          className={`flex-1 py-3 text-center ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'info' && (
          <div className="bg-white">
            <div className="p-4 border-b">
              <h3 className="font-medium mb-2">About</h3>
              <p className="text-gray-600">{captain.about}</p>
            </div>

            <div className="p-4 border-b">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <Clock size={18} className="text-gray-500" />
                  <span className="ml-3 text-gray-700">Experience</span>
                </div>
                <span className="text-gray-600">{captain.experience}</span>
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <MapPin size={18} className="text-gray-500" />
                  <span className="ml-3 text-gray-700">Total Trips</span>
                </div>
                <span className="text-gray-600">{captain.trips}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Shield size={18} className="text-gray-500" />
                  <span className="ml-3 text-gray-700">Languages</span>
                </div>
                <span className="text-gray-600">{captain.languages.join(", ")}</span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-medium mb-3">Contact</h3>
              
              <button className="flex items-center justify-between w-full p-3 mb-2 bg-gray-100 rounded-lg">
                <div className="flex items-center">
                  <MessageCircle size={18} className="text-gray-500" />
                  <span className="ml-3 text-gray-700">Message</span>
                </div>
                <ChevronRight size={18} className="text-gray-500" />
              </button>
              
              <button className="flex items-center justify-between w-full p-3 bg-gray-100 rounded-lg">
                <div className="flex items-center">
                  <Phone size={18} className="text-gray-500" />
                  <span className="ml-3 text-gray-700">Call</span>
                </div>
                <ChevronRight size={18} className="text-gray-500" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white p-4">
            {/* Sample reviews */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="mb-4 pb-4 border-b last:border-b-0">
                <div className="flex items-center mb-2">
                  <img 
                    src="/api/placeholder/40/40" 
                    alt="User" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <div className="font-medium">User {item}</div>
                    <div className="text-xs text-gray-500">March {item + 10}, 2025</div>
                  </div>
                  <div className="ml-auto flex items-center">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 text-sm">{4.5 + item * 0.1}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  {item === 1 && "Great experience! The captain was very professional and got me to my destination quickly."}
                  {item === 2 && "Very clean car and pleasant conversation. Would ride again!"}
                  {item === 3 && "Prompt, courteous, and took the fastest route. Excellent service overall."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="p-4 bg-white border-t">
        <button 
        onClick={()=>(submitlogout())}
        className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg">
          logout
        </button>
      </div>
    </div>
  );
};

export default CaptainProfilePage;