import React, { useRef, useState, useEffect } from 'react';
import logo from '../picture/logo.png';
import home_map from '../picture/home_map.gif';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import 'remixicon/fonts/remixicon.css';
import SearchPanel from '../components/SearchPanel.jsx';
import DriverSelection from '../components/DriverSelection.jsx';
import ConfromRide from '../components/ConfromRide.jsx';
import LookingforDriver from '../components/LookingforDriver.jsx'
import WaitforDriver from '../components/WaitforDriver.jsx'
function Home() {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [formPanel, setformPanel] = useState(true);
  const formPanelRef = useRef(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const [vehicalPanel, setvehicalPanel] = useState(false);
  const vechicalPanelRef = useRef(null);
  const [conformRidePanel , setconfromRidePanel] = useState(false);
  const conformPanelRef = useRef(null);
  const LookingforDriverRef = useRef(null);
  const [LookingforDriverPanel, setLookingforDriverPanel] = useState(false)
  const [waitingforDriver, setwaitingforDriver] = useState(false)
  const waitingforDriverRef = useRef(null)

  const submitHandler = (e) => {
    e.preventDefault(); // Fixed method name (was preventdefault)
  };
  
  useGSAP(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: '70%',
        padding: 20,
        duration: 0.3 // Added animation duration
      });
      gsap.to(panelCloseRef.current, {
        opacity: 1,
        duration: 0.2 // Added animation duration
      });
    } else {
      gsap.to(panelRef.current, {
        height: '0%',
        padding: 0,
        duration: 0.3 // Added animation duration
      });
      gsap.to(panelCloseRef.current, {
        opacity: 0,
        duration: 0.2 // Added animation duration
      });
    }
  }, [panelOpen]);

  useGSAP(() => {
    if (vehicalPanel) {
      gsap.to(vechicalPanelRef.current, {
        y: 0,  // Move it into view
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(vechicalPanelRef.current, {
        y: "100%",  // Move it out of view
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [vehicalPanel]);

  useGSAP(()=>{
    if (conformRidePanel) {
      gsap.to(conformPanelRef.current, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(conformPanelRef.current, {
        y: "100%",  // Move it out of view
        duration: 0.3,
        ease: "power2.in",
      });
    }
  },[conformRidePanel])

  useGSAP(()=>{
    if (LookingforDriverPanel) {
      gsap.to(LookingforDriverRef.current, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(LookingforDriverRef.current, {
        y: "100%",
        duration: 0.3,
        ease: "power2.in",
      });
    }
  },[LookingforDriverPanel])

  useGSAP(()=>{
    if (waitingforDriver) {
      gsap.to(waitingforDriverRef.current, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(waitingforDriverRef.current, {
        y: "100%",  // Move it out of view
        duration: 0.3,
        ease: "power2.in",
      });
    }
  },[waitingforDriver])


  return (
    <div className="h-screen relative"> {/* Fixed className (was 'h-screen' relative) */}
      <img className="w-25 absolute left-5 top-5" src={logo} alt="roadWay" />
      <div className="h-screen w-screen">
        <img className="h-full w-full object-cover" src={home_map} alt="map" /> {/* Added alt tag */}
      </div>

      <div 
      className="flex flex-col justify-end h-screen absolute top-0 w-full">
        <div ref={formPanelRef} className="h-[30%] p-5 pb-0 bg-white relative">
          <h3
            ref={panelCloseRef}
            onClick={() => setPanelOpen(false)} // Fixed function call (was setpanelOpen)
            className="absolute top-2 right-5 text-2xl opacity-0 cursor-pointer" // Added cursor-pointer
          >
            <i className="ri-arrow-down-wide-fill"></i>
          </h3>
          <h4 className="text-2xl font-bold">Find trip</h4>
          <form onSubmit={(e) => submitHandler(e)}>
            <div className="line absolute h-16 w-1 top-[33%] bg-gray-600 left-9 rounded-full"></div>
            <input
              className="input-field bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3 mb-3"
              type="text"
              value={pickup}
              onClick={() => setPanelOpen(true)} // Fixed function call (was setpanelOpen)
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Add a pickup location"
            />
            <input 
              className="input-field bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mb-3"
              type="text"
              value={destination}
              onClick={() => setPanelOpen(true)} // Fixed function call (was setpanelOpen)
              onChange={(e) => setDestination(e.target.value)} // Fixed function call (was setdestination)
              placeholder="Enter your destination"
            />
            <button 
              type="submit" 
              className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-600 transition-colors"
            >
              Find Ride
            </button>
          </form>
        </div>
        <div ref={panelRef} className="h-0 bg-white overflow-hidden"> {/* Added overflow-hidden */}
          <SearchPanel setvehicalPanel={setvehicalPanel} vehicalPanel={vehicalPanel}/>
        </div>
      </div>

      <div ref={vechicalPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 ' >
        <DriverSelection setvehicalPanel={setvehicalPanel} setconfromRidePanel={setconfromRidePanel} setPanelOpen={setPanelOpen}/>
      </div>

      <div ref={conformPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 ' >
        <ConfromRide setconfromRidePanel={setconfromRidePanel} setLookingforDriverPanel={setLookingforDriverPanel}/>
      </div>

      <div ref={LookingforDriverRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 ' >
        <LookingforDriver setLookingforDriverPanel={setLookingforDriverPanel} setwaitingforDriver={setwaitingforDriver}  LookingforDriverPanel={LookingforDriverPanel}/>
      </div>

      <div ref={waitingforDriverRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 ' >
        <WaitforDriver/>
      </div>

    </div>
  );
}

export default Home;