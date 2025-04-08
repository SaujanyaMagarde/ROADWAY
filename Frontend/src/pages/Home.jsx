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
import FormPanel from '../components/FormPanel.jsx';
import LiveLocationMap from '../components/LiveLocationMap.jsx';
import { useNavigate } from 'react-router-dom';
function Home() {
  const navigate = useNavigate();
  const [routedetails, setroutedetails] = useState(null)
  const [suggestion, setsuggestion] = useState([])
  const [pickup, setPickup] = useState({});
  const [destination, setDestination] = useState({});
  const [type , settype] = useState('');
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
  const [conformDetails, setconformDetails] = useState(null)
  
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
      <img className="w-25 absolute right-4 top-15 z-20" src={logo} alt="roadWay" />
      <h2
        onClick={()=>(
          navigate('/user-profile')
        )}
      className='w-15 h-15 absolute right-3 top-3 z-20'>
        <i className="ri-account-circle-2-line text-5xl"></i>
      </h2>
      <div className="h-screen w-screen absolute top-0 left-0 z-0 pointer-events-auto">
        <LiveLocationMap routedetails={routedetails} />
      </div>
      <div 
      className="flex flex-col justify-end h-screen absolute top-0 w-full">
        <div ref={formPanelRef} className="h-[30%] p-5 pb-0 bg-white relative z-30">
          <FormPanel setPanelOpen={setPanelOpen} panelCloseRef={panelCloseRef}  setsuggestion={setsuggestion} settype={settype} destination={destination} pickup={pickup} setDestination={setDestination} setPickup={setPickup} setvehicalPanel={setvehicalPanel} setroutedetails={setroutedetails}/>
        </div>
      <div ref={panelRef} className="h-0 bg-white overflow-hidden z-30"> {/* Added overflow-hidden */}
          <SearchPanel suggestion={suggestion} type={type} setDestination={setDestination} setPickup={setPickup}/>
        </div>
      </div>

      <div ref={vechicalPanelRef} className='fixed w-full z-40 bottom-0 translate-y-full bg-white px-3 py-6  ' >
        <DriverSelection setvehicalPanel={setvehicalPanel} setconfromRidePanel={setconfromRidePanel} setPanelOpen={setPanelOpen} pickup={pickup} destination={destination} routedetails={routedetails} setconformDetails={setconformDetails}/>
      </div>

      <div ref={conformPanelRef} className='fixed w-full z-40 bottom-0 translate-y-full bg-white px-3 py-6 ' >
        <ConfromRide setconfromRidePanel={setconfromRidePanel} setLookingforDriverPanel={setLookingforDriverPanel} conformDetails={conformDetails}/>
      </div>

      <div ref={LookingforDriverRef} className='fixed w-full z-40 bottom-0 translate-y-full bg-white px-3 py-6 ' >
        <LookingforDriver setLookingforDriverPanel={setLookingforDriverPanel} setwaitingforDriver={setwaitingforDriver}  LookingforDriverPanel={LookingforDriverPanel}  conformDetails={conformDetails}/>
      </div>

      <div ref={waitingforDriverRef} className='fixed w-full z-40 bottom-0 translate-y-full bg-white px-3 py-6 ' >
        <WaitforDriver setwaitingforDriver={setwaitingforDriver}/>
      </div>
    </div>
  );
}

export default Home;