import React, { useRef, useState,useEffect } from 'react';
import logo from '../picture/logo.png';
import LiveLocationMap from '../components/LiveLocationMap.jsx';
import WaitforDriver from '../components/WaitforDriver.jsx';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import 'remixicon/fonts/remixicon.css';
import { useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { socket,initializeSocket,setConnected } from '../Store/SocketSlice.jsx';
import { store } from '../Store/Store.jsx';
function UserRide() {
  const waitingforDriverRef = useRef(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const ride = useSelector((state) => state.auth.rideData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const driverId = ride?.captainId;
  const driverLocation = useSelector(state => state.socket.driverLocation);

  //socket initialize
  store.dispatch(initializeSocket());
  dispatch(setConnected(true));

  const user = useSelector((state) => state.auth.userdata);
  const isConnected = useSelector((state) => state.socket.connected);

  useEffect(() => {
      if (user && isConnected) {
        socket.emit("join", {
          userId: user._id,
          userType: "user",
        });
        console.log("🧩 Emitted join event!", user._id, user.role);
        const handleMessage = (data) => {
          console.log("message comes");
          console.log(data);
          if(data.type === 'captain_location'){
            console.log("matched");
            console.log(data);
          }
        };
        socket.on("message", handleMessage);
        return () => {
          socket.off("message", handleMessage);
        };
      }
    }, [user, isConnected]);
  
  useGSAP(() => {
    if (!isPanelOpen) {
      gsap.to(waitingforDriverRef.current, {
        y: '100%',
        duration: 0.3,
        ease: 'power2.inOut',
      });
    } else if (isCollapsed) {
      gsap.to(waitingforDriverRef.current, {
        y: '60%',
        duration: 0.3,
        ease: 'power2.inOut',
      });
    } else {
      gsap.to(waitingforDriverRef.current, {
        y: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    }
  }, [isPanelOpen, isCollapsed]);

  return (
    <div className="h-screen relative">
      <img className="w-25 absolute right-4 top-15 z-20" src={logo} alt="roadWay" />
      <h2
        onClick={() => navigate('/user-profile')}
        className="w-15 h-15 absolute right-3 top-3 z-20"
      >
        <i className="ri-account-circle-2-line text-5xl"></i>
      </h2>

      <div className="h-screen w-screen absolute top-0 left-0 z-0 pointer-events-auto">
        <LiveLocationMap />
      </div>

      <div
        ref={waitingforDriverRef}
        className="fixed w-full z-40 bottom-0 translate-y-full bg-white px-3 py-6"
      >
        <WaitforDriver
          ride={ride}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          closePanel={() => setIsPanelOpen(false)}
        />
      </div>
    </div>
  );
}

export default UserRide;
