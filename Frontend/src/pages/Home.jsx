import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: "url(https://media.istockphoto.com/id/168258771/photo/on-the-road-over-sunset.jpg?s=612x612&w=0&k=20&c=45CESVjyRxj1NjqX-l-PVjVrvtU9Iep77J5mP3ZmC2c=)" }}>
      <div className="flex justify-center pt-10">
        <div className='text-7xl font-semibold'>roadWay</div>
      </div>
      <div className="absolute bottom-10 w-full text-center">
        <h2 className="text-white text-2xl font-semibold mb-4">get started with roadWay</h2>
        <Link to="/user-login" className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300">
          Continue
        </Link>
      </div>
    </div>
  );
}

export default Home;
